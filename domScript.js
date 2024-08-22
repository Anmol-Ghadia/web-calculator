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
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

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

// Redirects the client to github project
function redriectToHelp() {
    window.location.href = 'https://github.com/Anmol-Ghadia/WebCalculator';
}

// Toggles between dark and light theme each time it is called
function handleThemeToggle() {
    let lightThemeFile = 'styles/lightTheme.css';
    if (IS_LIGHT_THEME) {
        // Change to dark theme

        var stylesheet = document.querySelector('link[href="' + lightThemeFile + '"][rel="stylesheet"]');
        if (stylesheet) {
            stylesheet.parentNode.removeChild(stylesheet);
        }

        IS_LIGHT_THEME = false;
    } else {
        // Change to light theme

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = lightThemeFile;

        document.head.appendChild(link);

        IS_LIGHT_THEME = true;
    }
    if (SHOW_LOGS) console.log("Theme toggled, is white: ", IS_LIGHT_THEME);
}

// Handler for Key presses
function keyPressHandler(event) {
    if ('0123456789+-*/^%().'.includes(event.key)) {
        acceptInput(event.key);
    } else if (event.key === 'Backspace') {
        removeInput();
    } else if (['Enter', '='].includes(event.key)) {
        handleEqualsButton();
        event.preventDefault();
    }
}

// Adds the given formula and answer as a dom element in the history tab
function appendHistory(formula, answer) {
    const historyCellElement = document.createElement('div');
    const historyFormulaElement = document.createElement('div');
    const historyAnswerElement = document.createElement('div');
    const hitoryCellTopSpacer = document.createElement('div');

    hitoryCellTopSpacer.classList.add("history_cell_top_spacer");
    historyCellElement.classList.add("history_cell");
    historyFormulaElement.classList.add("history_formula");
    historyAnswerElement.classList.add("history_answer");

    // Styling
    historyCellElement.addEventListener('click', function () {
        // Copy the answer text to the clipboard
        navigator.clipboard.writeText(historyAnswerElement.textContent)
            .catch(err => {
                console.error('Could not copy answer to clipboard: ', err);
            });
    });

    historyFormulaElement.innerHTML = beautifyHistoryFormula(formula + " =");
    historyAnswerElement.innerHTML = answer;

    historyCellElement.appendChild(hitoryCellTopSpacer);
    historyCellElement.appendChild(historyFormulaElement);
    historyCellElement.appendChild(historyAnswerElement);

    const history_container = document.getElementsByClassName("history_container")[0];
    history_container.appendChild(historyCellElement);
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

// All clear of output and input display
function clearInput() {
    CALC_INPUT_DISPLAY_ELEMENT.innerHTML = "";

    CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = "";
    updateEqualsButton();
}

// Adds spacing to improve readibility of the formula when displayed
function beautifyHistoryFormula(inFormula) {

    let outFormula = Array.from(inFormula).map((char, index) => {
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
        appendHistory(str, arr[1]);
        navigator.clipboard.writeText(arr[1]).catch(err => {
            console.error('Could not copy text: ', arr[1], err);
        });
        CALC_INPUT_DISPLAY_ELEMENT.innerHTML = arr[1];
    }
    CALC_OUTPUT_DISPLAY_ELEMENT.classList.remove("output_grayed");
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
    let length = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.length;
    const lastChar = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.substring(length - 1, length);

    let cond_1 = '+-×÷%^'.split('').includes(value);
    let cond_2 = length != 0;
    let cond_3 = '+-×÷%^'.split('').includes(lastChar);
    if (cond_1 && cond_2 && cond_3 && (lastChar != '%')) {
        CALC_INPUT_DISPLAY_ELEMENT.innerHTML = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.substring(0, length - 1);
    }
    CALC_INPUT_DISPLAY_ELEMENT.innerHTML += value;
    updateEqualsButton();
}

// Removes the last character entered if any exist
function removeInput() {
    const len = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.length;
    if (len != 0) {
        CALC_INPUT_DISPLAY_ELEMENT.innerHTML = CALC_INPUT_DISPLAY_ELEMENT.innerHTML.substring(0, len - 1);
        if (len == 1) CALC_OUTPUT_DISPLAY_ELEMENT.innerHTML = '';
    }
    updateEqualsButton();
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
