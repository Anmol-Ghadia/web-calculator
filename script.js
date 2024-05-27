var logging = false;


const calc_display = document.getElementById("display");
calc_display.innerHTML = "";
const calc_display_append = document.getElementById("display_append");
calc_display_append.innerHTML = "";
const output_display = document.getElementById("output_display");
output_display.innerHTML = "";

// Evaluates the expression and displays appropriately
function compute() {
    
    calc_display.innerHTML += compute_closed_brackets();
    var str = calc_display.innerHTML;
    update_display();
    
    // Add checks and syntax sugar deconstructors here
    str = remove_syntax_sugars(str);
    if (logging) console.log("After Syntax Sugar removed:" + str);

    if (!passes_all_checks(str)) {
        // TODO !!!
        // Handle case where an incorrect expression is entered
        output_display.innerHTML = "Undefined";
        return;
    }

    const data_structure = parse_ds(str);
    if (logging) console.log("Data Structure:" + data_structure);
    const output = evaluate_data_structure(data_structure);
    if (logging) console.log("Value:" + output);
    output_display.innerHTML = output;

}

// Returns true if all checks are passed by the given expression
function passes_all_checks(str) {
    
    const bool_1 = check_both_side_of_operators(str);
    // Add more if required TODO !!!

    return bool_1;
}

// Checks that all operators have numbers on both sides
function check_both_side_of_operators(str) {

    if (logging) console.log("(5) Received for check:" + str);

    if (!"+-*/)".includes(str[0]) && !"+-*/(".includes(str[str.length-1])) {
        for (let index = 1; index < str.length-1; index++) {
            const prev_ele = str[index-1];
            const ele = str[index];
            const next_ele = str[index+1];
            if ("+-*/".split("").includes(ele)) {
                // Current element is an operator. check both sides
                const valid_left = "0123456789)".split("");
                const valid_right = "0123456789(".split("");
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
function evaluate_data_structure(nested_arr) {
    
    var out_arr = nested_arr.map(ele => {
        if (typeof ele == "number") {
            return ele
        } else if (typeof ele == "string") {
            return ele
        } else if (Array.isArray(ele)) {
            return evaluate_data_structure(ele);
        } else {
            return ele;
        }
    })

    if (out_arr.length == 1) {
        return out_arr[0];
    } else if (out_arr.length == 2) {
        return -99
    } else if (out_arr.length == 3) {
        return evaluate_expression(out_arr[0],out_arr[1],out_arr[2]);
    } else {
        if ((out_arr.length-3)%2 != 0) console.log("ERROR: Incorrect size of array (102)");

        var total = out_arr[0];
        for (let index = 0; index < (out_arr.length-1)/2; index++) {
            total = evaluate_expression(total,out_arr[(index*2)+1],out_arr[(index*2)+2])
        }
        return total;    }
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
    console.log("(4) Received:" + str);

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

    console.log("(4) de sugared:" + out_str);
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
        if (!Array.isArray(ele) && !"+-*/".split("").includes(ele)) {
            out_arr.push(parseInt(ele));
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
            } else if ("0123456789".split("").includes(ele)) {
                if (logging) console.log("letter:"+ele+" (2)")
                current_chunck += ele;
            } else if ("+-*/".split("").includes(ele)) {
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
function update_display() {
    calc_display_append.innerHTML = compute_closed_brackets();
}


// Adds the corresponding input to display
function accept_input(btn) {
    calc_display.innerHTML += btn.value;
    update_display();
}

// Removes the last character entered if any exist
function remove_input() {
    const len = calc_display.innerHTML.length;
    if (len != 0) {
        calc_display.innerHTML = calc_display.innerHTML.substring(0,len -1);
    }
    update_display();
}

// **** UTILS ****


function repeatString(str, numTimes) {
    var repeatedString = "";
    for (var i = 0; i < numTimes; i++) {
        repeatedString += str;
    }
    return repeatedString;
}