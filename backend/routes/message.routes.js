import express from "express";
import protectRoute from "../middleware/protectroute.js";
import { sendMessage, getMessages} from "../controllers/message.controller.js";
const router = express.Router();

router.post("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;  