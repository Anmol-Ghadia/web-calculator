// Configurable vars
// ========================
var SHOW_LOGS = false;
const ERROR_TEXT = "error";

// Global Vars
// ========================
const HISTORY_TAB_PORTRAIT_HEIGHT = "30%";
const HISTORY_TAB_LANDSCAPE_WIDTH = "35vh";

const CALC_INPUT_DISPLAY_ELEMENT = document.getElementById("display");
CALC_INPUT_DISPLAY_ELEMENT.innerHTML = "";
const EQUALS_BUTTON_ELEMENT = document.getElementById("display_append");
const CALC_OUTPUT_DISPLAY_ELEMENT = document.getElementById("output_display");
CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = "";

const THEME_TOGGLE_ELEMENT = document.getElementById("theme_toggle");
THEME_TOGGLE_ELEMENT.addEventListener("click", handleThemeToggle);
var IS_LIGHT_THEME = false;

var IS_HISTORY_SHOWN = false;

// Event Listeners
// ========================
addEventListener("DOMContentLoaded", () => {
    handleHistoryToggleButtonClick();
    handleHistoryToggleButtonClick();
    applyTheme();
})
addEventListener("resize", () => {
    handleHistoryToggleButtonClick();
    handleHistoryToggleButtonClick();
    fitTextOutputDisplay();
});
addEventListener('keydown', keyPressHandler);

// PWA Service worker
// ========================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}

// TODO
// ========================
// Class styling for light mode
let theme_primary = 'theme_primary_4';
let theme_secodary = 'theme_secondary_4';
let theme_highlight = 'theme_highlight_4';
let theme_primary_text = 'theme_primary_text_4';
let theme_secondary_text = 'theme_secondary_text_4';

// ========================

// Functions
// ========================

// recomputes the best font-size in calculator output display
function fitTextOutputDisplay() {
    var container = CALC_OUTPUT_DISPLAY_ELEMENT; 
    // var container = document.getElementById('container');
    
    var containerWidth = container.offsetWidth;
    var textWidth = container.scrollWidth;
    
    var fontSize = parseInt(window.getComputedStyle(container).fontSize);
    fontSize /= window.innerHeight;
    fontSize *= 100;

    // Check if increasing font size makes text fit
    while (textWidth <= containerWidth && fontSize < 8) {
        fontSize += 1;
        container.style.fontSize = fontSize + 'vh';
        textWidth = container.scrollWidth;
    }
    
    // If increasing font size makes text overflow, decrease font size
    while (textWidth > containerWidth && fontSize > 1) {
        fontSize -= 1;
        container.style.fontSize = fontSize + 'vh';
        textWidth = container.scrollWidth;
    }
}

// Toggles between dark and light theme each time it is called
function handleThemeToggle() {
    if (IS_LIGHT_THEME) {
        // Change to dark theme
        IS_LIGHT_THEME = false;
    } else {
        // Change to light theme
        IS_LIGHT_THEME = true;
    }
    applyTheme();
    if (SHOW_LOGS) console.log("Theme toggled, is white: ", IS_LIGHT_THEME);
}

// Handler for Key presses
function keyPressHandler(event) {
    if ('0123456789+-*/^%().'.includes(event.key)) {
        acceptInput(event.key);
    } else if (event.key === 'Backspace') {
        removeInput();
    } else if (['Enter','='].includes(event.key)) {
        handleEqualsButton();
        event.preventDefault();
    }
}

// Adds the given formula and answer as a dom element in the history tab
function appendHistory(formula,answer) {
    const historyCellElement = document.createElement('div');
    const historyFormulaElement = document.createElement('div');
    const historyAnswerElement = document.createElement('div');
    const hitoryCellTopSpacer = document.createElement('div');

    hitoryCellTopSpacer.classList.add("history_cell_top_spacer");
    historyCellElement.classList.add("history_cell");
    historyFormulaElement.classList.add("history_formula");
    historyAnswerElement.classList.add("history_answer");
    
    // Styling
    if (IS_LIGHT_THEME) {
        // Current theme is light, (add classes)
        // TODO !!!
        historyCellElement.classList.add(theme_primary);
        historyCellElement.classList.add(theme_primary_text);
        historyAnswerElement.classList.add(theme_primary)
        historyAnswerElement.classList.add(theme_primary_text)
        historyFormulaElement.classList.add(theme_primary)
        historyFormulaElement.classList.add(theme_primary_text)
    }

    historyCellElement.addEventListener('click', function() {
        // Copy the answer text to the clipboard
        navigator.clipboard.writeText(historyAnswerElement.textContent)
            .catch(err => {
                console.error('Could not copy answer to clipboard: ', err);
            });
    });

    historyFormulaElement.innerHTML = beautifyHistoryFormula(formula+" =");
    historyAnswerElement.innerHTML = answer;

    historyCellElement.appendChild(hitoryCellTopSpacer);
    historyCellElement.appendChild(historyFormulaElement);
    historyCellElement.appendChild(historyAnswerElement);

    const history_container = document.getElementsByClassName("history_container")[0];
    history_container.appendChild(historyCellElement);
}
// TODO !!!
function applyTheme() {
    if (IS_LIGHT_THEME) {
        // Current theme is light, (Add theme)

        // text
        document.getElementsByClassName("output_display")[0].classList.add(theme_primary_text);
        document.getElementById("display").classList.add(theme_secondary_text);

        // Background color
        document.getElementsByTagName("body")[0].classList.add(theme_primary);
        document.getElementById("calculator_container").classList.add(theme_secodary);
        document.getElementById("display").classList.add(theme_secodary);
        document.getElementsByClassName("output_container")[0].classList.add(theme_highlight);
        document.getElementsByClassName("history_container")[0].classList.add(theme_secodary);
        
        // text + background
        Array.from(document.getElementsByTagName("button")).forEach(ele => {
            ele.classList.add(theme_primary);
            ele.classList.add(theme_primary_text);
        })
        Array.from(document.getElementsByClassName("history_cell")).forEach(ele => {
            ele.classList.add(theme_primary);
            ele.classList.add(theme_primary_text);
        })

        Array.from(document.getElementsByClassName("history_formula")).forEach(ele => {
            ele.classList.add(theme_primary);
            ele.classList.add(theme_primary_text);
        })
        Array.from(document.getElementsByClassName("history_answer")).forEach(ele => {
            ele.classList.add(theme_primary);
            ele.classList.add(theme_primary_text);
        })


    } else {
        // Current theme is dark, (Remove classes)

        // text
        document.getElementsByClassName("output_display")[0].classList.remove(theme_primary_text);
        document.getElementById("display").classList.remove(theme_secondary_text);

        // Background color
        document.getElementsByTagName("body")[0].classList.remove(theme_primary);
        document.getElementById("calculator_container").classList.remove(theme_secodary);
        document.getElementById("display").classList.remove(theme_secodary);
        document.getElementsByClassName("output_container")[0].classList.remove(theme_highlight);
        document.getElementsByClassName("history_container")[0].classList.remove(theme_secodary);
        
        // text + background
        Array.from(document.getElementsByTagName("button")).forEach(ele => {
            ele.classList.remove(theme_primary);
            ele.classList.remove(theme_primary_text);
        })
        Array.from(document.getElementsByClassName("history_cell")).forEach(ele => {
            ele.classList.remove(theme_primary);
            ele.classList.remove(theme_primary_text);
        })
        Array.from(document.getElementsByClassName("history_formula")).forEach(ele => {
            ele.classList.remove(theme_primary);
            ele.classList.remove(theme_primary_text);
        })
        Array.from(document.getElementsByClassName("history_answer")).forEach(ele => {
            ele.classList.remove(theme_primary);
            ele.classList.remove(theme_primary_text);
        })
    }
}

// Handler for opening/closing history tab
function handleHistoryToggleButtonClick() {
    const historyToggleButtonElement = document.getElementById("history_toggle_btn");
    const historyContainerElement = document.getElementById("history_container");
    if (isOrientationPortrait()) {
        historyContainerElement.style.width = "100%";
        if (IS_HISTORY_SHOWN) {
            // Hide history
            historyContainerElement.style.height = "0%";
            historyToggleButtonElement.innerHTML = "△";
            IS_HISTORY_SHOWN = false;
        } else {
            // show history    
            historyContainerElement.style.height = HISTORY_TAB_PORTRAIT_HEIGHT;
            historyToggleButtonElement.innerHTML = "▽";
            IS_HISTORY_SHOWN = true;
        }
    } else {
        // landscape
        historyContainerElement.style.height = "100%";
        if (IS_HISTORY_SHOWN) {
            // Hide history
            historyContainerElement.style.width = "0%";
            historyToggleButtonElement.innerHTML = ">";
            IS_HISTORY_SHOWN = false;
        } else {
            // show history    
            historyContainerElement.style.width = HISTORY_TAB_LANDSCAPE_WIDTH;
            historyToggleButtonElement.innerHTML = "<";
            IS_HISTORY_SHOWN = true;
        }
    }
}

function clearInput(){
    CALC_INPUT_DISPLAY_ELEMENT.innerHTML = "";

    CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = "";
    updateEqualsButton();
}

// check that the percent does not have a number after it
function CheckPercentIsNotFollowedByNumber(str) {

    let lastCharacterWasPercent = false;
    let foundMistake = false;
    
    str.split("").forEach(ele => {
        if (SHOW_LOGS) console.log("(12) current_element:" , ele);
        if (lastCharacterWasPercent) {
            if (!"+-*/%^(".includes(ele)) {
                if (SHOW_LOGS) console.log("(12)" , ele);
                foundMistake = true;
                return;
            }
            lastCharacterWasPercent = false;
        }
        if (ele == "%") {
            lastCharacterWasPercent = true;
        }
    });
    
    return !foundMistake;
}

// Checks that all pre checks are satisfied
function doAllChecksPass(str) {
    const bool_1 = CheckPercentIsNotFollowedByNumber(str);
    const bool_2 = checkStartingCharacter(str);

    return bool_2 && bool_1;
}

function checkStartingCharacter(str) {
    if (str.length==0) return true;
    let char = str[str.length-1];
    if ("%^*/".split("").includes(char)) return false;
    console.log("1");
    return true;
}

// returns an array of size 2 by evaluating the 
//      provided expression as string
// Index 0: 0 if expression is evaluated properly,
//          1 if expression is invalid
// Index 1: correct value of the expression only if index 0 == 0
function compute(inpStr) {

    inpStr = translateExpression(inpStr);
    if (SHOW_LOGS) console.log("After translation:" + inpStr);

    if (!doAllChecksPass(inpStr)) {
        // An incorrect expression is entered
        return [1,];
    }
    if (SHOW_LOGS) console.log("Passed all pre Checks:" + inpStr);
    
    inpStr = removeSyntaxSugars(inpStr);
    if (SHOW_LOGS) console.log("After Syntax Sugar removed:" + inpStr);
    
    if (!doAllChecksPass(inpStr)) {
        // An incorrect expression is entered
        return [1,];
    }
    if (SHOW_LOGS) console.log("Passed all post Checks:" + inpStr);
    
    // TODO: division by 0 case
    
    const dataStructure = parseDataStructure(inpStr);
    if (SHOW_LOGS) console.log("Data Structure:" + dataStructure);
    
    const evaluatedArray = evaluateDataStructure(dataStructure);
    if (SHOW_LOGS) console.log("Value:");
    
    return evaluatedArray;
}

// Adds spacing to improve readibility of the formula when displayed
function beautifyHistoryFormula(inFormula) {

    let outFormula = Array.from(inFormula).map((char,index) => {
        if ("+-×÷^()".includes(char)) {
            return " " + char + " ";
        } else {
            return char;
        }
    }).join("");

    return outFormula;
}

// Evaluates the expression and displays appropriately
function handleEqualsButton() {
    
    // Close all brackets and update equals button
    CALC_INPUT_DISPLAY_ELEMENT.innerHTML += calculateClosingBracketsString();
    var str = CALC_INPUT_DISPLAY_ELEMENT.innerHTML;
    updateEqualsButton();
    
    const arr = compute(str);

    if (arr[0] == 1) {
        // Incorrect expression
        CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = ERROR_TEXT;
    } else {
        // Correct expression
        CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = arr[1];
        appendHistory(str,arr[1]);
        navigator.clipboard.writeText(arr[1]).catch(err => {
            console.error('Could not copy text: ', arr[1], err);
        });
        CALC_INPUT_DISPLAY_ELEMENT.innerHTML = arr[1];
    }
    CALC_OUTPUT_DISPLAY_ELEMENT.classList.remove("output_grayed");
}

// Returns true if all checks are passed by the given expression
function doAllChecksPass(str) {
    
    const bool_1 = checkBothSideOfOperators(str);
    // Add more if required TODO !!!

    return bool_1;
}

// Translates the expression that is understandable by the data structure
function translateExpression(str) {
    if (SHOW_LOGS) console.log("(6) Received for translation:" + str);
    
    var char_map = {
        "×":"*",
        "÷":"/",
        ",":""
    };
    var out_str = "";

    var out_str = str.split('').map(function(char) {
        return char_map[char] || char;
    }).join('');

    if (SHOW_LOGS) console.log("(6) After translation:" + out_str);
    return out_str;
}

// Checks that all operators have numbers on both sides
function checkBothSideOfOperators(str) {

    if (SHOW_LOGS) console.log("(5) Received for check:" + str);

    if (!"+-*/^)".includes(str[0]) && !"+-*/^(".includes(str[str.length-1])) {
        for (let index = 1; index < str.length-1; index++) {
            const previousElement = str[index-1];
            const ele = str[index];
            const nextElement = str[index+1];
            if ("+-*/^".split("").includes(ele)) {
                // Current element is an operator. check both sides
                const valid_left = "0123456789).".split("");
                const valid_right = "0123456789(.".split("");
                if (!(valid_left.includes(previousElement) && valid_right.includes(nextElement))) {
                    console.log("(5) found incorrect charcters beside operator, check failed at:" + previousElement + ele + nextElement);
                    return false;
                }
            }
        }
        return true;
    }

    if (SHOW_LOGS) console.log("(5) less than 3 atomaics found. Check failed");
    return false;
}

// Recursively evaluate the nested data structure are renturn the answer
// returns an array:
// index 0: 0 if value is valid
//          1 if value is incorrect
// index 1: correct value if index 0 == 0
function evaluateDataStructure(nestedArray) {
    
    var outArray = nestedArray.map(ele => {
        if (typeof ele == "number") {
            return ele;
        } else if (typeof ele == "string") {
            return ele;
        } else if (Array.isArray(ele)) {
            const sub_arr = evaluateDataStructure(ele);
            if (sub_arr[0] == 1) return [1,];
            return sub_arr[1];
        } else {
            return ele;
        }
    })

    if (outArray.length == 1) {
        return [0,outArray[0]];
    } else if (outArray.length == 2) {
        return [1,];
    } else if (outArray.length == 3) {
        return [0,evaluateExpression(outArray[0],outArray[1],outArray[2])];
    }
    if ((outArray.length-3)%2 != 0) {
        console.log("ERROR: Incorrect size of array (102)",outArray);
        return [1,];
    }
    var updatedOutArray = outArray;
    const operators = "^/*+-".split("");
    // BODMAS rule
    const maxLoopCount = 16;
    let loopCount = 0;
    while (updatedOutArray.length != 1 && loopCount != maxLoopCount) {
        loopCount++;

        operators.forEach(current_operator => {
            for (let index = 1; index < updatedOutArray.length; index+=2) {
                const element = updatedOutArray[index];
                if (element == current_operator) {
                    if (SHOW_LOGS) console.log("==> op. match at index:",index);
                
                    const element_left = updatedOutArray[index-1];
                    const element_right = updatedOutArray[index+1];
                    
                    const value = evaluateExpression(element_left,element,element_right);
                    
                    updatedOutArray[index -1] = value;
                    // remove the index from array and return new array
                    updatedOutArray = shiftElementsLeft(updatedOutArray,index);
                    updatedOutArray = shiftElementsLeft(updatedOutArray,index);
                }
            
            }
        if (SHOW_LOGS) console.log("=== ",current_operator," ===");
        if (SHOW_LOGS) console.log(updatedOutArray);
        
        });
    }
    
    return [0,updatedOutArray[0]];
}

// remove the index from array and return new array
function shiftElementsLeft(inArray, indexToRemove) {
    
    outArray = [];

    // Push everything that is not at the given index
    for (let currentIndex = 0; currentIndex < inArray.length; currentIndex++) {
        if (currentIndex != indexToRemove) {
            outArray.push(inArray[currentIndex]);
        }
    }

    return outArray;
}

// Evaluates the expression with a and b ints and op operator
function evaluateExpression(opperandA, opperator, opperandB) {
    switch (opperator) {
        case "+":
            return Decimal.add(opperandA,opperandB);
        case "-":
            return Decimal.sub(opperandA,opperandB);
            case "*":
                return Decimal.mul(opperandA,opperandB);
        case "/":
            return Decimal.div(opperandA,opperandB);
        case "^":
            return Decimal.pow(opperandA,opperandB);
        default:
            console.log("Error (101)");
            break;
    }
}

// Returns the expression without syntax sugars 
function removeSyntaxSugars(inString) {
    inString = removeSyntaxSugarSingleDecimal(inString);
    inString = removeSyntaxSugarPlusMinus(inString);
    inString = removeSyntaxSugarImplicitMultiplication(inString);
    inString = removeSyntaxSugarPlusPlusAndMinusMinus(inString);
    inString = removeSyntaxSugarPlusMinusBothSideNumber(inString);
    inString = removeSyntaxSugarPercent(inString);

    return inString;
}

// Returns 0 as a string if only a decimal is found in str,,
//   otherwise no change
function removeSyntaxSugarSingleDecimal(inString) {
    if (inString === ".") {
        return "0";
    }
    return inString;
}

// removes multiple plus or minus one after another
function removeSyntaxSugarPlusPlusAndMinusMinus(inString) {
    let outString = '';
    if (inString.length <= 1) return inString;

    for (let firstPtr = 0;firstPtr < inString.length-1;) {
        let secondPtr = firstPtr+1;
        if ("+-".includes(inString[firstPtr])) {
            while (secondPtr < inString.length) {
                if (inString[firstPtr]==inString[secondPtr]) {
                    secondPtr++;
                } else {
                    break;
                }
            }
        }
        if ('-'.includes(inString[firstPtr]) && ((secondPtr-firstPtr)%2 == 0)) {
            outString+= '+';
        } else {
            outString+= inString[firstPtr];
        }
        firstPtr = secondPtr;
    }
    outString += inString[inString.length-1];

    return outString;
}

// Changes a % into a `*0.01` expression
function removeSyntaxSugarPercent(inString) {
    if (SHOW_LOGS) console.log("(11) Received:",inString);
    
    inString = Array.from(inString).map((char, index) => {
        if (char == "%") {
            return "*0.01";
        }
        return char;
    }).join("");
    
    if (SHOW_LOGS) console.log("(11) After De sugar:",inString);
    return inString;
}

// De sugars plus and minus sign where a placeholder 0 is placed on left 
//    side of the sign if no numbers exist
function removeSyntaxSugarPlusMinusBothSideNumber(inString) {
    if (SHOW_LOGS) console.log("(4) Received:" + inString);

    var outStr = "";

    var lastCharWasNumber = false;
    for (let index = 0; index < inString.length; index++) {
        const ele = inString[index];
        
        if (!lastCharWasNumber && "+-".split("").includes(ele)) {
            outStr += "0";
            lastCharWasNumber = false;
        } else if ("0123456789)".split("").includes(ele)) {
            lastCharWasNumber = true;
        } else {
            lastCharWasNumber = false;
        }

        outStr += ele;

    }

    if (SHOW_LOGS) console.log("(4) de sugared:" + outStr);
    return outStr;
}


// De sugars the implicit multiplication introduced by number followed by bracket
function removeSyntaxSugarImplicitMultiplication(inString) {
    if (SHOW_LOGS) console.log("(3) Received:" + inString);

    var outString = "";

    var lastCharWasNumber = false;
    for (let index = 0; index < inString.length; index++) {
        const ele = inString[index];
        
        if (lastCharWasNumber && ele == "(") {
            outString += "*";
        } else if ("0123456789".split("").includes(ele)) {
            lastCharWasNumber = true;
        } else {
            lastCharWasNumber = false;
        }

        outString += ele;
    }

    if (SHOW_LOGS) console.log("(3) de sugared:" + outString);
    return outString;
}

// De sugars the plus minus operator
function removeSyntaxSugarPlusMinus(inString) {
    if (SHOW_LOGS) console.log("(2) Received:"+ inString);
    
    if (inString.length < 2) return inString
    var outString = "";
    var last_ele_plus_mius = false;
    for (let index = 0; index < inString.length-1; index++) {
        const ele = inString[index];
        const next_ele = inString[index+1];

        if (last_ele_plus_mius) {
            last_ele_plus_mius = false;
        } else if (ele == "+" && next_ele == "-") {
            // Desugar
            outString += "-";
            last_ele_plus_mius = true;
        } else {
            outString += ele;
        }
    }
    
    outString += inString[inString.length-1];
    
    if (SHOW_LOGS) console.log("(3) de sugared:"+ outString);
    return outString;
}


// Returns an array with correct type for ints which are direct children
function convertElementsToCorrectType(inArray) {
    var outArray = [];
    inArray.forEach(ele => {
        if (!Array.isArray(ele) && !"+-*/^".split("").includes(ele)) {
            if (ele.split("").includes(".")) {
                // Number is a float
                outArray.push(parseFloat(ele));
            } else {
                // Number is an int
                outArray.push(parseInt(ele));
            }
        } else {
            outArray.push(ele);
        }
    });
    return outArray;
}

// Returns true if the bracket at index 0 is closed at the last index
//       if char at first index is not bracket then returns false 
function isStringWrappedInBrackets(inString) {
    if (inString[0] != "(") return false;

    // First char is opening bracket
    let bracketCount = 0;
    let haveClosedInitialBracket = false;

    for (let index = 0; index < inString.length; index++) {
        const char = inString[index];
        if (char == "(") bracketCount++;
        if (char == ")") bracketCount--;
        if (haveClosedInitialBracket) return false;
        if (bracketCount == 0) haveClosedInitialBracket=true;
    }

    return true;
}

// Returns an array of nested arrays
function parseDataStructure(inString) {

    if (SHOW_LOGS) console.log("Parse DS :" + inString);
    
    if (isStringWrappedInBrackets(inString)) {
        inString = inString.substring(1,inString.length-1);
    }
    if (SHOW_LOGS) console.log("Front, last bracket removed :" + inString);
    
    var outArray = [];
    var currentChunk = "";

    var insideBrackets = false;
    var bracketCounter = 0;

    inString.split("").forEach(ele => {
        if (SHOW_LOGS) console.log("=== " + ele + " ===");
        if (insideBrackets) {
            // Inside the bracket, only count brackets until last one is closed
            if (SHOW_LOGS) console.log("letter:"+ele+" (0)")
            
            if (ele == "(") {
                bracketCounter++;
            } else if (ele == ")") {
                bracketCounter--;
            }

            currentChunk += ele;

            if (bracketCounter == 0) {
                if (SHOW_LOGS) console.log("====================================");
                if (SHOW_LOGS) console.log(" Computing inner bracket");
                if (SHOW_LOGS) console.log("====================================");
                outArray.push(parseDataStructure(currentChunk));
                currentChunk = "";
                insideBrackets = false;
            }

        } else {
            
            if (ele == "(") {
                if (SHOW_LOGS) console.log("letter:"+ele+" (1)")
                insideBrackets = true;
                bracketCounter++;
                currentChunk = "(";
            } else if ("0123456789.".split("").includes(ele)) {
                if (SHOW_LOGS) console.log("letter:"+ele+" (2)")
                currentChunk += ele;
            } else if ("+-*/^".split("").includes(ele)) {
                if (SHOW_LOGS) console.log("letter:"+ele+" (3)")
                outArray.push(currentChunk);
                currentChunk = "";
                outArray.push(ele);
            }

        }
    });
    outArray.push(currentChunk);

    return convertElementsToCorrectType(removeEmptyElementsTopLevel(outArray));
}

// Returns an array with no empty elements as direct children
function removeEmptyElementsTopLevel(arr) {
    return arr.filter(item => {
        // Filter out empty strings and arrays
        if (Array.isArray(item)) {
            return item.length !== 0; // Keep non-empty arrays
        } else {
            return item !== ""; // Keep non-empty strings
        }
    });
}

// Returns the correct number of brackets that should be appended 
// to make the expression valid
function calculateClosingBracketsString() {
    const str = CALC_INPUT_DISPLAY_ELEMENT.innerHTML;
    var bracketCounter = 0;

    str.split("").forEach(ele => {
        if (ele == "(") {
            bracketCounter++;
        };
        if (ele == ")") {
            bracketCounter--;
        }
    });

    return repeatString(")", bracketCounter);
}

// Updates the text displayed and runs any routines
function updateEqualsButton() {
    const txt = calculateClosingBracketsString();
    if (txt.length == 0) {
        EQUALS_BUTTON_ELEMENT.innerHTML = "=";
    } else {
        EQUALS_BUTTON_ELEMENT.innerHTML = txt;
    }

    // TODO: temporarily compute the expression and display grayed out result
    const str = CALC_INPUT_DISPLAY_ELEMENT.innerHTML + txt;
    if (str.length == 0) {
        // TODO: handle case where input is nothing
        CALC_OUTPUT_DISPLAY_ELEMENT.classList.remove("output_grayed");
        return;
    }
    const arr = compute(str);
    
    if (arr[0] == 1) {
        // Incorrect expression
        // TODO: can add a popup for user or another way to hint that the expr is wrong
    } else {
        CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = arr[1];
        fitTextOutputDisplay();
    }
    CALC_OUTPUT_DISPLAY_ELEMENT.classList.add("output_grayed");

}

function calculatorButtonPressed(btn) {
    acceptInput(btn.value);
}

// Adds the corresponding input to display
function acceptInput(value) {
    CALC_INPUT_DISPLAY_ELEMENT.innerHTML += value;
    updateEqualsButton();
}

// Removes the last character entered if any exist
function removeInput() {
    const len = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.length;
    if (len != 0) {
        CALC_INPUT_DISPLAY_ELEMENT.innerHTML = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.substring(0,len -1);
        if (len==1) CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML='';
    }
    updateEqualsButton();
}

// **** UTILS ****


function repeatString(str, numTimes) {
    var repeatedString = "";
    for (var i = 0; i < numTimes; i++) {
        repeatedString += str;
    }
    return repeatedString;
}

// Returns true if portrait window
function isOrientationPortrait() {
    // Get the width and height of the window
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    // Compare width and height to determine orientation
    if (width > height) {
        return false;
    } else {
        return true;
    }
}
