import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    throw createHttpError(400, 'Avatar file is required');
  }

  let uploadResult;

  try {
    uploadResult = await saveFileToCloudinary(req.file.buffer, req.user._id);
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to upload avatar to cloud');
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: uploadResult.secure_url },
    { returnDocument: 'after' },
  );

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    url: updatedUser.avatar,
  });
};
