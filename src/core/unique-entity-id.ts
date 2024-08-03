import { randomUUID } from 'node:crypto';

export class UniqueEntityID {
  private value: string;

  getValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  equals(id?: UniqueEntityID) {
    return id?.getValue() === this.value;
  }

  toString() {
    return this.value;
  }
}
