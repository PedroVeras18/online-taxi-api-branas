import { z } from 'zod';

import { transformZodIssue } from '../utils/transform-zod-issue';
import { ValueObject } from '../value-object';

import { ValidationHandler } from './validation-handler';
import Validator from './validator';
import Entity from '../entity';

export class ZodValidator extends Validator {
  protected readonly rules: z.ZodType<unknown>;

  constructor(
    protected readonly aCore: Entity<unknown> | ValueObject<unknown>,
    protected readonly aHandler: ValidationHandler,
    public readonly context: string,
  ) {
    super(aHandler);
  }

  private getCoreData(core: Entity<unknown> | ValueObject<unknown>): unknown {
    if (core instanceof Entity) {
      return core.toJSON();
    }
    return core.value;
  }

  validate(): void {
    const result = this.rules.safeParse(this.getCoreData(this.aCore));

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        this.validationHandler().appendAnError(
          transformZodIssue(issue, this.context),
        );
      });
    }
  }
}
