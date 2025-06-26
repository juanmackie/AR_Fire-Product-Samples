const fs = require('fs');

const filesToDelete = [
  'C:/Users/juanm/Documents/GitHub/AR_Fire-Product-Samples/delete_files.js',
  'C:/Users/juanm/Documents/GitHub/AR_Fire-Product-Samples/delete_folders.js'
];

filesToDelete.forEach(file => {
  try {
    fs.unlinkSync(file);
    console.log(`Successfully deleted ${file}`);
  } catch (err) {
    console.error(`Error deleting ${file}: ${err.message}`);
  }
});