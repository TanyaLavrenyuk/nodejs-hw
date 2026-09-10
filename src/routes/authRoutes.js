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
} from '../controllers/authController.js';

const authRouter = Router();

authRouter.post(
  '/auth/register',
  celebrate({ body: registerUserSchema }),
  registerUser,
);

authRouter.post('/auth/login', celebrate({ body: loginUserSchema }), loginUser);

authRouter.post('/auth/refresh', refreshUserSession);

authRouter.post('/auth/logout', logoutUser);

authRouter.post(
  '/auth/request-reset-email',
  celebrate({ body: requestResetEmailSchema }),
  requestResetEmail,
);

authRouter.post(
  '/auth/reset-password',
  celebrate({ body: resetPasswordSchema }),
  resetPassword,
);

export default authRouter;
