import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';


export const protectRoutes = async (req, res, next) => {
    try {
        let {token}=req.headers
        if(!token){
            return res.status(401).send({
                message: 'Unauthorized user',
                // message: 'PLease Provide Token',
        });       
      }
      let secretKey=process.env.SECRET_KEY
    //   console.log(secretKey);
      let decoded=await jwt.verify(token,secretKey)
      console.log(decoded);
      let admin=await Admin.findById(decoded.id)
      if(!admin){
        return res.status(401).send({
            message: 'Unauthorized user',
            // message: 'Invalid User',
         });       
      }
      req.admin=admin
      next()
      

    }catch(error){
        console.error('Authentication Error:', error);
          return res.status(500).send({
            message: 'Authentication: ' + error.message,
          });
    }
  
  };

export const allowTo =(...roles)=> {
    return (req, res, next) => {
        try {
            // console.log(roles,req.admin);
            if (!roles.includes(req.admin.role)) {
                return res.status(403).json({
                  message: 'You do not have permission to perform this action.',
                });
              }
          next();
        } catch (error) {
          console.error('Role Check Error:', error);
          return res.status(500).json({
            message: 'An error occurred while checking permissions.',
          });
        }
      };
}