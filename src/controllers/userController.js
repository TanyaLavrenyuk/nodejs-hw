import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  let photoUrl;

  try {
    photoUrl = await saveFileToCloudinary(req.file);
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to upload avatar to cloud');
  } finally {
    await fs.unlink(req.file.path).catch((err) => console.error(err));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: photoUrl },
    { new: true },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Avatar updated successfully',
    data: updatedUser,
  });
};
