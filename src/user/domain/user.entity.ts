import { Entity } from '../../shared/domain/entity';
import { EntityValidationError } from '../../shared/domain/validators/validation.error';
import type { ValueObject } from '../../shared/domain/value-object';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { UserFakeBuilder } from './user-fake.builder';
import { UserValidatorFactory } from './user.validator';

export type UserConstructorProps = {
  userId?: Uuid;
  displayName: string;
  dustBalance?: number;
  isActive?: boolean;
  createdAt?: Date;
};

export type UserCreateCommand = {
  displayName: string;
  dustBalance?: number;
  isActive?: boolean;
};

export class User extends Entity {
  userId: Uuid;
  displayName: string;
  dustBalance: number;
  isActive: boolean;
  createdAt: Date;

  constructor(props: UserConstructorProps) {
    super();
    this.userId = props.userId ?? new Uuid();
    this.displayName = props.displayName;
    this.dustBalance = props.dustBalance ?? 0;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt ?? new Date();
  }

  get entityId(): ValueObject {
    return this.userId;
  }

  static create(props: UserCreateCommand): User {
    const user = new User(props);
    User.validate(user);
    return user;
  }

  changeDisplayName(name: string): void {
    this.displayName = name;
    User.validate(this);
  }

  addDust(amount: number): void {
    this.dustBalance += amount;
    User.validate(this);
  }

  subtractDust(amount: number): void {
    this.dustBalance -= amount;
    User.validate(this);
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  static validate(entity: User) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors!);
    }
    console.log('User validated', entity);
  }

  static fake() {
    return UserFakeBuilder;
  }

  toJSON() {
    return {
      userId: this.userId.id,
      name: this.displayName,
      dustBalance: this.dustBalance,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
