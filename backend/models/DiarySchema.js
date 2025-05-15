import mongoose from 'mongoose'

const DiaryEntrySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  emotions: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  summary: {
    type: String,
    required:false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},{timeseries:true});

const DiarySchema=await mongoose.model("Diary",DiaryEntrySchema);

export default DiarySchema;