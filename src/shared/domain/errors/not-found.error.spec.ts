import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { NotFoundError } from './not-found.error';

class TestValueObject implements ValueObject {
  constructor(public readonly id: string) {}
  public equals(vo: this): boolean {
    return this.equals(vo);
  }
}

class TestEntity extends Entity {
  get entityId(): ValueObject {
    throw new Error('Method not implemented.');
  }
  toJSON() {
    throw new Error('Method not implemented.');
  }
}

describe('NotFoundError', () => {
  it('should format error message correctly with single string ID', () => {
    const error = new NotFoundError('123', TestEntity);
    expect(error.message).toEqual('TestEntity Not Found using ID 123');
  });

  it('should format error message correctly with multiple string IDs', () => {
    const error = new NotFoundError(['123', '456'], TestEntity);
    expect(error.message).toEqual('TestEntity Not Found using ID 123, 456');
  });

  it('should format error message correctly with single ValueObject ID', () => {
    const valueObjectId = new TestValueObject('789');
    const error = new NotFoundError(valueObjectId, TestEntity);
    expect(error.message).toEqual('TestEntity Not Found using ID 789');
  });

  it('should format error message correctly with multiple ValueObject IDs', () => {
    const valueObjectId1 = new TestValueObject('789');
    const valueObjectId2 = new TestValueObject('101112');
    const error = new NotFoundError([valueObjectId1, valueObjectId2], TestEntity);
    expect(error.message).toEqual('TestEntity Not Found using ID 789, 101112');
  });

  it('should format error message correctly with mixed string and ValueObject IDs', () => {
    const valueObjectId = new TestValueObject('101112');
    const error = new NotFoundError(['123', valueObjectId, '456'], TestEntity);
    expect(error.message).toEqual('TestEntity Not Found using ID 123, 101112, 456');
  });

  it('should set the error name correctly', () => {
    const error = new NotFoundError('123', TestEntity);
    expect(error.name).toEqual('NotFoundError');
  });
});
