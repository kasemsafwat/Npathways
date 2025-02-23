import express from 'express';
const router=express.Router()
import auhRouter from "./user.route.js"


router.use('/auth',auhRouter)

export default router