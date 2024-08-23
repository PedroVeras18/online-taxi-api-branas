import { z } from 'zod';

import { ZodValidator } from '@/core/validation/zod-validator';
import Name from '../value-objects/name';
import Email from '../value-objects/email';
import Cpf from '../value-objects/cpf';
import CarPlate from '../value-objects/car-plate';
import { PasswordPlain } from '../value-objects/password';

export class AccountValidator extends ZodValidator {
  protected rules = z.object({
    name: z.instanceof(Name),
    email: z.instanceof(Email),
    cpf: z.instanceof(Cpf),
    carPlate: z.instanceof(CarPlate).optional(),
    password: z.instanceof(PasswordPlain),
    isPassenger: z.boolean().optional(),
    isDriver: z.boolean().optional(),
  });
}
