import mongoose from 'mongoose';

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
    default: Date.now,
  },
  summary: {
    type: String,
    required: false,
  },
  userId: {
    type: String, 
    required: true,
  },
});

const Diary = mongoose.model('Diary', DiaryEntrySchema);

export default Diary;
