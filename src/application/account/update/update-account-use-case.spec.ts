import { makeUser } from "test/factories/make-user";
import { faker } from "@faker-js/faker";
import { AccountRepository } from "@/domain/account/account-repository";
import { UpdateAccountUseCase, UpdateAccountUseCaseRequest } from "./update-account-use-case";
import { InMemoryAccountRepository } from "@test/repositories/in-memory-account-repository";
import NotificationException from "@/core/exception/notification-exception";

let repository: AccountRepository
let useCase: UpdateAccountUseCase

describe('Update Account', () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository()
    useCase = new UpdateAccountUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should not be able to edit an account that does not exist', async () => {
    const fakeUserId = faker.string.alphanumeric({
      length: 8
    })

    await expect(useCase.execute({
      id: fakeUserId
    }))
      .rejects.toThrowError(`Usuário com ID ${fakeUserId} não foi encontrado`)
  })

  it('should be able to update an account', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    const newUser = await makeUser({
      override: {
        id: userId,
        isPassenger: true,
      },
      repository,
    })

    await repository.create(newUser)

    const updateUser: UpdateAccountUseCaseRequest = {
      id: userId,
      name: 'user-02',
    }

    await useCase.execute(updateUser)

    const userOnDatabase = await repository.findById(userId)

    expect(userOnDatabase?.id.toString()).toBe(userId)
    expect(userOnDatabase?.name).toBe(updateUser.name)
    expect(userOnDatabase?.isPassenger).toBe(newUser.isPassenger)
    expect(userOnDatabase?.isDriver).toBe(newUser.isDriver)
    expect(userOnDatabase?.carPlate).toBe(newUser.carPlate)
  })

  it('should not allow a passenger to have a car plate', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    });

    await makeUser({
      override: {
        id: userId,
        isPassenger: true,
      },
      repository,
    });

    const updateUser: UpdateAccountUseCaseRequest = {
      id: userId,
      carPlate: 'ABC-1234',
    };

    try {
      await useCase.execute(updateUser);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationException)
      if (error instanceof NotificationException) {
        expect(error.getErrors()[0].message).toBe('Passageiros não podem ter uma placa de carro registrada.');
      }
    }
  });

  it('should require a car plate for a driver', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    });

    await makeUser({
      override: {
        id: userId,
        isDriver: true,
        carPlate: undefined,
      },
      repository,
    });

    const updateUser: UpdateAccountUseCaseRequest = {
      id: userId,
      isDriver: true,
    };

    try {
      await useCase.execute(updateUser);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationException)
      if (error instanceof NotificationException) {
        expect(error.getErrors()[0].message).toBe('Motoristas devem informar a placa do carro.');
      }
    }
  });

  it('should not allow a user to be both driver and passenger', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    });

    await makeUser({
      override: {
        id: userId,
        isPassenger: true,
      },
      repository,
    });

    const updateUser: UpdateAccountUseCaseRequest = {
      id: userId,
      isPassenger: true,
      isDriver: true,
    };

    try {
      await useCase.execute(updateUser);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationException)
      if (error instanceof NotificationException) {
        expect(error.getErrors()[0].message).toBe('Um usuário não pode ser designado como motorista e passageiro ao mesmo tempo.');
      }
    }
  });

  it('should require either driver or passenger role to be selected', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    });

    await makeUser({
      override: {
        id: userId,
        isPassenger: true,
      },
      repository,
    });

    const updateUser: UpdateAccountUseCaseRequest = {
      id: userId,
      isPassenger: false,
      isDriver: false,
    };

    try {
      await useCase.execute(updateUser);
    } catch (error) {
      expect(error).toBeInstanceOf(NotificationException)
      if (error instanceof NotificationException) {
        expect(error.getErrors()[0].message).toBe('É necessário selecionar se o usuário é motorista ou passageiro.');
      }
    }
  });
})