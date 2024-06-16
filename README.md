# WebCalculator
Automatically closes any open brackets and displayed visually as grayed out close brackets until `=` is pressed

## workflow of calculator
1) Perform translation
1) Perform Pre checks
1) Remove all syntax sugars
1) Perform Post checks
1) Make the data structure by analyzing characters left to right and inside-out
1) Iteratively computing the DS with a depth first approach

## Translation
1) changes the symbol of multiplication and division to simple form ✅
1) Removes any commas ✅

## Pre Check
1) check that  `%` operator is not followed by a number ✅

## Syntax sugars
1) Exact string `.` represents `0`
1) `+-` becomes `-` ✅
1) a bracket right after a number has implicit multiplication ✅
1) `---..` becomes `+` or `-` depending on count and `+++...` becomes `+` ✅
1) Add implicit `0` before `+` and `-` if a number is missing ✅
1) `%` becomes `*0.01` called as expanding the percent symbol ✅
1) ~~add brackets to follow BODMAS rule~~ (indstead modified evaluation rules) ✅ 
1) ~~decimal point should have numbers on both side~~ (js can handle vague decimal cases) ✅ 

## Post Check
1) check that each operator has two operands except (`%` should be followed by `*`) ✅
1) check that no two operators are consecutive ✅ Solved by the first check

## TODO
1) Fix Solving algorithm
1) Fix Error and Nan situations
1) Polish the PWA Features
1) Test Fetures and styling on different devices
1) Add Commas according to international system of counting only for visual component
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
