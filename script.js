const calc_display = document.getElementById("display");
calc_display.innerHTML = "";
// calc_display.innerHTML = "999";


function accept_input(btn) {
    calc_display.innerHTML += btn.value;
}


// TODO
function compute() {
    var temp_inp = calc_display.innerHTML;
    console.log(temp_inp = temp_inp.split(/[\+\-\*\/]/));  // Regex to sep. on operators
}


// TODO
function remove_input() {
    const len = calc_display.innerHTML.length;
    if (len != 0) {
        calc_display.innerHTML = calc_display.innerHTML.substring(0,len -1);
    }
}