import express from "express";
import PaymentController from "../controllers/payment.controller.js";
import { authentication } from "../middleware/auth.middleware.js";

const router = express.Router();

// http://localhost:5024/api/payment/create-session
router.post(
  "/create-session",
  authentication,
  PaymentController.createSessionUrl
);
router.get("/complete", PaymentController.complete);

// https://6078-154-182-3-159.ngrok-free.app/api/payment/webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhook
);

export default router;
