import { Either, left, right } from '../either';

describe('Either class unit tests', () => {
  function doSomething(x: boolean): Either<string, number> {
    if (x) {
      return right(10);
    } else {
      return left('error');
    }
  }
  it('should return a success result', () => {
    const successResult = doSomething(true);

    expect(successResult.isRight()).toBe(true);
    expect(successResult.isLeft()).toBe(false);
  });

  it('should return an error result', () => {
    const errorResult = doSomething(false);

    expect(errorResult.isLeft()).toBe(true);
    expect(errorResult.isRight()).toBe(false);
  });
});
