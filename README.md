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

## TODOs
1) ~~Test Fetures and styling on different devices~~
1) ~~Fix Error and Nan situations~~
1) ~~Fix Solving algorithm~~
1) ~~Polish the PWA Features~~
1) ~~Handle case where many digits are displayed~~
1) ~~Add 2 themes only, dark and light [partially done]~~
1) ~~Refactor Code~~
1) ~~Decrease font size for output if large number needs to be displayed~~
1) ~~Last number should not be displayed on the screen~~
1) ~~single decimal point gives Nan~~
1) ~~Add syntax sugar for `+` as `--` ~~
1) ~~Fix Styling for History tab~~
1) ~~Make the app a PWA~~
1) ~~Add more themes~~ Scraped for only two themes
1) ~~Add Keyboard Support for the calculator~~
1) ~~Add dark mode option for background only~~
1) ~~clicking on a history cell copies the answer to clipboard~~
1) ~~clicking equals and then calculating should copy the value from previous answer~~
1) ~~Add logic to pick random color pallete from group of palletes~~
1) ~~CSS polishing~~
1) ~~Copy the latest answer to clipboard when equals is clicked~~
1) ~~Add togglable Dark Theme~~ Scrapped
1) ~~Design portrait friendly css as part of Mobile-first design~~
1) ~~add JS to deal with history tab in different orientations~~
1) ~~Design Landscape css~~
1) ~~Use decimal.js for floating point arithmetic~~
1) ~~debug the issue of (1)-(1)~~
1) ~~Add cursor, so that the user can edit mistakes inbetween the expression~~ Scrapped
1) ~~Formula in the history tab should have space beside operators for better visibility~~
1) ~~recheck the evaluation rule of `%`~~
1) ~~Add History~~
1) ~~adding opening bracket at the start leads to NaN~~
1) ~~Add % and power operators~~
1) ~~Add Auto Compute feature~~
1) ~~CSS pending~~
1) ~~Add Syntax Sugars~~
1) ~~Add checks~~
1) ~~Add Floating Point numbers~~
1) ~~Add modulo operators~~
