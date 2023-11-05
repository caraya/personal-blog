---
title: "Migrating from WordPress to Eleventy (part 4)"
date: "2023-12-31"
youtube: false
vimeo: false
mermaid: false
mavo: false
draft: true
---

The last two items I want to discuss from the migration to Eleventy are integrations: Cloudinary and Algolia (search)

## Algolia

The WordPress version of the blog uses Algolia as the search provider. There is no reason we can't use the same service with Eleventy.

It proved a lot harder than I expected. At some point I lost my login credentials and that made it imposible to change the projects. It has since been fixed by Algolia support.

However, I found other problems in running and configuring the crawler. I am waiting for support to remove the existing crawler so I can start over.

## Cloudinary

Working with Cloudinary presents an interesting challenge since it's a two-step process:

1. Upload the content to Cloudinary
2. Generate the correct URL for each image

we can follow Raymond Camden's [Integrating Cloudinary into Eleventy](https://www.raymondcamden.com/2022/10/20/integrating-cloudinary-into-eleventy).

```js
const fs = require('fs');

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const IMG_DIR = './public/images';

module.exports = async () => {

	let photos = [];

    const cloudinary_options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

	let files = fs.readdirSync(IMG_DIR);
	console.log(`Processing images, ${files.length} total`);
	for(let i=0; i<files.length; i++) {
		let file = IMG_DIR + '/' + files[i];
		console.log(file);

		// Should try/catch this.
		try{
			// THis is where it fails
			const result = await cloudinary.uploader.upload(file, cloudinary_options)
			console.log(result);
		}
		catch {
			console.error(`there was an error during the upload process` );
		}

		let newPhoto = {
			id: result.public_id,
			web:getWeb(result)
		}

		photos.push(newPhoto);

	};

	return photos;

}

const image_options = {
	transformation: [
		{quality: "auto"},
		{fetch_format: "auto"},
		{width: 500, crop: "scale"},
	]
};

const getWeb = (img) => {
	return cloudinary.image(img.public_id, image_options)};
```

The uploader code


