// require('dotenv').config();
// const fs = require('node:fs');

// const cloudinary = require('cloudinary').v2;
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true
// });

// const IMG_DIR = './public/images';

// module.exports = async () => {

// 	let photos = [];

// 	const web_options = { transformation: [
// 		{width: "500",crop: "scale"},
// 		{quality: "auto", fetch_format: "auto"},
// 		// { dpr: "auto", responsive: true, width: "auto", crop: "scale", angle: 20 },
//   ]}

// 	const getWeb = (img) => {
// 		return cloudinary.image(img.public_id, web_options);
// 	};

// 	const cloudinary_options = {
// 		use_filename: true,
// 		unique_filename: false,
// 		overwrite: false,
// 	};

// 	let files = fs.readdirSync(IMG_DIR);
// 	console.log(`Processing images, ${files.length} total`);
// 	for(let i=0; i<files.length; i++) {
// 		let file = IMG_DIR + '/' + files[i];

// 		// Should try/catch this.
// 		const result = await cloudinary.uploader.upload(file, cloudinary_options);
// 		//console.log(result);

// 		let newPhoto = {
// 			id: result.public_id,
// 			web:getWeb(result)
// 		}
// 		console.log(`added ${newPhoto.id} to photos array`)

// 		photos.push(newPhoto);
// 	};

// 	// We should be able to write the photo array
// 	fs.writeFile('photos.json', JSON.stringify(photos), (err) => {
// 		if (err) throw err;
// 		console.log("wrote photos.json to disk");
// 	})
// 	// return the photos array
// 	return photos;
// }

