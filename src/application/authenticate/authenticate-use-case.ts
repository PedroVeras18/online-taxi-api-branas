import NotificationException from "@/core/exception/notification-exception"
import { Notification } from "@/core/validation/notification"
import { AccountRepository } from "@/domain/account/account-repository"
import { Encrypter } from "@/domain/cryptography/encrypter"
import { HashComparer } from "@/domain/cryptography/hash-comparer"

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  accessToken: string
}

export class AuthenticateUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) { }

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const notification = Notification.create()

    const user = await this.accountRepository.findByEmail(email)

    if (!user) throw new NotificationException('Credenciais inválidas.', notification)

    const isPasswordValiud = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValiud) throw new NotificationException('Credenciais inválidas.', notification)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString()
    })

    return {
      accessToken,
    }
  }
}