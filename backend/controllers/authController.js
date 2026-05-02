const authService = require('../services/AuthService');
const { z } = require('zod');

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string(),
});

exports.register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.registerUser(validatedData);
    
    res.status(201).json({
      status: 'success',
      token: result.token,
      data: { user: result.user },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: 'fail', message: error.errors });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData.email, validatedData.password);

    res.status(200).json({
      status: 'success',
      token: result.token,
      data: { user: result.user },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: 'fail', message: error.errors });
    }
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
