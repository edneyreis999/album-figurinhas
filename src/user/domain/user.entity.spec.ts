/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityValidationError } from '../../shared/domain/validators/validation.error';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { User } from './user.entity';

describe('User Unit Tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(User, 'validate');
  });

  describe('constructor', () => {
    test('should create a user with default values', () => {
      const user = new User({
        displayName: 'John Doe',
      });
      expect(user.userId).toBeInstanceOf(Uuid);
      expect(user.displayName).toBe('John Doe');
      expect(user.dustBalance).toBe(0);
      expect(user.isActive).toBeTruthy();
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('should create a user with all values', () => {
      const createdAt = new Date();
      const user = new User({
        displayName: 'John Doe',
        dustBalance: 100,
        isActive: false,
        createdAt,
      });
      expect(user.userId).toBeInstanceOf(Uuid);
      expect(user.displayName).toBe('John Doe');
      expect(user.dustBalance).toBe(100);
      expect(user.isActive).toBeFalsy();
      expect(user.createdAt).toBe(createdAt);
    });
  });

  describe('create command', () => {
    test('should create a user', () => {
      const user = User.create({
        displayName: 'John Doe',
      });
      expect(user.userId).toBeInstanceOf(Uuid);
      expect(user.displayName).toBe('John Doe');
      expect(user.dustBalance).toBe(0);
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test('should create a user with all properties', () => {
      const user = User.create({
        displayName: 'John Doe',
        dustBalance: 100,
        isActive: false,
      });
      expect(user.userId).toBeInstanceOf(Uuid);
      expect(user.displayName).toBe('John Doe');
      expect(user.dustBalance).toBe(100);
      expect(user.isActive).toBe(false);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('userId field', () => {
    const arrange = [{ userId: null }, { userId: undefined }, { userId: new Uuid() }];
    test.each(arrange)('userId = %j', ({ userId }) => {
      const user = new User({
        displayName: 'John Doe',
        userId: userId as any,
      });
      expect(user.userId).toBeInstanceOf(Uuid);
      if (userId instanceof Uuid) {
        expect(user.userId).toBe(userId);
      }
    });
  });

  test('should change displayName', () => {
    const user = User.create({
      displayName: 'John Doe',
    });
    user.changeDisplayName('Jane Doe');
    expect(user.displayName).toBe('Jane Doe');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should add dust to dustBalance', () => {
    const user = User.create({
      displayName: 'John Doe',
    });
    user.addDust(50);
    expect(user.dustBalance).toBe(50);
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should subtract dust from dustBalance', () => {
    const user = User.create({
      displayName: 'John Doe',
      dustBalance: 100,
    });
    user.subtractDust(50);
    expect(user.dustBalance).toBe(50);
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  test('should throw error when subtracting negative dust', () => {
    const user = User.create({
      displayName: 'John Doe',
      dustBalance: 50,
    });
    expect(() => user.subtractDust(60)).toThrow(EntityValidationError);
  });

  test('should throw error when dust is more then 9999', () => {
    const user = User.create({
      displayName: 'John Doe',
      dustBalance: 50,
    });
    expect(() => user.addDust(9999)).toThrow(EntityValidationError);
  });

  test('should throw error when subtracting more dust than available', () => {
    const user = User.create({
      displayName: 'John Doe',
      dustBalance: 50,
    });
    expect(() => user.subtractDust(100)).toThrow(EntityValidationError);
  });

  test('should activate a user', () => {
    const user = User.create({
      displayName: 'John Doe',
      isActive: false,
    });
    user.activate();
    expect(user.isActive).toBe(true);
  });

  test('should deactivate a user', () => {
    const user = User.create({
      displayName: 'John Doe',
      isActive: true,
    });
    user.deactivate();
    expect(user.isActive).toBe(false);
  });

  it('should get user by entityId', () => {
    const user = User.create({
      displayName: 'John Doe',
    });
    expect(user.entityId).toBe(user.userId);
  });

  it('should transform user to JSON', () => {
    const user = User.create({
      displayName: 'John Doe',
    });
    expect(user.toJSON()).toEqual({
      userId: user.userId.id,
      name: 'John Doe',
      dustBalance: 0,
      isActive: true,
      createdAt: user.createdAt,
    });
  });
});

describe('User Validator', () => {
  describe('create command', () => {
    test('should throw an error for invalid displayName', () => {
      expect(() => User.create({ displayName: null as any })).toThrow(EntityValidationError);
      expect(() => User.create({ displayName: '' })).toThrow(EntityValidationError);
      expect(() => User.create({ displayName: 5 as any })).toThrow(EntityValidationError);
      expect(() => User.create({ displayName: 't'.repeat(31) })).toThrow(EntityValidationError);
    });

    test('should throw an error for invalid dustBalance', () => {
      expect(() => User.create({ displayName: 'John Doe', dustBalance: -1 })).toThrow(
        EntityValidationError,
      );
    });

    test('should throw an error for invalid isActive', () => {
      expect(() => User.create({ displayName: 'John Doe', isActive: 5 as any })).toThrow(
        EntityValidationError,
      );
    });
  });

  describe('changeDisplayName method', () => {
    test('should throw an error for invalid displayName', () => {
      const user = User.create({ displayName: 'John Doe' });
      expect(() => user.changeDisplayName(null as any)).toThrow(EntityValidationError);
      expect(() => user.changeDisplayName('')).toThrow(EntityValidationError);
      expect(() => user.changeDisplayName(5 as any)).toThrow(EntityValidationError);
      expect(() => user.changeDisplayName('t'.repeat(256))).toThrow(EntityValidationError);
    });
  });
});
