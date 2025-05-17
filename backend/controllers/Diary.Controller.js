import Diary from "../models/DiarySchema.js";

export const InsertDiaryData = async (req, res) => {
  const { text, emotions, summary, userId } = req.body;

  try {
    const newEntry = new Diary({
      text,
      emotions,
      summary,
      userId,
    });

    await newEntry.save();

    res.status(201).json({ message: "Entry saved", data: newEntry });
  } catch (error) {
    console.error("Error saving diary entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const GetDiaryData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const entries = await Diary.find({ userId }).sort({ date: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};
