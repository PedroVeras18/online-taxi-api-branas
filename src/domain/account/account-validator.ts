import { z } from 'zod'

import { ZodValidator } from '@/core/validation/zod-validator';

export class AccountValidator extends ZodValidator {
  protected rules = z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string().length(11),
    carPlate: z.string().optional(),
    password: z.string(),
    isPassenger: z.boolean().optional(),
    isDriver: z.boolean().optional(),
  });
}
