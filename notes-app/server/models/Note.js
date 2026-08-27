import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100,
  },

  content: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: String,
    enum: [
      "Personal",
      "Work",
      "Study",
      "Ideas",
      "Projects",
      "Todo",
      "Important",
      "Other",
    ],
    default: "Other",
  },

  isPinned: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;