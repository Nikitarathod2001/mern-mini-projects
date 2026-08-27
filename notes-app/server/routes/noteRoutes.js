import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import { createNote, getNotes, getNoteById, updateNote, deleteNote } from "../controllers/noteController.js";


const noteRouter = express.Router();

noteRouter.use(protect);

noteRouter.post("/", createNote);
noteRouter.get("/", getNotes);
noteRouter.get("/:id", getNoteById);
noteRouter.patch("/:id", updateNote);
noteRouter.delete("/:id", deleteNote);

export default noteRouter;