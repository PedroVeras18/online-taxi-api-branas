import { z } from 'zod';

export class PaginationParamsValidator {
  public rules = z.object({
    page: z.number().int().positive().optional().default(1),
    perPage: z.number().int().min(0).optional().default(10),
  });

  constructor(params: unknown) {
    this.validate(params);
  }

  public validate(params: unknown): void {
    const result = this.rules.safeParse(params);

    if (!result.success) {
      throw new Error('domain.pagination.invalid-params');
    }
  }
}
