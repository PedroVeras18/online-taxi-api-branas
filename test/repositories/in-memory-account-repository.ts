import { PaginationProps, Pagination } from '@/core/pagination/pagination';
import { Account } from '@/domain/account/account';
import { AccountRepository } from '@/domain/account/account-repository';

export class InMemoryAccountRepository implements AccountRepository {
  public items: Account[] = [];

  async findAll({
    page,
    perPage,
  }: PaginationProps<Account>): Promise<Pagination<Account>> {
    const items = await this.items.slice((page - 1) * perPage, page * perPage);

    return new Pagination({
      total: this.items.length,
      items,
      perPage,
      page,
    });
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.items.find((account) => account.email === email);

    if (!account) {
      return null;
    }

    return account;
  }

  async findById(anId: string): Promise<Account> {
    const account = this.items.find((user) => user.id.toString() === anId);

    if (!account) {
      return null;
    }

    return account;
  }

  async create(record: Account): Promise<void> {
    this.items.push(record);
  }

  async update(record: Account): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === record.id);

    this.items[itemIndex] = record;
  }

  async delete(anId: string): Promise<void> {
    const filteredUsers = this.items.filter(
      (account) => account.id.toString() !== anId,
    );

    this.items = filteredUsers;
  }
}
