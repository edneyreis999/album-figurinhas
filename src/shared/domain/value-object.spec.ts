import { ValueObject } from './value-object';

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    readonly prop1: string,
    readonly prop2: number,
  ) {
    super();
  }
}

describe('ValueObject Unit Tests', () => {
  describe('Equality Checks', () => {
    it('should be equal for identical StringValueObjects', () => {
      const valueObject1 = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test');
      expect(valueObject1.equals(valueObject2)).toBe(true);
      expect(valueObject2.equals(valueObject1)).toBe(true);
    });

    it('should not be equal for different StringValueObjects', () => {
      const valueObject1 = new StringValueObject('test');
      const valueObject2 = new StringValueObject('test2');
      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it('should be equal for identical ComplexValueObjects', () => {
      const complexValueObject1 = new ComplexValueObject('test', 1);
      const complexValueObject2 = new ComplexValueObject('test', 1);
      expect(complexValueObject1.equals(complexValueObject2)).toBe(true);
      expect(complexValueObject2.equals(complexValueObject1)).toBe(true);
    });

    it('should not be equal for different ComplexValueObjects', () => {
      const complexValueObject1 = new ComplexValueObject('test', 1);
      const complexValueObject2 = new ComplexValueObject('test', 2);
      expect(complexValueObject1.equals(complexValueObject2)).toBe(false);

      const complexValueObject3 = new ComplexValueObject('test1', 1);
      expect(complexValueObject1.equals(complexValueObject3)).toBe(false);
    });

    it('should not be equal to null or undefined', () => {
      const valueObject1 = new StringValueObject('test');
      expect(valueObject1.equals(null as any)).toBe(false);
      expect(valueObject1.equals(undefined as any)).toBe(false);

      const complexValueObject1 = new ComplexValueObject('test', 1);
      expect(complexValueObject1.equals(null as any)).toBe(false);
      expect(complexValueObject1.equals(undefined as any)).toBe(false);
    });

    it('should return false when constructor names are different', () => {
      const object1 = new StringValueObject('test');
      const object2 = new ComplexValueObject('test', 1);
      expect(object1.equals(object2 as any)).toBe(false);
      expect(object2.equals(object1 as any)).toBe(false);
    });
    it('should return false when comparing with an object that is not a ValueObject', () => {
      const object1 = new StringValueObject('test');
      const object2 = { value: 'test' };
      expect(object1.equals(object2 as any)).toBe(false);
    });
  });

  describe('Self Equality', () => {
    it('should be equal to itself', () => {
      const valueObject = new StringValueObject('test');
      expect(valueObject.equals(valueObject)).toBe(true);

      const complexValueObject = new ComplexValueObject('test', 1);
      expect(complexValueObject.equals(complexValueObject)).toBe(true);
    });
  });
  describe('Edge Cases', () => {
    it('should handle complex nested equality checks', () => {
      class NestedValueObject extends ValueObject {
        constructor(readonly nested: ComplexValueObject) {
          super();
        }
      }

      const nestedObject1 = new NestedValueObject(new ComplexValueObject('test', 1));
      const nestedObject2 = new NestedValueObject(new ComplexValueObject('test', 1));
      expect(nestedObject1.equals(nestedObject2)).toBe(true);
      expect(nestedObject1.equals(new NestedValueObject(new ComplexValueObject('test', 2)))).toBe(
        false,
      );
    });
  });
});
