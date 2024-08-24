import { makeUser } from "test/factories/make-user";
import { faker } from "@faker-js/faker";
import { AccountRepository } from "@/domain/account/account-repository";
import { InMemoryAccountRepository } from "@test/repositories/in-memory-account-repository";
import { DeleteAccountUseCase } from "./delete-account-use-case";

let repository: AccountRepository
let useCase: DeleteAccountUseCase

describe('Update Account', () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository()
    useCase = new DeleteAccountUseCase(repository)
  })

  it('dependencies should be defined', (): void => {
    expect(useCase).toBeDefined()
    expect(repository).toBeDefined()
  })

  it('should not be able to delete an account that does not exist', async () => {
    const fakeUserId = faker.string.alphanumeric({
      length: 8
    })

    await expect(useCase.execute({
      userId: fakeUserId
    }))
      .rejects.toThrowError(`Usuário com ID ${fakeUserId} não foi encontrado`)
  })

  it('should be able to delete an account', async () => {
    const userId = faker.string.alphanumeric({
      length: 8
    })

    await makeUser({
      override: {
        id: userId,
        isPassenger: true,
      },
      repository,
    })

    await useCase.execute({
      userId,
    })

    const userOnDatabase = await repository.findById(userId)

    expect(userOnDatabase?.id.toString()).toBe(userId)
    expect(userOnDatabase?.deletedAt).toBeTruthy()
    expect(userOnDatabase?.deletedAt).toBeInstanceOf(Date)
  })
})