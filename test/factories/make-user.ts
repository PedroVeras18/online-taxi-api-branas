import { faker } from '@faker-js/faker';

import { FactoryProp } from '.';
import { Account, AccountID, AccountProps } from '@/domain/account/account';

export async function makeUser({
  repository,
  override,
}: FactoryProp<
  AccountProps,
  Partial<
    AccountProps & {
      id: string;
    }
  >
> = {}): Promise<Account> {
  const user = Account.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      cpf: faker.string.numeric({
        length: 11,
      }),
      ...override,
    },
    new AccountID(override?.id),
  );

  if (repository) {
    await repository.create(user);
  }

  return user;
}
