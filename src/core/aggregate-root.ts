import { DomainEvents } from './domain-events/domain-events';
import { DomainEvent } from './domain-events/domain-event';

import Entity from './entity';

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);
  }

  clearEvents() {
    this._domainEvents = [];
  }
}
