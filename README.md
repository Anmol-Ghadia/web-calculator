# WebCalculator
Automatically closes any open brackets and displayed visually as grayed out close brackets until "=" is pressed

## Working of calculator
1) Perform translation
1) Remove all syntax sugars
1) continue if passing all checks else undefined
1) Make the data structure by analyzing characters left to right and inside-out
1) Iteratively computing the DS with a depth first approach

## Translation
1) changes the symbol of multiplication 

## Syntax sugars
1) +- becomes - ✅
1) a bracket right after a number has implicit multiplication ✅
1) Add implicit 0 before + and minus if a number is missing ✅
1) add brackets to follow BODMAS rule

1) decimal point should have numbers on both side

## Checks
a) check that each operator has two operands ✅
b) check that no two operators are consecutive ✅ Solved by the first check

## TODO
1) Add Syntax Sugars
1) Add checks
1) Add Floating Point numbers
1) Add % and modulo operators
1) Add History
1) Add Auto Compute feature
1) CSS pending
1) Add togglable Dark Theme