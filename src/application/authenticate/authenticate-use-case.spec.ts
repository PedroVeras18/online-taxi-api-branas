import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { AuthenticateUseCase } from "./authenticate-use-case"
import { makeUser } from "test/factories/make-user"
import { AccountRepository } from "@/domain/account/account-repository"
import { InMemoryAccountRepository } from "@test/repositories/in-memory-account-repository"
import NotificationException from "@/core/exception/notification-exception"

let repository: AccountRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let useCase: AuthenticateUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    useCase = new AuthenticateUseCase(
      repository,
      fakeHasher,
      encrypter,
    )
  })

  it('dependencies should be defined', (): void => {
    expect(repository).toBeDefined()
    expect(fakeHasher).toBeDefined()
    expect(encrypter).toBeDefined()
    expect(useCase).toBeDefined()
  })

  it('should be able to authenticate an user', async () => {
    const passwordMock = '123456'

    const user = await makeUser({
      override: {
        email: 'johndoeeletronics@example.com',
        password: await fakeHasher.hash(passwordMock),
      },
      repository,
    })

    const result = await useCase.execute({
      email: user.email,
      password: passwordMock,
    })

    expect(result.accessToken).toBeTruthy()
    expect(result).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate if the account does not exist', async () => {
    const passwordMock = '123456'
    const invalidEmailMock = 'invalidEmail@gmail.com'

    await expect(
      useCase.execute({
        email: invalidEmailMock,
        password: passwordMock,
      }),
    ).rejects.toThrowError('Credenciais inválidas.')
  })

  it('should not be able to authenticate if the password is incorrect', async () => {
    const passwordMock = '123456'

    const user = await makeUser({
      override: {
        email: 'johndoeeletronics@example.com',
        password: await fakeHasher.hash(passwordMock),
      },
      repository,
    })

    await expect(
      useCase.execute({
        email: user.email,
        password: 'incorrect-password',
      }),
    ).rejects.toThrowError('Credenciais inválidas.')
  })
})