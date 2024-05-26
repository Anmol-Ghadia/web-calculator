var logging = false;


const calc_display = document.getElementById("display");
calc_display.innerHTML = "";
const calc_display_append = document.getElementById("display_append");
calc_display_append.innerHTML = "";
const output_display = document.getElementById("output_display");
output_display.innerHTML = "";

// TODO !!!
function compute() {
    
    calc_display.innerHTML += compute_closed_brackets();
    var str = calc_display.innerHTML;
    update_display();
    
    // Add checks and syntax sugar deconstructors here
    str = remove_syntax_sugars(str);
    if (logging) console.log("After Syntax Sugar removed:" + str);
    const data_structure = parse_ds(str);
    if (logging) console.log("Data Structure:" + data_structure);
    const output = evaluate_data_structure(data_structure);
    if (logging) console.log("Value:" + output);
    output_display.innerHTML = output;

}

function evaluate_data_structure(nested_arr) {

    return 0;
}

// TODO !!!
// Returns the expression without syntax sugars 
function remove_syntax_sugars(str) {
    

    return str;
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
    
    return removeEmptyElementsTopLevel(out_arr);
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
}

// **** UTILS ****


function repeatString(str, numTimes) {
    var repeatedString = "";
    for (var i = 0; i < numTimes; i++) {
        repeatedString += str;
    }
    return repeatedString;
}