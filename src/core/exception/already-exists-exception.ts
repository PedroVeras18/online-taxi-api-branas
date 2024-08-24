import { UniqueEntityID } from '../unique-entity-id';
import DomainException from './domain-exception';

export default class AlreadyExistsException extends DomainException {
  private constructor(aMessage: string, anErrors: Array<Error>) {
    super(aMessage, anErrors);
  }

  public static withProperty(propertyName: string, identifier: string | number): AlreadyExistsException {
    const message = `${propertyName} "${identifier}" já existe no sistema.`
    return new AlreadyExistsException(message, []);
  }

  public static withId(aggregateName: string, id: UniqueEntityID): AlreadyExistsException {
    const message = `A entidade '${aggregateName}' com ID '${id.toString()}' já existe.`;
    return new AlreadyExistsException(message, []);
  }

  public static withCustomMessage(customMessage: string): AlreadyExistsException {
    return new AlreadyExistsException(customMessage, []);
  }
}
