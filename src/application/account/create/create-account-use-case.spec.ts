import { FakeHasher } from 'test/cryptography/fake-hasher';
import { CreateAccountUseCase } from './create-account-use-case';
import { faker } from '@faker-js/faker';
import { AccountRepository } from '@/domain/account/account-repository';
import { InMemoryAccountRepository } from '@test/repositories/in-memory-account-repository';
import { makeUser } from '@test/factories/make-user';

let repository: AccountRepository;
let fakeHasher: FakeHasher;

let useCase: CreateAccountUseCase;

describe('Create Account', () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository();
    fakeHasher = new FakeHasher();

    useCase = new CreateAccountUseCase(repository, fakeHasher);
  });

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined();

    expect(repository).toBeDefined();
    expect(fakeHasher).toBeDefined();
  });

  it('should be able to create a new account', async () => {
    const result = await useCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.string.alphanumeric({
        length: 8,
      }),
      cpf: faker.string.numeric({
        length: 11,
      }),
    });

    const accountOnDatabase = await repository.findById(result.accountId);

    expect(result.accountId).toBeDefined();
    expect(accountOnDatabase).toBeDefined();
  });

  it('should hash account password upon registration', async () => {
    const passwordMocked = faker.string.alphanumeric({
      length: 8,
    });

    const result = await useCase.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordMocked,
      cpf: faker.string.numeric({
        length: 11,
      }),
    });

    const hashedPassword = await fakeHasher.hash(passwordMocked);

    const accountOnDatabase = await repository.findById(result.accountId);

    expect(result.accountId).toBeDefined();
    expect(accountOnDatabase).toBeDefined();
    expect(accountOnDatabase?.password).toEqual(hashedPassword);
  });

  it('should not be able to create an account with an email that already exists', async () => {
    const fakeUser = await makeUser({
      repository,
    })

    await expect(useCase.execute(fakeUser))
    .rejects.toThrowError(`Não foi possível criar a conta.`);
  });

  it('should not be able to create a passenger account by sending a car plate.', async () => {
    const fakeUser = await makeUser({
      override: {
        isPassenger: true,
        carPlate: faker.string.alphanumeric({
          length: 7
        })
      }
    })

    await expect(useCase.execute(fakeUser))
    .rejects.toThrowError(`Não foi possível criar a conta.`);
  })
});
