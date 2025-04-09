import CertificateModel from "../models/certificate.model.js";
import UserModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import PathwayModel from "../models/pathway.model.js";

class CertificateController {
  static async getAllCertificates(req, res) {
    try {
      const certificates = await CertificateModel.find();
      res.status(200).json(certificates);
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCertificateById(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
      }

      const certificate = await CertificateModel.findById(id);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json(certificate);
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // TODO: Add pathway and fix the logic so that
  // TODO: either a pathway or course is added
  static async createCertificate(req, res) {
    try {
      const { course: courseId, pathway: pathwayId } = req.body;

      if ((!courseId && !pathwayId) || (courseId && pathwayId)) {
        return res.status(400).json({
          message: "Either course or pathway is required",
        });
      }

      if (courseId) {
        if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        const certificate = await CertificateModel.create(req.body);

        return res.status(201).json(certificate);
      }

      if (pathwayId) {
        if (!pathwayId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ message: "Invalid pathway ID" });
        }

        const pathway = await PathwayModel.findById(pathwayId);

        if (!pathway) {
          return res.status(404).json({ message: "Pathway not found" });
        }

        const certificate = await CertificateModel.create(req.body);

        return res.status(201).json(certificate);
      } else {
        return res.status(400).json({
          message: "Invalid request",
        });
      }
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateCertificate(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
      }

      const certificate = await CertificateModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json(certificate);
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteCertificate(req, res) {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
      }

      const deletedCertificate = await CertificateModel.findByIdAndDelete(id);
      if (!deletedCertificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }
      res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async grantCertificate(req, res) {
    try {
      const { userId, certificateId } = req.body;

      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).json({ message: "Invalid user ID" });

      if (!certificateId || !certificateId.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).json({ message: "Invalid certificate ID" });

      const certificate = await CertificateModel.findById(certificateId);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasCertificate =
        user.certificates.find(
          (cert) => cert.id.toString() === certificateId.toString()
        ) !== undefined;

      if (hasCertificate) {
        return res
          .status(400)
          .json({ message: "User already has the certificate" });
      }

      user.certificates.push({ id: certificateId, name: certificate.name });
      await user.save();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Certificate granted successfully" });
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async getUserCertificates(req, res) {
    try {
      const userId = req.user._id;
      const certificates = await UserModel.findById(userId)
        .populate("certificates")
        .select("certificates")
        .then((user) => user.certificates);

      res.status(200).json(certificates);
    } catch (error) {
      console.error(`Error in certificate controller: ${error.message}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CertificateController;
