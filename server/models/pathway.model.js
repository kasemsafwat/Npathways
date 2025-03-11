import mongoose from "mongoose";
const Schema=mongoose.Schema

const pathwaySchema=new Schema({
    name:{
        type:String,
        trim:true,
        required: true,
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    courses: [
        {        
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Course' 
        }
    ], 
})

const PathwayModel = mongoose.model('Pathway', pathwaySchema);
export default PathwayModel;
