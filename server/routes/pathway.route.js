import express from 'express';
const router = express.Router();
import { authentication } from '../middleware/auth.middleware.js';
import PathwayController from "../controllers/pathway.controller.js"
import {newPathWayValidation} from "../middleware/pathway.middleware.js"
import { protectRoutes  ,allowTo} from '../middleware/AuthAdmin.middleware.js';


// By Admin
router.post("/admin",protectRoutes,allowTo('admin'),newPathWayValidation,PathwayController.createPathWay)
router.get("/admin",protectRoutes,allowTo('admin','instructor'),PathwayController.getAllPathway)
router.get("/admin/:id",protectRoutes,allowTo('admin','instructor'),PathwayController.getPathwayById)
router.patch("/admin/:id",protectRoutes,allowTo('admin'),PathwayController.updatePathway)
router.delete("/admin/:id",protectRoutes,allowTo('admin'),PathwayController.deletePathWay)

// todo  To Add Course  ==> make middleware
router.post("/admin/:id/courses",protectRoutes,allowTo('admin'),PathwayController.addCourse)
router.delete("/admin/:id/courses",protectRoutes,allowTo('admin'),PathwayController.RemoveCourse)

// By User 

router.get("/student",authentication,PathwayController.getAllPathwayByUser)
router.get("/student/:id",authentication,PathwayController.getPathwayByIdByUser)

export default router;


