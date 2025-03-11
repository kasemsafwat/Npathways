 import PathwayModel from "../models/pathway.model.js"
 import CourseModel from "../models/course.model.js"
import mongoose from "mongoose";
const PathwayController={
      createPathWay:async(req,res)=>{
        try {
              const { name, courses } = req.body;
              const existingCourses = await CourseModel.find({
                _id: { $in: courses },
                });

                if (existingCourses.length !== courses.length) {
                    return res.status(400).send({
                        message: "One or more course IDs do not exist in the Course collection.",
                    });
                }
    
            const pathway = await PathwayModel.create({
              name,
              courses,
          });

          res.status(201).send({
              message: "Pathway created successfully!",
              data: pathway,
          });
        
        }catch(error){
            console.error(`Error in PathWay controller: ${error}`);
            return res.status(500).send({
                message: 'PathWayController: ' + error.message
            });
        }
      },
      getAllPathway:async(req,res)=>{
         try {
            let pathways=await PathwayModel.find({})
            .populate('courses', 'name description requiredExams instructors lessons');
            res.status(201).send({
                    message: 'All PathWays !',
                     data: pathways,
                });     
         }catch(error){
            console.error(`Error in PathWay controller: ${error}`);
            return res.status(500).send({
                message: 'PathWayController: ' + error.message
            });
         }
      },
      // todo ==> validation
       updatePathway:async(req,res)=>{
        try {
            const { id } = req.params;
            const { name,courses} = req.body;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).send({ error: 'Invalid PathWay ID' });
            }
            const pathway = await PathwayModel.findByIdAndUpdate(id,{ name,courses},{ new: true });
              if (!pathway) {
                return res.status(404).send({ error: 'PathWays not found' });
              }
              res.status(200).send({
                message: 'Pathway Updates successfully!',
                data: pathway,
            });   

        }catch(error){
            console.error(`Error in PathWay controller: ${error}`);
            return res.status(500).send({
                message: 'PathWayController: ' + error.message
            });
        }
      },
      deletePathWay:async(req,res)=>{
        try {
              let {id}=req.params
              if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: 'Invalid Pathway ID' });
              }
              const deletedPathWay =await PathwayModel.findByIdAndDelete(id);
              if (!deletedPathWay) {
                return res.status(404).json({ error: 'PathWay not found' });
              }
              res.status(200).send(
                { message: 'PathWay deleted successfully' }
            )
        }catch(error){
            console.error(`Error in PathWay controller: ${error}`);
            return res.status(500).send({
                message: 'PathWayController: ' + error.message
            });
        }
      },
   
      getPathwayById:async(req,res)=>{
          try{
            let {id}=req.params
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ error: 'Invalid Pathway ID' });
              }
            const Pathay =await PathwayModel.findById(id)
            .populate('courses', 'name description requiredExams instructors lessons');

            if (!Pathay) {
            return res.status(404).json({ error: 'PathWay not found' });
            }
            res.status(200).send(
                { message: 'this is pathway ' ,
                        data:Pathay

                }
            )

          }catch(error){
            console.error(`Error in PathWay controller: ${error}`);
            return res.status(500).send({
                message: 'PathWayController: ' + error.message
            });

          }
      },
    addCourse: async (req, res) => {
      try {
          let { id } = req.params;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
              return res.status(400).json({ error: 'Invalid Pathway ID' });
          }
          let { courses } = req.body;
            let pathway = await PathwayModel.findById(id);
          if (!pathway) {
              return res.status(404).send({
                  message: "Pathway Not Found"
              });
          }
          pathway.courses = [...pathway.courses, ...courses];
            await pathway.save();
  
          res.send({
              message: "Courses Added Successfully"
          });
      } catch (error) {
          console.error(`Error in Pathway controller: ${error}`);
          return res.status(500).send({
              message: 'PathwayController: ' + error.message
          });
      }
  },

    RemoveCourse: async (req, res) => {
      try {
          let { id } = req.params;
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
              return res.status(400).json({ error: 'Invalid Pathway ID' });
          }

          let { courses } = req.body;
          let pathway = await PathwayModel.findById(id);
          if (!pathway) {
              return res.status(404).send({
                  message: "Pathway Not Found"
              });
          }
          pathway.courses = pathway.courses.filter(
              course => !courses.includes(course.toString())
          );
          await pathway.save();

          res.send({
              message: "Courses Removed Successfully"
          });
      } catch (error) {
          console.error(`Error in Pathway controller: ${error}`);
          return res.status(500).send({
              message: 'PathwayController: ' + error.message
          });
      }
    },
    // Student 
    getAllPathwayByUser:async(req,res)=>{
        try {
           let pathways=await PathwayModel.find({})   
           res.status(201).send({
                   message: 'All PathWays !',
                    data: pathways,
               });     
        }catch(error){
           console.error(`Error in PathWay controller: ${error}`);
           return res.status(500).send({
               message: 'PathWayController: ' + error.message
           });
        }
     },
     getPathwayByIdByUser:async(req,res)=>{
        try{
          let {id}=req.params
          if (!id.match(/^[0-9a-fA-F]{24}$/)) {
              return res.status(400).json({ error: 'Invalid Pathway ID' });
            }
          const Pathay =await PathwayModel.findById(id);
          if (!Pathay) {
          return res.status(404).json({ error: 'PathWay not found' });
          }
          res.status(200).send(
              { message: 'this is pathway ' ,
                      data:Pathay

              }
          )

        }catch(error){
          console.error(`Error in PathWay controller: ${error}`);
          return res.status(500).send({
              message: 'PathWayController: ' + error.message
          });

        }
    },

}
export default PathwayController;
