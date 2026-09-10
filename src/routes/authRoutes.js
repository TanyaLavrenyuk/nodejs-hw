import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
  updateUserAvatar,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const authRouter = Router();

authRouter.post(
  '/register',
  celebrate({ body: registerUserSchema }),
  registerUser,
);

authRouter.post('/login', celebrate({ body: loginUserSchema }), loginUser);

authRouter.post('/refresh', refreshUserSession);

authRouter.post('/logout', logoutUser);

authRouter.post(
  '/send-reset-email',
  celebrate({ body: requestResetEmailSchema }),
  requestResetEmail,
);

authRouter.post(
  '/reset-pwd',
  celebrate({ body: resetPasswordSchema }),
  resetPassword,
);

authRouter.patch(
  '/update-avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

export default authRouter;
