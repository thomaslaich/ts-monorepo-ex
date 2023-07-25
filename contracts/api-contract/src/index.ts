import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const contract = c.router({
  getHealth: {
    method: 'GET',
    path: '/health',
    responses: {
      200: z.string(),
    },
    summary: 'Get server health',
  },
  getStringFromHashsum: {
    method: 'POST',
    path: '/string-from-hashsum',
    responses: {
      200: z.object({
        result: z.string(),
      }),
    },
    body: z.object({
      maxLength: z.number().max(10),
      searchHash: z.string(),
    }),
    summary: 'Retreve the string that generated the given search hash',
  },
});
