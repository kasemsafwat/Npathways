import { Router } from "express";
import CC from "../controllers/certificate.controller.js";
import verifyInput from "../middleware/verify.middleware.js";
import { authentication } from "../middleware/auth.middleware.js";
import { protectRoutes, allowTo } from "../middleware/AuthAdmin.middleware.js";

// The prefix is /api/certificate
const router = Router();

router.get("/", protectRoutes, allowTo("admin"), CC.getAllCertificates);
router.get("/userCertificates", authentication, CC.getUserCertificates);
router.get("/:id", protectRoutes, allowTo("admin"), CC.getCertificateById);
router.post(
  "/createCertificate",
  protectRoutes,
  allowTo("admin"),
  verifyInput,
  CC.createCertificate
);
router.put(
  "/updateCertificate/:id",
  protectRoutes,
  allowTo("admin"),
  verifyInput,
  CC.updateCertificate
);
router.delete(
  "/deleteCertificate/:id",
  protectRoutes,
  allowTo("admin"),
  CC.deleteCertificate
);

// TODO Add admin/instructor auth
router.post(
  "/grantCertificate",
  protectRoutes,
  allowTo("admin"),
  CC.grantCertificate
);

export default router;
