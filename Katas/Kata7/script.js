let reverse = document.querySelector('#reverse');
let accum = document.querySelector('#accum');




let n = 1021;
let nStr = n.toString(); // Convert the number to a string
let reversedArray = nStr.split('').sort().reverse().join('');
reverse.append(reversedArray); // This appends the new text without replacing existing content

let accumText = "HbideVbxncC";
let accumArray = []; 
for (let index = 0; index < accumText.length; index++) {
    accumArray.push(accumText[index].toUpperCase() + accumText[index].repeat(index).toLowerCase()); 
}
let accumResult = accumArray.join("-");
accum.append(accumResult); // Append the accumulated result to the DOM element