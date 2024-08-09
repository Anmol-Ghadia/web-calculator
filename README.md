# [WebCalculator](https://www.students.cs.ubc.ca/~aghadia/WebCalculator/index.html)
This is a Progressive Web App (PWA) for a simple calculator built using vanilla JavaScript. It includes several advanced features:

1) Offline Functionality: Operates seamlessly offline, leveraging Service Workers for caching.
1) Auto Completion: easily complete long expressions using auto complete for brackets
1) Calculation History: Tracks and displays a history of past calculations.
1) Dark and Light Mode: Provides a toggle between dark and light themes for enhanced usability in different lighting conditions.

The app is designed to be fast, responsive, and user-friendly, making it a versatile tool for quick calculations on the go.

[Experience the demo, by clicking here](https://www.students.cs.ubc.ca/~aghadia/WebCalculator/index.html)

## Examples

https://github.com/Anmol-Ghadia/WebCalculator/assets/47422194/8ecc1900-1426-4fe3-a632-764a13273568

https://github.com/Anmol-Ghadia/WebCalculator/assets/47422194/a6aa13b2-0c6a-4455-b5ea-fedf98be0e97

https://github.com/Anmol-Ghadia/WebCalculator/assets/47422194/30ca5f66-90cc-4f40-add8-42dd3e188f69

---
## Working of the calculator
The calculator implements a parser and evaluater built from scratch. Hence, this section is aimed at giving an overview of the parser and evaluator.

### Workflow of calculator
1) Perform translation
1) Perform Pre checks
1) Remove all syntax sugars
1) Perform Post checks
1) Make the data structure by analyzing characters left to right and inside-out
1) Iteratively computing the DS with a depth first approach

### Translation
1) changes the symbol of multiplication and division to simple form ✅
1) Removes any commas ✅

### Pre Check
1) check that  `%` operator is not followed by a number ✅

### Syntax sugars
1) Exact string `.` represents `0`
1) `+-` becomes `-` ✅
1) a bracket right after a number has implicit multiplication ✅
1) `---..` becomes `+` or `-` depending on count and `+++...` becomes `+` ✅
1) Add implicit `0` before `+` and `-` if a number is missing ✅
1) `%` becomes `*0.01` called as expanding the percent symbol ✅
1) ~~add brackets to follow BODMAS rule~~ (indstead modified evaluation rules) ✅ 
1) ~~decimal point should have numbers on both side~~ (js can handle vague decimal cases) ✅ 

### Post Check
1) check that each operator has two operands except (`%` should be followed by `*`) ✅
1) check that no two operators are consecutive ✅ Solved by the first check

### Evaluator
The evaluator is quite complex but it does the following steps in the given order
1) Generate an intermediate data structure to represent the expression. This data structure is comprises of various data types such as numbers, strings for operators and nested arrays for brackets
1) The evaluator iteratively evaluates the the expression from left to right for each operator as specified by the BODMAS rule.
1) Whenever a Array(brackets) is encountered, it recursively first evaluates the sub expression insider the array(brackets)
1) The intermediate data structure is worked on repeatedly until it contains only a single number, the answer or is error.

## Attributions:
I highly recommend checking out the following resources:
1) favicon [Flaticon-keys](https://www.flaticon.com/free-icons/calculator)

## Future TODOs
1) Add Commas according to international system of counting only for visual component

## Development Guide
### Running tests
1) install dependencies
```sh
npm install
```
1) run tests
```sh
npm test
```