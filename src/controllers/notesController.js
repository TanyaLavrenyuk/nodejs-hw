import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const userId = req.user._id;

  const parsedPage = parseInt(page);
  const parsedPerPage = parseInt(perPage);
  const skip = (parsedPage - 1) * parsedPerPage;

  const notesQuery = Note.find({ userId });

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery.skip(skip).limit(parsedPerPage),
    Note.countDocuments(notesQuery.getFilter()),
  ]);

  const totalPages = Math.ceil(totalNotes / parsedPerPage);

  res.status(200).json({
    page: parsedPage,
    perPage: parsedPerPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const userId = req.user._id;
  const note = await Note.create({ ...req.body, userId });
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const note = await Note.findOneAndUpdate({ _id: noteId, userId }, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
