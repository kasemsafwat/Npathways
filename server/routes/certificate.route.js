import { Router } from "express";
import CC from "../controllers/certificate.controller.js";
import verifyInput from "../middleware/verify.middleware.js";
import { authentication } from "../middleware/auth.middleware.js";

// The prefix is /api/certificate
const router = Router();

router.get("/", CC.getAllCertificates);
router.get("/userCertificates", authentication, CC.getUserCertificates);
router.get("/:id", CC.getCertificateById);
router.post("/createCertificate", verifyInput, CC.createCertificate);
router.put("/updateCertificate/:id", verifyInput, CC.updateCertificate);
router.delete("/deleteCertificate/:id", CC.deleteCertificate);

// TODO Add admin/instructor auth
router.post("/grantCertificate", CC.grantCertificate);

export default router;
