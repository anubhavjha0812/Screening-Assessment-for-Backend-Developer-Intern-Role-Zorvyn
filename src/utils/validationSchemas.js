const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  description: z.string().optional(),
});

const updateRecordSchema = z.object({
  amount: z.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  description: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createUserSchema,
  updateUserSchema,
  createRecordSchema,
  updateRecordSchema
};
