import { expect, vi } from 'vitest';
import { ValidationHandler } from '../validation/validation-handler';
import { UniqueEntityID } from '../unique-entity-id';
import { AggregateRoot } from '../aggregate-root';
import { DomainEvents } from './domain-events';
import { DomainEvent } from './domain-event';

class TestAggregateCreated implements DomainEvent {
  occurredAt: Date;
  aggregate: TestAggregate //eslint-disable-line

  constructor(aggregate: TestAggregate) {
    this.occurredAt = new Date();
    this.aggregate = aggregate;
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class TestAggregate extends AggregateRoot<null> {
  validate(_aHandler: ValidationHandler): void {
    throw new Error('Method not implemented.');
  }

  static create() {
    const aggregate = new TestAggregate(null);

    aggregate.addDomainEvent(new TestAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('Domain Events Test', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    // Created Subscriber
    DomainEvents.register((_event) => {
      callbackSpy();
    }, TestAggregateCreated.name);

    const aggregate = TestAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);

    // Dispatch event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
