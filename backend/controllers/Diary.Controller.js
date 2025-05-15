import DiarySchema from "../models/DiarySchema.js";

const InsertDiaryData = async (req, res) => {
  try {
    const { text, emotions, date } = await req.body

    const newEntry = await new DiarySchema({
      text,
      emotions,
      date: date ? new Date(date) : new Date(),
    })

    const savedEntry = await newEntry.save()
    await res.status(201).json({ message: 'Diary entry saved', entry: savedEntry })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save diary entry' })
  }
};

export default InsertDiaryData;