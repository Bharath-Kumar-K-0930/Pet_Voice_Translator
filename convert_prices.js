const fs = require('fs');

// Read the productSeed.js file
const data = fs.readFileSync('server/utils/productSeed.js', 'utf8');

// Extract the array part
const start = data.indexOf('export const productSeed = [');
const end = data.lastIndexOf('];') + 2;
const arrayString = data.substring(start, end);

// Parse the array
let products = eval(arrayString.replace('export const productSeed = ', ''));

// Convert prices from USD to INR (1 USD = 83 INR)
products = products.map(product => ({
  ...product,
  price: Math.round(product.price * 83) // Round to nearest rupee
}));

// Generate new content
const newContent = `export const productSeed = ${JSON.stringify(products, null, 2)};`;

// Write back to file
fs.writeFileSync('server/utils/productSeed.js', newContent);

console.log('Prices converted from USD to INR');
