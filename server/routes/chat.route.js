import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";
import { authentication } from "../middleware/auth.middleware.js";
import verifyInput from "../middleware/verify.middleware.js";

// The prefix is /api/chat
const router = Router();

// the id here is the user id
router.post("/:id", authentication, ChatController.accessChat);

// the id here is the chat id
router.post(
  "/sendMessage/:id",
  verifyInput,
  authentication,
  ChatController.sendMessage
);
router.get("/messages/:id", authentication, ChatController.getMessages);

export default router;
