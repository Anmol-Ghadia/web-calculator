const compute = require('../logic');

describe("General expressions test", () => {
    const cases = [
        ["(-2)^3", -8],
        ["5*(2+3)", 25],
        ["16^(1/2)", 4],
        ["2^3", 8],
        ["3+7", 10],
        ["14-7", 7],
        ["6*6", 36],
        ["81/9", 9],
        ["0+0", 0],
        ["1-1", 0],
        ["5*0", 0],
        ["8/4", 2],
        ["2^10", 1024],
        ["1+1+1+1", 4],
        ["10-2-2", 6],
        ["2*2*2*2", 16],
        ["100/10/2", 5],
        ["4*4-2*2", 12],
        ["(1+2)*(3+4)", 21],
        ["(2+3)*(4-1)", 15],
        ["2*(3+(4*5))", 46],
        ["(5*(2+3))*2", 50],
        ["((2+3)*2)^2", 100],
        ["((2^3)+2)*3", 30],
        ["3+(2*3)-(4/2)", 7],
        ["4/(2+2)", 1],
        ["(2+3)^(2-1)", 5],
        ["3+4*(2-1)", 7],
        ["((3+5)*2)/4", 4],
        ["10/(2*5)", 1],
        ["2*(3+(4*5))", 46],
        ["6*(2+1)", 18],
        ["3*(5-2)", 9],
        ["(8/4)+(2*3)", 8],
        ["(10+2)/2", 6],
        ["5*(4-1)", 15],
        ["6*(7-4)", 18],
        ["8/(4/2)", 4],
        ["9-(3*2)", 3],
        ["4*(3+2)", 20],
        ["10-(5+3)", 2],
        ["20/(4*5)", 1],
        ["(6+2)-(3*2)", 2],
        ["7+(6/2)", 10],
        ["5*(3-1)", 10],
        ["12/(3*2)", 2],
        ["10-(4+3)", 3],
        ["9/(3/1)", 3],
        ["4+(5-3)", 6],
        ["8*(2-1)", 8],
        ["15/(5-2)", 5],
        ["3+7", 10],
        ["14-7", 7],
        ["6*6", 36],
        ["81/9", 9],
        ["0+0", 0],
        ["1-1", 0],
        ["5*0", 0],
        ["8/4", 2],
        ["2^10", 1024],
        ["1+1+1+1", 4],
        ["10-2-2", 6],
        ["2*2*2*2", 16],
        ["100/10/2", 5],
        ["4*4-2*2", 12],
        ["(1+2)*(3+4)", 21],
        ["(2+3)*(4-1)", 15],
        ["2*(3+(4*5))", 46],
        ["(5*(2+3))*2", 50],
        ["((2+3)*2)^2", 100],
        ["((2^3)+2)*3", 30],
        ["3+(2*3)-(4/2)", 7],
        ["4/(2+2)", 1],
        ["(2+3)^(2-1)", 5],
        ["3+4*(2-1)", 7],
        ["((3+5)*2)/4", 4],
        ["10/(2*5)", 1],
        ["2*(3+(4*5))", 46],
        ["6*(2+1)", 18],
        ["3*(5-2)", 9],
        ["(8/4)+(2*3)", 8],
        ["(10+2)/2", 6],
        ["5*(4-1)", 15],
        ["6*(7-4)", 18],
        ["8/(4/2)", 4],
        ["9-(3*2)", 3],
        ["4*(3+2)", 20],
        ["10-(5+3)", 2],
        ["20/(4*5)", 1],
        ["(6+2)-(3*2)", 2],
        ["7+(6/2)", 10],
        ["5*(3-1)", 10],
        ["12/(3*2)", 2],
        ["10-(4+3)", 3],
        ["9/(3/1)", 3],
        ["4+(5-3)", 6],
        ["8*(2-1)", 8],
        ["15/(5-2)", 5],
        ["-2+2", 0],
        ["-10-5", -15],
        ["-20/4", -5],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});


describe("Complex expressions test", () => {
    const cases = [
        ["-(2+2)", -4],
        ["(-5)*(2+3)", -25],
        ["10-(-5)", 15],
        ["-10-(-5)", -5],
        ["-5*(2-(-3))", -25],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("Nested negative numbers test", () => {
    const cases = [
        ["-(10/2)", -5],
        ["-(10/(-2))", 5],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("Edge Case with negative numbers test", () => {
    const cases = [
        ["-0", 0],
        ["-(0)", 0],
        ["-(0*1)", 0],
        ["-(1/1)",-1],
        ["-(1/(-1))", 1],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("negative Power tests", () => {
    const cases = [
        ["(-2)^3",-8],
        ["(-2)^2", 4],
        ["(-1)^5",-1],
        ["(-3)^3",-27],
        ["(-2)^4", 16],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("expressions with negative numbers test", () => {
    const cases = [
        ["(-2)+(-2)", -4],
        ["(-10)/(-2)",  5],
        ["(-10)-(2-(-3))", -15],
        ["-(2+3)*(-4-(-1))",  15],
        ["10+(-2)*5",  0],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("incomplete expressions test", () => {
    const cases = [
        // ["", null], // Should be fixed
        ["0", 0],
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});

describe("undefined test", () => {
    const cases = [
        ["1",1] // Temporary
        // ["2+", null],   // Should be fixed
        // ["10/0", Infinity],  // Should be fixed
        // ["-1^(1/2)", NaN],  // Should be fixed
    ];

    test.each(cases)(
    "given %p as for computation, returns %p",
    (argument, expectedResult) => {
      const result = compute(argument)[1].toString();
      expect(result).toBe(expectedResult.toString());
    }
  );
});