import { z } from 'zod';

export const TaskMessage = z.object({
  taskId: z.string().uuid(),
  searchHash: z.string(),
  alphabet: z.string(),
  batchStart: z.number(),
  batchEnd: z.number(),
});

export const ResultMessage = z.object({
  taskId: z.string().uuid(),
  searchHash: z.string(),
  originalMessage: z.string(),
});
