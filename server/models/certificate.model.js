import { Schema, model } from 'mongoose';

const certificateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  pathway: {
    type: Schema.Types.ObjectId,
    ref: 'Pathway',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Certificate = model('Certificate', certificateSchema);

export default Certificate;
