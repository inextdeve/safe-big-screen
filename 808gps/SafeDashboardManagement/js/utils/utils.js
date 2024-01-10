/**
 * @param {Object[]} array Array of objects
 * @param {String} key Key of the value you want to reduce
 * @param {String} parser int or float
 */

const countTotal = (array, key, parser = "float") => {
  switch (parser) {
    case "float":
      return array.reduce((prev, cur) => prev + parseFloat(cur[key]), 0);
    case "int":
      return array.reduce((prev, cur) => prev + parseInt(cur[key]), 0);
    default:
      throw new Error("Unknown parser argument value use float or int");
  }
};

/**
 * @param {Number} total Total items
 * @param {Number} n Targeted items
 */

export const countRate = (total, n) => (n * 100) / total;

export { countTotal };
