import express from 'express'
import {InsertDiaryData,GetDiaryData} from '../controllers/Diary.Controller.js'

const Diaryrouter = express.Router()

Diaryrouter.post("/",InsertDiaryData);
Diaryrouter.get("/:userId",GetDiaryData)

export default Diaryrouter
