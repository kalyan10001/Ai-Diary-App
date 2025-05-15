import express from 'express'
import InsertDiaryData from '../controllers/Diary.Controller.js';

const Diaryrouter = express.Router()

Diaryrouter.post("/diary",InsertDiaryData);

export default Diaryrouter
