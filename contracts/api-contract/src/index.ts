import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const contract = c.router({
  getPreviousResults: {
    method: 'GET',
    path: '/',
    responses: {
      200: z.string(),
    },
    summary: 'Get results from previous runs',
  },
  getStringFromHashsum: {
    method: 'POST',
    path: '/string-from-hashsum',
    responses: {
      200: z.string(),
      303: z.string(),
    },
    body: z.object({
      maxLength: z.number().max(10),
      searchHash: z.string(),
    }),
    summary: 'Post a new hash to be cracked',
  },
});
