import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/Payment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const enroll = async (userId, courseId) => {
  await User.findByIdAndUpdate(userId, {
    $addToSet: { courses: courseId },
  });
  //  await Course.findByIdAndUpdate(courseId, {
  //   $addToSet: { students: userId }
  // });
};

const PaymentController = {
  createSessionUrl: async (req, res) => {
    try {
      const { courseId } = req.body;
      if (!courseId)
        return res.status(400).json({ message: "courseId required" });

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: req.user.email,
        client_reference_id: courseId,
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.name,
                description: course.description,
                // images: course.image ? [course.image] : [],
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.BASE_URL}/api/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/payment/cancel`,
      });

      const payment = await Payment.create({
        user: req.user.id,
        course: courseId,
        paymentMethod: "stripe",
        amount: course.price,
        paymentStatus: "pending",
        transactionId: session.id,
      });

      res.status(200).json({
        message: "Checkout session created",
        sessionId: session.id,
        sessionUrl: session.url,
        payment,
      });
    } catch (err) {
      console.error("createSessionUrl error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  complete: async (req, res) => {
    try {
      const { session_id } = req.query;
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== "paid") {
        return res.status(400).send("Payment not completed");
      }
      const payment = await Payment.findOneAndUpdate(
        { transactionId: session.id },
        { paymentStatus: "completed", paidAt: new Date() },
        { new: true }
      );

      if (!payment) {
        console.error("No Payment record for session", session.id);
        return res.status(404).send("Payment record not found");
      }

      await enroll(payment.user, payment.course);

      res.send("Your payment was successfully completed and you are enrolled!");
    } catch (err) {
      console.error("complete error:", err);
      res.status(500).send("Payment completion failed");
    }
  },
  handleStripeWebhook: async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
      console.error(" Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        if (session.payment_status === "paid") {
          const payment = await Payment.findOneAndUpdate(
            { transactionId: session.id },
            { paymentStatus: "completed", paidAt: new Date() },
            { new: true }
          );

          if (!payment) {
            console.error("No Payment record found for session", session.id);
          } else {
            await enroll(payment.user, payment.course);
            console.log(
              `User ${payment.user} enrolled in course ${payment.course}`
            );
          }
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Error processing webhook event:", err);
      res.status(500).send("Internal Server Error");
    }
  },

  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.find()
        .populate("user", "firstName lastName email")
        .populate("course", "name description price image");

      res.status(200).json(payments);
    } catch (err) {
      console.error("getAllPayments error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};

export default PaymentController;
