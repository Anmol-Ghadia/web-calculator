var logging = false;
const error_text = "error";
const history_tab_portrait_height = "30%";
const history_tab_landscape_width = "35vh";

const calc_display = document.getElementById("display");
calc_display.innerHTML = "";
const calc_display_append = document.getElementById("display_append");
calc_display_append.innerHTML = "=";
const output_display = document.getElementById("output_display");
output_display.innerHTML = "";

var history_shown = false;
addEventListener("DOMContentLoaded", init);
addEventListener('keydown', keyPressHandler);

function keyPressHandler(event) {
    if ('0123456789+-*/^%().'.includes(event.key)) {
        accept_input(event.key);
    } else if (event.key === 'Backspace') {
        remove_input();
    } else if (['Enter','='].includes(event.key)) {
        equals_compute();
        event.preventDefault();
    }
}

// Startup routine
function init() {
    history_button_clicked();
    history_button_clicked();
    generateTheme();
    applyTheme();
}

// Adds the given formula and answer as a dom element in the history tab
function add_history(formula,answer) {
    const history_cell = document.createElement('div');
    const history_formula = document.createElement('div');
    const history_answer = document.createElement('div');
    const history_cell_top_spacer = document.createElement('div');

    history_cell_top_spacer.classList.add("history_cell_top_spacer");
    history_cell.classList.add("history_cell");
    history_formula.classList.add("history_formula");
    history_answer.classList.add("history_answer");
    
    // Styling
    history_cell_top_spacer.classList.add(theme_highlight);
    history_cell.classList.add(theme_secodary);
    history_answer.classList.add(theme_secondary_text)
    history_formula.classList.add(theme_primary_text)

    history_cell.addEventListener('click', function() {
        // Copy the answer text to the clipboard
        navigator.clipboard.writeText(history_answer.textContent)
            .catch(err => {
                console.error('Could not copy answer to clipboard: ', err);
            });
    });
    history_formula.innerHTML = pre_process_history_formula(formula+" =");
    history_answer.innerHTML = answer;

    history_cell.appendChild(history_cell_top_spacer);
    history_cell.appendChild(history_formula);
    history_cell.appendChild(history_answer);

    const history_container = document.getElementsByClassName("history_container")[0];
    history_container.appendChild(history_cell);
}

function applyTheme() {
    // text
    document.getElementsByClassName("output_display")[0].classList.add(theme_primary_text);
    document.getElementById("display").classList.add(theme_secondary_text);

    // Background color
    document.getElementsByTagName("body")[0].classList.add(theme_primary);
    document.getElementById("calculator_container").classList.add(theme_secodary);
    document.getElementById("display").classList.add(theme_secodary);
    document.getElementsByClassName("output_container")[0].classList.add(theme_highlight);
    document.getElementsByClassName("history_container")[0].classList.add(theme_secodary);
    document.getElementsByClassName("history_container")[0].style.backdrop_filter = "brightness(60%)";
    
    // text + background
    Array.from(document.getElementsByTagName("button")).forEach(ele => {
        ele.classList.add(theme_primary);
        ele.classList.add(theme_primary_text);
    })
}

// Picks a random theme and sets global variables
function generateTheme() {

    let current_theme = Math.floor(Math.random() * 3) + 1;

    theme_primary = "theme_primary_" + current_theme;
    theme_secodary = "theme_secondary_" + current_theme;
    theme_highlight = "theme_highlight_" + current_theme;
    theme_primary_text = "theme_primary_text_" + current_theme;
    theme_secondary_text = "theme_secondary_text_" + current_theme;
}

function history_button_clicked() {
    const history_button = document.getElementById("history_toggle_btn");
    const history_container = document.getElementById("history_container");
    if (isOrientationPortrait()) {
        history_container.style.width = "100%";
        if (history_shown) {
            // Hide history
            history_container.style.height = "0%";
            history_button.innerHTML = "△";
            history_shown = false;
        } else {
            // show history    
            history_container.style.height = history_tab_portrait_height;
            history_button.innerHTML = "▽";
            history_shown = true;
        }
    } else {
        // TODO landscape mode !!!
        history_container.style.height = "100%";
        if (history_shown) {
            // Hide history
            history_container.style.width = "0%";
            history_button.innerHTML = ">";
            history_shown = false;
        } else {
            // show history    
            history_container.style.width = history_tab_landscape_width;
            history_button.innerHTML = "<";
            history_shown = true;
        }
    }
}

// Render history tab
addEventListener("resize", (event) => {
    history_button_clicked();
    history_button_clicked();
});

function clear_input(){
    calc_display.innerHTML = "";

    output_display.innerHTML = "";
    update_auto_complete_display();
}

// check that the percent does not have a number after it
function check_percent_is_not_followed_by_number(str) {

    let pre_percent = false;
    let found_mistake = false;
    
    str.split("").forEach(ele => {
        if (logging) console.log("(12) current_element:" , ele);
        if (pre_percent) {
            if (!"+-*/%^(".includes(ele)) {
                if (logging) console.log("(12)" , ele);
                found_mistake = true;
                return;
            }
            pre_percent = false;
        }
        if (ele == "%") {
            pre_percent = true;
        }
    });
    
    return !found_mistake;
}

// Checks that all pre checks are satisfied
function passes_all_pre_checks(str) {
    const bool_1 = check_percent_is_not_followed_by_number(str);

    return bool_1;
}

// returns an array of size 2 by evaluating the 
//      provided expression as string
// Index 0: 0 if expression is evaluated properly,
//          1 if expression is invalid
// Index 1: correct value of the expression only if index 0 == 0
function compute(inp_str) {

    inp_str = translate_expression(inp_str);
    if (logging) console.log("After translation:" + inp_str);

    if (!passes_all_pre_checks(inp_str)) {
        // An incorrect expression is entered
        return [1,];
    }
    if (logging) console.log("Passed all pre Checks:" + inp_str);
    
    inp_str = remove_syntax_sugars(inp_str);
    if (logging) console.log("After Syntax Sugar removed:" + inp_str);
    
    if (!passes_all_checks(inp_str)) {
        // An incorrect expression is entered
        return [1,];
    }
    if (logging) console.log("Passed all post Checks:" + inp_str);
    
    // TODO: division by 0 case
    
    const data_structure = parse_ds(inp_str);
    if (logging) console.log("Data Structure:" + data_structure);
    
    const evaluated_arr = evaluate_data_structure(data_structure);
    if (logging) console.log("Value:");
    
    return evaluated_arr;
}

// Adds spacing to improve readibility of the formula when displayed
function pre_process_history_formula(in_formula) {

    let out_formula = Array.from(in_formula).map((char,index) => {
        if ("+-×÷^()".includes(char)) {
            return " " + char + " ";
        } else {
            return char;
        }
    }).join("");

    return out_formula;
}

// Evaluates the expression and displays appropriately
function equals_compute() {
    
    // Close all brackets and update equals button
    calc_display.innerHTML += compute_closed_brackets();
    var str = calc_display.innerHTML;
    update_auto_complete_display();
    
    const arr = compute(str);

    if (arr[0] == 1) {
        // Incorrect expression
        output_display.innerHTML = error_text;
    } else {
        // Correct expression
        output_display.innerHTML = arr[1];
        add_history(str,arr[1]);
        navigator.clipboard.writeText(arr[1]).catch(err => {
            console.error('Could not copy text: ', arr[1], err);
        });
        calc_display.innerHTML = arr[1];
    }
    output_display.classList.remove("output_grayed");
}

// Returns true if all checks are passed by the given expression
function passes_all_checks(str) {
    
    const bool_1 = check_both_side_of_operators(str);
    // Add more if required TODO !!!

    return bool_1;
}

// Translates the expression that is understandable by the data structure
function translate_expression(str) {
    if (logging) console.log("(6) Received for translation:" + str);
    
    var char_map = {
        "×":"*",
        "÷":"/",
        ",":""
    };
    var out_str = "";

    var out_str = str.split('').map(function(char) {
        return char_map[char] || char;
    }).join('');

    if (logging) console.log("(6) After translation:" + out_str);
    return out_str;
}

// Checks that all operators have numbers on both sides
function check_both_side_of_operators(str) {

    if (logging) console.log("(5) Received for check:" + str);

    if (!"+-*/^)".includes(str[0]) && !"+-*/^(".includes(str[str.length-1])) {
        for (let index = 1; index < str.length-1; index++) {
            const prev_ele = str[index-1];
            const ele = str[index];
            const next_ele = str[index+1];
            if ("+-*/^".split("").includes(ele)) {
                // Current element is an operator. check both sides
                const valid_left = "0123456789).".split("");
                const valid_right = "0123456789(.".split("");
                if (!(valid_left.includes(prev_ele) && valid_right.includes(next_ele))) {
                    console.log("(5) found incorrect charcters beside operator, check failed at:" + prev_ele + ele + next_ele);
                    return false;
                }
            }
        }
        
        return true;

    }

    if (logging) console.log("(5) less than 3 atomaics found. Check failed");
    return false;
}

// Recursively evaluate the nested data structure are renturn the answer
// returns an array:
// index 0: 0 if value is valid
//          1 if value is incorrect
// index 1: correct value if index 0 == 0
function evaluate_data_structure(nested_arr) {
    
    var out_arr = nested_arr.map(ele => {
        if (typeof ele == "number") {
            return ele;
        } else if (typeof ele == "string") {
            return ele;
        } else if (Array.isArray(ele)) {
            const sub_arr = evaluate_data_structure(ele);
            if (sub_arr[0] == 1) return [1,];
            return sub_arr[1];
        } else {
            return ele;
        }
    })

    if (out_arr.length == 1) {
        return [0,out_arr[0]];
    } else if (out_arr.length == 2) {
        return [1,];
    } else if (out_arr.length == 3) {
        return [0,evaluate_expression(out_arr[0],out_arr[1],out_arr[2])];
    }
    if ((out_arr.length-3)%2 != 0) {
        console.log("ERROR: Incorrect size of array (102)",out_arr);
        return [1,];
    }
    var updated_out_arr = out_arr;
    const operators = "^/*+-".split("");
    // BODMAS rule
    const max_loop_count = 16;
    let loop_count = 0;
    while (updated_out_arr.length != 1 && loop_count != max_loop_count) {
        loop_count++;

        operators.forEach(current_operator => {
            for (let index = 1; index < updated_out_arr.length; index+=2) {
                const element = updated_out_arr[index];
                if (element == current_operator) {
                    if (logging) console.log("==> op. match at index:",index);
                
                    const element_left = updated_out_arr[index-1];
                    const element_right = updated_out_arr[index+1];
                    
                    const value = evaluate_expression(element_left,element,element_right);
                    
                    updated_out_arr[index -1] = value;
                    // remove the index from array and return new array
                    updated_out_arr = shift_element_left(updated_out_arr,index);
                    updated_out_arr = shift_element_left(updated_out_arr,index);
                }
            
            }
        if (logging) console.log("=== ",current_operator," ===");
        if (logging) console.log(updated_out_arr);
        
        });
    }
    
    return [0,updated_out_arr[0]];
}

// remove the index from array and return new array
function shift_element_left(in_arr, remove_index) {
    
    out_arr = [];

    // Push everything that is not at the given index
    for (let current_index = 0; current_index < in_arr.length; current_index++) {
        if (current_index != remove_index) {
            out_arr.push(in_arr[current_index]);
        }
    }

    return out_arr;
}

// Evaluates the expression with a and b ints and op operator
function evaluate_expression(a, op, b) {
    switch (op) {
        case "+":
            return Decimal.add(a,b);
        case "-":
            return Decimal.sub(a,b);
            case "*":
                return Decimal.mul(a,b);
        case "/":
            return Decimal.div(a,b);
        case "^":
            return Decimal.pow(a,b);
        default:
            console.log("Error (101)");
            break;
    }
}

// Returns the expression without syntax sugars 
function remove_syntax_sugars(str) {
    str = remove_synatx_sugar_plus_minus(str);
    str = remove_synatx_sugar_implicit_multiplication(str);
    str = remove_synatx_sugar_plus_minus_both_side_number(str);
    str = remove_syntax_sugar_percent(str);

    return str;
}

function remove_syntax_sugar_percent(str) {
    if (logging) console.log("(11) Received:",str);
    
    str = Array.from(str).map((char, index) => {
        if (char == "%") {
            return "*0.01";
        }
        return char;
    }).join("");
    
    if (logging) console.log("(11) After De sugar:",str);
    return str;
}

// De sugars plus and minus sign where a placeholder 0 is placed on left 
//    side of the sign if no numbers exist
function remove_synatx_sugar_plus_minus_both_side_number(str) {
    if (logging) console.log("(4) Received:" + str);

    var out_str = "";

    var last_element_was_number = false;
    for (let index = 0; index < str.length; index++) {
        const ele = str[index];
        
        if (!last_element_was_number && "+-".split("").includes(ele)) {
            out_str += "0";
            last_element_was_number = false;
        } else if ("0123456789)".split("").includes(ele)) {
            last_element_was_number = true;
        } else {
            last_element_was_number = false;
        }

        out_str += ele;

    }

    if (logging) console.log("(4) de sugared:" + out_str);
    return out_str;
}


// De sugars the implicit multiplication introduced by number followed by bracket
function remove_synatx_sugar_implicit_multiplication(str) {
    if (logging) console.log("(3) Received:" + str);

    var out_str = "";

    var last_element_was_number = false;
    for (let index = 0; index < str.length; index++) {
        const ele = str[index];
        
        if (last_element_was_number && ele == "(") {
            out_str += "*";
        } else if ("0123456789".split("").includes(ele)) {
            last_element_was_number = true;
        } else {
            last_element_was_number = false;
        }

        out_str += ele;
    }

    if (logging) console.log("(3) de sugared:" + out_str);
    return out_str;
}

// De sugars the plus minus operator
function remove_synatx_sugar_plus_minus(str) {
    if (logging) console.log("(2) Received:"+ str);
    
    if (str.length < 2) return str
    var out_str = "";
    var last_ele_plus_mius = false;
    for (let index = 0; index < str.length-1; index++) {
        const ele = str[index];
        const next_ele = str[index+1];

        if (last_ele_plus_mius) {
            last_ele_plus_mius = false;
        } else if (ele == "+" && next_ele == "-") {
            // Desugar
            out_str += "-";
            last_ele_plus_mius = true;
        } else {
            out_str += ele;
        }
    }
    
    out_str += str[str.length-1];
    
    if (logging) console.log("(3) de sugared:"+ out_str);
    return out_str;
}


// Returns an array with correct type for ints which are direct children
function convert_to_correct_type(arr) {
    var out_arr = [];
    arr.forEach(ele => {
        if (!Array.isArray(ele) && !"+-*/^".split("").includes(ele)) {
            if (ele.split("").includes(".")) {
                // Number is a float
                out_arr.push(parseFloat(ele));
            } else {
                // Number is an int
                out_arr.push(parseInt(ele));
            }
        } else {
            out_arr.push(ele);
        }
    });
    return out_arr;
}

// // Returns max depth of brackets in the expression
// function compute_max_depth(str) {
//     var max_depth = 0;
//     var open_brackets = 0;

//     str.split("").forEach(ele => {
//         if (ele == "(") {
//             open_brackets++;
//             if (open_brackets > max_depth) {
//                 max_depth = open_brackets;
//             }
//         };
//         if (ele == ")") {
//             open_brackets--;
//         }
//     });

//     return max_depth;
// }


// Returns true if the bracket at index 0 is closed at the last index
//       if char at first index is not bracket then returns false 
function first_bracket_closed_last(str) {
    if (str[0] != "(") return false;

    // First char is opening bracket
    let bracket_count = 0;
    let closed_initial_bracket = false;

    for (let index = 0; index < str.length; index++) {
        const char = str[index];
        if (char == "(") bracket_count++;
        if (char == ")") bracket_count--;
        if (closed_initial_bracket) return false;
        if (bracket_count == 0) closed_initial_bracket=true;
    }

    return true;
}

// Returns an array of nested arrays
function parse_ds(str) {

    if (logging) console.log("Parse DS :" + str);
    
    //  code to deal with user entered opening and closing brackets
    // if (str.substring(0,1) == "(") {
    //     str = str.substring(1,str.length-1);
    // }
    if (first_bracket_closed_last(str)) {
        str = str.substring(1,str.length-1);
    }
    if (logging) console.log("Front, last bracket removed :" + str);
    
    // if (logging) console.log("First_last bracket :" + str);
    var out_arr = [];
    var current_chunck = "";

    var inside_bracket = false;
    var bracket_count = 0;

    str.split("").forEach(ele => {
        if (logging) console.log("=== " + ele + " ===");
        if (inside_bracket) {
            // Inside the bracket, only count brackets until last one is closed
            if (logging) console.log("letter:"+ele+" (0)")
            
            if (ele == "(") {
                bracket_count++;
            } else if (ele == ")") {
                bracket_count--;
            }

            current_chunck += ele;

            if (bracket_count == 0) {
                if (logging) console.log("====================================");
                if (logging) console.log(" Computing inner bracket");
                if (logging) console.log("====================================");
                out_arr.push(parse_ds(current_chunck));
                current_chunck = "";
                inside_bracket = false;
            }

        } else {
            
            if (ele == "(") {
                if (logging) console.log("letter:"+ele+" (1)")
                inside_bracket = true;
                bracket_count++;
                current_chunck = "(";
            } else if ("0123456789.".split("").includes(ele)) {
                if (logging) console.log("letter:"+ele+" (2)")
                current_chunck += ele;
            } else if ("+-*/^".split("").includes(ele)) {
                if (logging) console.log("letter:"+ele+" (3)")
                out_arr.push(current_chunck);
                current_chunck = "";
                out_arr.push(ele);
            }

        }
    });
    out_arr.push(current_chunck);

    return convert_to_correct_type(removeEmptyElementsTopLevel(out_arr));
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
function compute_closed_brackets() {
    const str = calc_display.innerHTML;
    var open_brackets = 0;

    str.split("").forEach(ele => {
        if (ele == "(") {
            open_brackets++;
        };
        if (ele == ")") {
            open_brackets--;
        }
    });

    return repeatString(")", open_brackets);
}

// Updates the text displayed and runs any routines
function update_auto_complete_display() {
    const txt = compute_closed_brackets();
    if (txt.length == 0) {
        calc_display_append.innerHTML = "=";
    } else {
        calc_display_append.innerHTML = txt;
    }

    // TODO: temporarily compute the expression and display grayed out result
    const str = calc_display.innerHTML + txt;
    if (str.length == 0) {
        // TODO: handle case where input is nothing
        output_display.classList.remove("output_grayed");
        return;
    }
    const arr = compute(str);
    
    if (arr[0] == 1) {
        // Incorrect expression
    } else {
        output_display.innerHTML = arr[1];
    }
    output_display.classList.add("output_grayed");

}

function calculator_button_pressed(btn) {
    accept_input(btn.value);
}

// Adds the corresponding input to display
function accept_input(value) {
    calc_display.innerHTML += value;
    update_auto_complete_display();
}

// Removes the last character entered if any exist
function remove_input() {
    const len = calc_display.innerHTML.length;
    if (len != 0) {
        calc_display.innerHTML = calc_display.innerHTML.substring(0,len -1);
    }
    update_auto_complete_display();
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
