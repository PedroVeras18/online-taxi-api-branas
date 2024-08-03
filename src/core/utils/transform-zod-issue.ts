import { z } from 'zod';

import Error from '../validation/error';

export function transformZodIssue(issue: z.ZodIssue, context?: string): Error {
  const field = context
    ? `${context}.${issue.path.join('.')}`
    : `${issue.path.join('.')}`;

  switch (issue.code) {
    case z.ZodIssueCode.too_big:
      return new Error(issue.message, {
        field,
        max: issue.maximum.toString(),
      });
    case z.ZodIssueCode.too_small:
      return new Error(issue.message, {
        field,
        min: issue.minimum.toString(),
      });
    default:
      return new Error(issue.message, {
        field,
      });
  }
}
