import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.model.js";
import CourseModel from "../models/course.model.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PaymentController = {
  createSessionUrl: async (req, res) => {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ message: "CourseId is required." });
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: req.user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.name,
                description: course.description,
                images: [course.image],
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        client_reference_id: courseId,
        mode: "payment",
        success_url: `${process.env.BASE_URL}/api/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:5024/payment/cancel",
      });

      const paymentRecord = await Payment.create({
        user: req.user.id,
        course: courseId,
        paymentMethod: "stripe",
        amount: course.price,
        paymentStatus: "pending",
        transactionId: session.id,
        paidAt: new Date(),
      });

      return res.status(200).json({
        message: "Course purchase initiated. Awaiting payment completion.",
        course,
        student: {
          id: req.user.id,
          email: req.user.email,
        },
        payment: paymentRecord,
        sessionId: session.id,
        sessionUrl: session.url,
      });
    } catch (error) {
      console.error("Checkout session error:", error.message);
      return res.status(500).json({
        message: "Failed to create checkout session",
        error: error.message,
      });
    }
  },

  complete: async (req, res) => {
    try {
      let session = await stripe.checkout.sessions.retrieve(
        req.query.session_id,
        { expand: ["payment_intent.payment_method"] }
      );
      console.log(session);

      if (session.payment_status === "paid") {
        const paymentRecord = await Payment.findOneAndUpdate(
          { transactionId: session.id },
          { paymentStatus: "completed", paidAt: new Date() },
          { new: true }
        );

        console.log("Payment completed and updated in DB:", paymentRecord);
        res.send("Your payment was successfully completed!");
      } else {
        res.status(400).send("Payment was not successful.");
      }
    } catch (error) {
      console.error("Error completing payment:", error.message);
      res.status(500).send("Payment failed");
    }
  },

  // Handle Stripe webhook events
  handleStripeWebhook: async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(req.rawBody, sig, secret);

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          if (session.payment_status === "paid") {
            await Payment.findOneAndUpdate(
              { transactionId: session.id },
              { paymentStatus: "completed", paidAt: new Date() }
            );
          }
          break;

        case "checkout.session.async_payment_failed":
          await Payment.findOneAndUpdate(
            { transactionId: event.data.object.id },
            { paymentStatus: "failed" }
          );
          break;
      }

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
};

export default PaymentController;
