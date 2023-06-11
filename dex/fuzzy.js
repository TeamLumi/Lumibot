const Fuse = require('fuse.js');

function findClosestString(arr, inputvalue, returnLimit = 5) {
  const options = {
    keys: ['name'],
    includeScore: true,
    threshold: 0.3, // Adjust this threshold value to control the matching sensitivity. 0.3 seems to be a reasonable default.
  };

  const fuse = new Fuse(arr, options);
  const results = fuse.search(inputvalue);

  const closestOnes = [];
  for (let i = 0; i < Math.min(returnLimit, results.length); i++) {
    closestOnes.push(results[i].item);
  }

  return closestOnes;
}

module.exports = { findClosestString };
