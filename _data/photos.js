require('dotenv').config(); // Load environment variables from .env file
const fs = require('node:fs'); // Import Node.js file system module
const path = require('path'); // Import Node.js path module for handling file paths
const cloudinary = require('cloudinary').v2; // Import Cloudinary library

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Cloudinary API secret
  secure: true // Use secure URLs (HTTPS)
});

const IMG_DIR = './public/images'; // Directory containing images to process

module.exports = async () => {
  let photos = []; // Array to store uploaded photo information
  const web_options = {
    transformation: [
      { width: 500, crop: "scale" }, // Resize the image to a width of 500px while maintaining aspect ratio
      { quality: "auto", fetch_format: "auto" } // Automatically adjust image quality and format for optimal performance
    ]
  };

  // Function to generate a Cloudinary URL for a specific image
  const getWeb = (img) => {
    return cloudinary.image(img.public_id, web_options); // Return a Cloudinary URL with specified transformations
  };

  const cloudinary_options = {
    use_filename: true, // Retain the original file name in Cloudinary
    unique_filename: false, // Do not append unique characters to the file name
    overwrite: false // Prevent overwriting existing files in Cloudinary
  };

  try {
    // Read all files in the specified image directory
    let files = fs.readdirSync(IMG_DIR); // Synchronous read of files in the directory
    console.log(`Processing images, ${files.length} total`); // Log the number of files being processed

    for (let i = 0; i < files.length; i++) {
      let file = path.join(IMG_DIR, files[i]); // Construct the full path to the image file

      // List of valid image file extensions
      const validExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.avif',
        '.jxl',
      ];

      // Skip files that do not have a valid image extension
      if (!validExtensions.includes(path.extname(file).toLowerCase())) {
        console.warn(`Skipping non-image file: ${file}`); // Log a warning if the file is not an image
        continue; // Move to the next file in the directory
      }

      try {
        // Extract the base file name without extension for use as the public ID
        const publicId = path.parse(files[i]).name;

        // Check if the image already exists in Cloudinary
        const existingResource = await cloudinary.api.resource(publicId).catch(() => null); // Return null if resource not found

        if (existingResource) {
          console.log(`File ${files[i]} already exists in Cloudinary as ${publicId}`); // Log if the image is already uploaded
          continue; // Skip the upload if the image exists
        }

        // Upload the image to Cloudinary with specified options
        const result = await cloudinary.uploader.upload(file, cloudinary_options);

        // Create an object with the uploaded image information
        let newPhoto = {
          id: result.public_id, // Public ID assigned by Cloudinary
          web: getWeb(result) // URL for the image with specified transformations
        };
        console.log(`Added ${newPhoto.id} to photos array`); // Log successful addition of the image

        photos.push(newPhoto); // Add the new photo object to the photos array
      } catch (uploadError) {
        console.error(`Error uploading file ${file}: ${uploadError.message}`); // Log any errors that occur during upload
      }
    }

    // Write the photos array to a JSON file for later reference
    fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2)); // Write JSON data with 2-space indentation
    console.log("Wrote photos.json to disk"); // Log that the file has been successfully written

    return photos; // Return the array of uploaded photos
  } catch (err) {
    console.error("Error processing images:", err); // Log any errors that occur during the process
    throw err; // Rethrow the error to signal failure to the caller
  }
};

// require('dotenv').config();
// const fs = require('node:fs');
// const path = require('path');
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true
// });

// const IMG_DIR = './public/images';

// module.exports = async () => {
//   let photos = [];
//   const web_options = {
//     transformation: [
//       { width: 500, crop: "scale" },
//       { quality: "auto", fetch_format: "auto" }
//     ]
//   };

//   const getWeb = (img) => {
//     return cloudinary.image(img.public_id, web_options);
//   };

//   const cloudinary_options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: false
//   };

//   try {
//     // Read files in the image directory
//     let files = fs.readdirSync(IMG_DIR);
//     console.log(`Processing images, ${files.length} total`);

//     for (let i = 0; i < files.length; i++) {
//       let file = path.join(IMG_DIR, files[i]); // Use `path.join` for cross-platform paths

//       // Check if the file is an image
//       const validExtensions = [
// 				'.jpg',
// 				'.jpeg',
// 				'.png',
// 				'.gif',
// 				'.webp',
// 				'.avif',
// 				'.jxl',
// 			];

// 			if (!validExtensions.includes(path.extname(file).toLowerCase())) {
//         console.warn(`Skipping non-image file: ${file}`);
//         continue;
//       }

//       try {
//         // Upload the image to Cloudinary
//         const result = await cloudinary.uploader.upload(file, cloudinary_options);

//         let newPhoto = {
//           id: result.public_id,
//           web: getWeb(result)
//         };
//         console.log(`Added ${newPhoto.id} to photos array`);

//         photos.push(newPhoto);
//       } catch (uploadError) {
//         console.error(`Error uploading file ${file}: ${uploadError.message}`);
//       }
//     }

//     // Write the photos array to a JSON file
//     fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
//     console.log("Wrote photos.json to disk");

//     return photos;
//   } catch (err) {
//     console.error("Error processing images:", err);
//     throw err;
//   }
// };
