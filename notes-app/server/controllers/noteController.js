import Note from "../models/Note.js";

// ----------- Create a Note ----------------------
export const createNote = async (req, res) => {
  try {

    const {title, content, category} = req.body;

    const note = await Note.create({
      title, content, category,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      error: error.message,
    });
  }
};


// ------------------ Get all notes ----------------
export const getNotes = async (req, res) => {
  try {

    const notes = await Note.find().sort({createdAt: -1});

    res.status(200).json({
      success: true,
      notes,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};


// --------------- Get a single note ---------------------
export const getNoteById = async (req, res) => {
  try {

    const note = await Note.findById(req.params.id);

    if(!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};


// ------------ Update a note -------------------
export const updateNote = async (req, res) => {
  try {

    const {title, content, category, isPinned} = req.body;

    const updates = {};

    if(title !== undefined) {
      updates.title = title;
    }
    if(content !== undefined) {
      updates.content = content;
    }
    if(category !== undefined) {
      updates.category = category;
    }
    if(isPinned !== undefined) {
      updates.isPinned = isPinned;
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if(!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};


// --------------- Delete a note ------------
export const deleteNote = async (req, res) => {
  try {

    const note = await Note.findByIdAndDelete(req.params.id);

    if(!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};