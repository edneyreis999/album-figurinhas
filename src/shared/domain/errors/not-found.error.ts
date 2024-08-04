import { Entity } from '../entity';
import type { ValueObject } from '../value-object';

export class NotFoundError extends Error {
  constructor(id: any[] | string | ValueObject, entityClass: new (...args: any[]) => Entity) {
    let idsMessage: string;

    if (Array.isArray(id)) {
      idsMessage = id
        .map(item => (typeof item === 'object' && 'id' in item ? String(item.id) : String(item)))
        .join(', ');
    } else {
      idsMessage = typeof id === 'object' && 'id' in id ? String(id.id) : String(id);
    }

    super(`${entityClass.name} Not Found using ID ${idsMessage}`);
    this.name = 'NotFoundError';
  }
}
