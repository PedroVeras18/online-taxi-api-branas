import { UniqueEntityID } from '../unique-entity-id';
import DomainException from './domain-exception';
import Error from '../validation/error';

export default class NotFoundException extends DomainException {
  private constructor(aMessage: string, anErrors: Error[]) {
    super(aMessage, anErrors);
  }

  static with<T>(
    aDomainCore: string,
    someFields: UniqueEntityID | Record<string, string>,
  ): NotFoundException {
    const aMessage = aDomainCore;

    const fields =
      someFields instanceof UniqueEntityID
        ? { ID: someFields.toString() }
        : someFields;

    const errors = Object.entries(fields).map(
      ([key, value]) => new Error('exceptions.not-found-field', { key, value }),
    );

    return new NotFoundException(aMessage, errors);
  }

  static withProp<T>(
    anAggregate: T,
    props: {
      [key: string]: string;
    },
  ): NotFoundException {
    const propsErrors = Object.keys(props)
      .map((key) => `${key} ${props[key]}`)
      .join(', ');

    const anError = `${anAggregate} with ${propsErrors} was not found`;
    return new NotFoundException(anError, [new Error(anError)]);
  }
}
