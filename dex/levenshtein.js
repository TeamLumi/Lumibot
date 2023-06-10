/**
 * Modified version of https://stackoverflow.com/questions/43393136/js-create-smart-auto-complete
 */

/**
 * 
 * @param {string[]} arr 
 * @param {string} inputvalue 
 * @param {number} returnLimit 
 * @returns 
 */
function findClosestString(arr, inputvalue, returnLimit = 5) {
    let closestOnes = [];
    let floorDistance = 0.1;
  
    for (let i = 0; i < arr.length; i++) {
      let dist = distance(arr[i], inputvalue);
      if (dist > floorDistance) {
          floorDistance = dist;
          closestOnes.push(arr[i]);
      }
    }
    const startIndex = (closestOnes.length - returnLimit) > -1 ? (closestOnes.length - returnLimit) : 0;
    return closestOnes.slice(startIndex, closestOnes.length);
  }
  
  function distance(val1, val2) {
    let longer, shorter;
  
    if (val1.length > val2.length) {
      longer = val1;
      shorter = val2;
    } else {
      longer = val2;
      shorter = val1;
    }
  
    let longerlth = longer.length;
    let result = ((longerlth - editDistance(longer, shorter)) / parseFloat(longerlth));
  
    return result;
  }
  
  function editDistance(val1, val2) {
    loweredVal1 = val1.toLowerCase();
    loweredVal2 = val2.toLowerCase();
  
    let costs = [];
  
    for(let i = 0; i <= loweredVal1.length; i++) {
      let lastVal = i;
      for(let j = 0; j <= loweredVal2.length; j++) {
          if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newVal = costs[j - 1];
          if (loweredVal1.charAt(i - 1) !== loweredVal2.charAt(j - 1)) {
            newVal = Math.min(Math.min(newVal, lastVal), costs[j]) + 1;
          }
          costs[j - 1] = lastVal;
          lastVal = newVal;
        }
      }
      if (i > 0) { costs[loweredVal2.length] = lastVal }
    }
  
    return costs[loweredVal2.length];
  }
  
module.exports = {findClosestString};