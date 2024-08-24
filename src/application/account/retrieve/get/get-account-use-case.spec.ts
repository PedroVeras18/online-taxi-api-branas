import { AccountRepository } from "@/domain/account/account-repository"
import { makeUser } from "@test/factories/make-user"
import { GetAccountUseCase } from "./get-account-use-case"
import { InMemoryAccountRepository } from "@test/repositories/in-memory-account-repository"
import { faker } from "@faker-js/faker"

let accountRepository: AccountRepository
let useCase: GetAccountUseCase

describe('Get Account Use Case', () => {
  beforeEach(async () => {
    accountRepository = new InMemoryAccountRepository()
    useCase = new GetAccountUseCase(accountRepository)
  })

  it('dependencies should be defined', (): void => {
    expect(accountRepository).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should throw error if account not found', async () => {
    const invalidAccountId = 'invalid-id'

    const response = useCase.execute({ userId: invalidAccountId })

    expect(response).rejects.toThrow(`Usuário com ID ${invalidAccountId} não foi encontrado`)
  })

  it('should be able to get a passenger account details.', async () => {
    const user = await makeUser({
      override: {
        isPassenger: true,
      },
      repository: accountRepository,
    })

    const result = await useCase.execute({
      userId: user.id.toString()
    })

    expect(result.id).toBe(user.id.toString())
    expect(result.name).toBe(user.name)
    expect(result.cpf).toEqual(user.cpf)
    expect(user.email).toBe(user.email)
    expect(user.isPassenger).toBe(true)
    expect(user.isDriver).toBe(undefined)
    expect(user.carPlate).toBe(undefined)
  })

  it('should be able to get a driver account details.', async () => {
    const user = await makeUser({
      override: {
        isDriver: true,
        carPlate: faker.vehicle.vrm()
      },
      repository: accountRepository,
    })

    const result = await useCase.execute({
      userId: user.id.toString()
    })

    expect(result.id).toBe(user.id.toString())
    expect(result.name).toBe(user.name)
    expect(result.cpf).toEqual(user.cpf)
    expect(user.email).toBe(user.email)
    expect(user.isPassenger).toBe(undefined)
    expect(user.isDriver).toBe(true)
    expect(user.carPlate).toBe(user.carPlate)
  })
})
