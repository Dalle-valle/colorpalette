// **************** GENERAL - START ****************

// using strict for troubleshooting
"use strict";

// Adding an eventlistener to the window to call the startcolor function
window.addEventListener("DOMContentLoaded", startColor);

// Adding an eventlistener to the input area of the colorselector
// This calls the function to get the hexcolor from the user
document.querySelector("#colorvalue").addEventListener("input", getHex);

// Adding eventlisteners to all of the radio buttons to update when
// the user clicks another harmony, calls the getHarmony function
document.querySelectorAll(".harmonyselection input").forEach((button) => {
  button.addEventListener("click", getHarmony);
});

// **** Global Variables - start ****

// Defining my global cariables that sets the global HSL value and sets
// the currentHarmony to analogous as the default value
let baseHSL;
let currentHarmony = "analogous";

// **** Global Variables - end ****

// **************** GENERAL - END ****************

//**************** FUNCTIONS - START ****************

// Start function called by the window eventlistener, sets the starting
// color and defines r, g and b. these are put into an object so we can use
// it to convert the rgb colors to a hexcode
// calls the function showColorSelection with the hexconversion as parameter
// this called function is my delegator that I use to calculate my values
function startColor() {
  const r = 100;
  const g = 250;
  const b = 40;
  const convertToHex = rgbToHex({ r, g, b });
  showColorSelection(convertToHex);
}

// This is the function I use to get the selected harmony value on my radio buttons
// from here i call the function to refresh the harmony and keep it updated

function getHarmony() {
  currentHarmony = this.value;
  refreshHarmony();
}

// The function that refreshes my harmony and calls a new function that
// creates an array with my HSL values, sending my variable with hsl as paramenter

function refreshHarmony() {
  selectedHarmony(baseHSL);
}

// This is my function that stores the value of the user selection in
// the constant hexSelection. Here I also called the delegator function,
// but this time with the user input as a parameter
function getHex() {
  const hexSelection = this.value;
  showColorSelection(hexSelection);
}

// **************** DELEGATOR - START ****************

// delegator (set base color), call hexToRGB, call rgbToHSL

// This is my calculation function. I start by sending my hexCode as a parameter,
// then I create a variable that each calls a function to calculate the different
// values. The CSSstring conversion is there for future use, should it be needed.
// Important note here is that the selectedHarmony function is called here
// This is the function that creates an array for all 5 color variations.
// The third box (at index [2]) is untouched, since it is the base color-
function showColorSelection(hexCode) {
  // hextoRGB, hexCode as parameter
  const rgb = hexToRGB(hexCode);

  //  and rgbToHSL, rgb as parameter
  const hsl = rgbToHSL(rgb);

  // aaaand convert css, rgb parameter
  const css = rgbToCss(rgb);

  // grab selectedHarmony and create an array in the function
  selectedHarmony(hsl);
}

// The function that creates my harmonic array.
// This is done by leaving the base color ([2]) as is, then creating an array
// assigning an h, s and l value for the remaining 4 boxes on indexes [0][1][3] and [4]
// I then created a variable to call the function
// of each calculation with harmony as parameter
// along with the scoped HSL value from array
// at the end of the function I call a new function to show my colors via forEach,
// then calling the showcolors function for all of them.

function selectedHarmony(scopedHSL) {
  baseHSL = scopedHSL;
  const harmony = [
    { h: scopedHSL.h, s: scopedHSL.s, l: scopedHSL.l },
    { h: scopedHSL.h, s: scopedHSL.s, l: scopedHSL.l },
    scopedHSL,
    { h: scopedHSL.h, s: scopedHSL.s, l: scopedHSL.l },
    { h: scopedHSL.h, s: scopedHSL.s, l: scopedHSL.l },
  ];

  const harmonyCalc = getHarmonyCalcs(harmony);
  showColors(harmonyCalc);
}
// **************** DELEGATOR - END ****************

// **************** CALCULATIONS - START ****************

// RGB to Css String (unused)
function rgbToCss(rgb) {
  const cssString = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  return cssString;
}

// HEX to RGB calculation with hexValue as parameter
// we split the hexcode in to a substring skipping the # at (1) and take the 2nd and 3rd,
// then the 4th and 5th and lastly the 6th and 6th character and convert them into a
// number with parseInt. At the end we return the colors into an object with the values
// red, green and blue

function hexToRGB(hexValue) {
  const red = Number.parseInt(hexValue.substring(1, 3), 16);
  const green = Number.parseInt(hexValue.substring(3, 5), 16);
  const blue = Number.parseInt(hexValue.substring(5, 7), 16);

  return { red, green, blue };
}

// and the other way around so we get a hexcolor returned, here we sent rgb as parameter
function rgbToHex(rgb) {
  const r = rgb.r.toString(16).padStart(2, "0");
  const g = rgb.g.toString(16).padStart(2, "0");
  const b = rgb.b.toString(16).padStart(2, "0");

  const hexColor = `#${r}${g}${b}`;
  return hexColor;
}

// rgbToHSL (calculate) return HSL, code copied from eter.

function rgbToHSL(rgb) {
  let r = rgb.red;
  let g = rgb.green;
  let b = rgb.blue;

  r /= 255;
  g /= 255;
  b /= 255;

  let h, s, l;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h = h + 360;
  }

  l = (min + max) / 2;

  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }
  // multiply s and l by 100 to get the value in percent, rather than [0,1]
  s *= 100;
  l *= 100;

  h = Number(h.toFixed());
  s = Number(s.toFixed());
  l = Number(l.toFixed());

  return { h, s, l };
}

//// hslToRGB calculation (blackboxed), from eter
function hslToRGB(hsl) {
  let h = hsl.h;
  let s = hsl.s;
  let l = hsl.l;
  h = h;
  s = s / 100;
  l = l / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return { r, g, b };
}

// Calculating analogous by changing the h-values on each (except base) h value
// in my array. returning the harmony and applying it via my applyHarmony function.
// * Same applies for all the different calculations, where I change the values
// of each depending if the hue, saturation or lightness needs to be altered.
function analogueCalc(harmony, scopedHSL) {
  harmony[0].h = scopedHSL.h - 50;
  harmony[1].h = scopedHSL.h - 25;
  harmony[3].h = scopedHSL.h + 25;
  harmony[4].h = scopedHSL.h + 50;
  applyHarmony(harmony);
  return harmony;
}

// Monochromatic Calculation
// See above*

function monoCalc(harmony, scopedHSL) {
  harmony[0].s = scopedHSL.s - 30;
  harmony[1].s = scopedHSL.s - 15;
  harmony[3].s = scopedHSL.s + 15;
  harmony[4].s = scopedHSL.s + 30;
  applyHarmony(harmony);
  return harmony;
}

// Triad calculation
// See above*

function triadCalc(harmony, scopedHSL) {
  harmony[0].h = scopedHSL.h - 60;
  harmony[1].h = scopedHSL.h - 60;
  harmony[3].h = scopedHSL.h + 60;
  harmony[4].h = scopedHSL.h + 60;
  applyHarmony(harmony);
  return harmony;
}

// Complementary calculation
// See above*

function complementCalc(harmony, scopedHSL) {
  harmony[0].h = scopedHSL.h + 180;
  harmony[1].h = scopedHSL.h + 180;
  harmony[3].h = scopedHSL.h + 180;
  harmony[4].h = scopedHSL.h + 180;
  applyHarmony(harmony);
  return harmony;
}

// Compound calculation
// See Above
function compoundCalc(harmony, scopedHSL) {
  harmony[0].h = scopedHSL.h - 50;
  harmony[1].h = scopedHSL.h + 180;
  harmony[3].h = scopedHSL.h + 180;
  harmony[4].h = scopedHSL.h + 50;
  applyHarmony(harmony);
  return harmony;
}

// Shade Calculation
// See above*
function shadeCalc(harmony, scopedHSL) {
  harmony[0].l = scopedHSL.l - 35;
  harmony[1].l = scopedHSL.l - 15;
  harmony[3].l = scopedHSL.l + 15;
  harmony[4].l = scopedHSL.l + 35;
  applyHarmony(harmony);
  return harmony;
}
// **************** CALCULATIONS - END ****************

// **************** MAKE VIEW HAPPEN - START ****************

// The function that makes sure that all 5 boxes will be displayed
// this is achieved by adding a forEach, that will call the function
// on each element based on current harmony calculation.

function showColors(harmonyCalc) {
  harmonyCalc.forEach((elm) => {
    showColor(harmonyCalc, elm);
  });
}

// The function that will do the calculations and store them as variables
// for all of the different values we need (hsl is the base value we calculate from
// so we only need to store rgb and hex, as hsl is sent as parameter)
// and finally we call the function that makes everythin display in the right divs( the final function)

function showColor(harmonyCalc, hsl) {
  const rgb = hslToRGB(hsl);
  const hex = rgbToHex(rgb);
  showEverything(harmonyCalc, hsl, rgb, hex);
}

// The function that determines which calculation that needs to be done
// based on user selection from the radio buttons.
// All the calcululations uses the same parameters
// returns the harmony array when called

function getHarmonyCalcs(harmony) {
  const scopedHSL = harmony[2];
  if (currentHarmony === "analogous") {
    analogueCalc(harmony, scopedHSL);
  } else if (currentHarmony === "monochromatic") {
    monoCalc(harmony, scopedHSL);
  } else if (currentHarmony === "triad") {
    triadCalc(harmony, scopedHSL);
  } else if (currentHarmony === "complementary") {
    complementCalc(harmony, scopedHSL);
  } else if (currentHarmony === "compound") {
    compoundCalc(harmony, scopedHSL);
  } else if (currentHarmony === "shades") {
    shadeCalc(harmony, scopedHSL);
  }
  return harmony;
}

// the function that makes sure that we don't exceed 360 degres
// we do this for each hsl in the array.
function applyHarmony(harmony) {
  harmony.forEach((hsl) => {
    if (hsl.h < 0) {
      hsl.h += 360;
    } else if (hsl.l > 360) {
      hsl.h -= 360;
    }

    if (hsl.s < 0) {
      hsl.s -= 0 + hsl.s;
    } else if (hsl.s > 100) {
      hsl.s -= hsl.s - 100;
    }

    if (hsl.l < 0) {
      hsl.l -= 100;
    } else if (hsl.l > 100) {
      hsl.l += 100;
    }
  });
}
// And finally we create 4 variables that refers to the HTML elements we need to display
// the colors, the hex, rgb and hsl values and sets the backgrounds.
function showEverything(harmonyCalc, hsl, rgb, hex) {
  const background = document.querySelector(".box:nth-child(" + (harmonyCalc.indexOf(hsl) + 1) + ") .color");
  const displayHEX = document.querySelector(".box:nth-child(" + (harmonyCalc.indexOf(hsl) + 1) + ") .hex");
  const displayRGB = document.querySelector(".box:nth-child(" + (harmonyCalc.indexOf(hsl) + 1) + ") .rgb");
  const displayHSL = document.querySelector(".box:nth-child(" + (harmonyCalc.indexOf(hsl) + 1) + ") .hsl");

  background.style.backgroundColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  displayHEX.textContent = `HEX: ${hex}`;
  displayRGB.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
  displayHSL.textContent = `HSL: ${hsl.h}, ${hsl.s}%, ${hsl.s}%`;
}
// **************** MAKE VIEW HAPPEN - END ****************
