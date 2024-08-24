import { ValidationHandler } from './validation/validation-handler';
import { UniqueEntityID } from './unique-entity-id';

export default abstract class Entity<Props> {
  protected readonly props: Props;

  private readonly _id: UniqueEntityID;

  protected constructor(aProps: Props, anId?: UniqueEntityID) {
    this.props = aProps;
    this._id = anId ?? new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  equals(entity: Entity<unknown>) {
    return entity === this || entity.id === this._id;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id.getValue(),
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
