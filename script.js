var logging = false;
const error_text = "error";

const calc_display = document.getElementById("display");
calc_display.innerHTML = "";
const calc_display_append = document.getElementById("display_append");
calc_display_append.innerHTML = "=";
const output_display = document.getElementById("output_display");
output_display.innerHTML = "";

function clear_input(){
    calc_display.innerHTML = "";

    output_display.innerHTML = "";
    update_auto_complete_display();
}

// returns an array of size 2 by evaluating the 
//      provided expression as string
// Index 0: 0 if expression is evaluated properly,
//          1 if expression is invalid
// Index 1: correct value of the expression only if index 0 == 0
function compute(inp_str) {

    inp_str = translate_expression(inp_str);
    if (logging) console.log("After translation:" + inp_str);
    
    inp_str = remove_syntax_sugars(inp_str);
    if (logging) console.log("After Syntax Sugar removed:" + inp_str);
    
    if (!passes_all_checks(inp_str)) {
        // An incorrect expression is entered
        return [1,];
    }
    
    // TODO: division by 0 case
    
    const data_structure = parse_ds(inp_str);
    if (logging) console.log("Data Structure:" + data_structure);
    
    const evaluated_arr = evaluate_data_structure(data_structure);
    if (logging) console.log("Value:");
    
    return evaluated_arr;
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
        output_display.classList.remove("output_grayed");
        output_display.classList.add("output_incorrect");

    } else {
        // Correct expression
        output_display.innerHTML = arr[1];
        output_display.classList.remove("output_grayed");
        output_display.classList.remove("output_incorrect");

    }
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

    if (!"+-*/%^)".includes(str[0]) && !"+-*/%^(".includes(str[str.length-1])) {
        for (let index = 1; index < str.length-1; index++) {
            const prev_ele = str[index-1];
            const ele = str[index];
            const next_ele = str[index+1];
            if ("+-*/%^".split("").includes(ele)) {
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
            return a+b;
        case "-":
            return a-b
        case "*":
            return a*b
        case "/":
            return a/b;
        case "%":
            return a*(1/100)*b;   
        case "^":
            let total = a;
            for (let count = 1; count < b; count++) {
                total *= a;
            }
            return total;
        default:
            console.log("Error (101)");
            break;
    }
}


// TODO !!!
// Returns the expression without syntax sugars 
function remove_syntax_sugars(str) {
    str = remove_synatx_sugar_plus_minus(str);
    str = remove_synatx_sugar_implicit_multiplication(str);
    str = remove_synatx_sugar_plus_minus_both_side_number(str);

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
        } else if ("0123456789".split("").includes(ele)) {
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
        if (!Array.isArray(ele) && !"+-*/%^".split("").includes(ele)) {
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


// Returns an array of nested arrays
function parse_ds(str) {

    //  code to deal with user entered opening and closing brackets
    if (str.substring(0,1) == "(") {
        str = str.substring(1,str.length-1);
    }

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
            } else if ("+-*/%^".split("").includes(ele)) {
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
        output_display.classList.remove("output_incorrect");
        return;
    }
    const arr = compute(str);
    
    if (arr[0] == 1) {
        // Incorrect expression
        output_display.classList.remove("output_grayed");
        output_display.classList.add("output_incorrect");
        
    } else {
        output_display.innerHTML = arr[1];
        output_display.classList.add("output_grayed");
        output_display.classList.remove("output_incorrect");
    }

}


// Adds the corresponding input to display
function accept_input(btn) {
    calc_display.innerHTML += btn.value;
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
