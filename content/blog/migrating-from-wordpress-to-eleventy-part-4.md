---
title: "Migrating from WordPress to Eleventy (part 4)"
date: "2023-11-27"
youtube: false
vimeo: false
mermaid: false
mavo: false
draft: true
---

There are more areas I'm working on as I move from WordPress to Eleventy that, in my opinion, are easier to do with a static site generator.

There is still more to work on as I've officially moved the site, I will continue to post in this series as I finish the other pieces of content.

## Identifying links to the Wayback Machine

There are times when the site I link to has been removed, has moved behind a paywall or has become unreachable.

Most of the time I will just remove the link but there are situations where the content of the site is essential to the content of the post.

In those situations I will go to the Internet Archive's [Wayback Machine](https://web.archive.org/) and paste the URL in the search box.

If I get results, then I can pick a date close to the original publishing date and get an archived copy of the page I originally linked to.

That's great, but the users should be aware that this is an archive link and not a live site.

For all links that contain the string *web.archive* (the URL for the Wayback Machine) we add an icon to indicate that the link is to the archive rather than the original.

```css
a[href*="web.archive"]::after {
	content: "";
  width: 20px;
  height: 20px;
  margin-left: 10px;
  background-image: url("https://res.cloudinary.com/dfh6ihzvj/image/upload/v1699174096/ia-logo.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

## Cloudinary Integration

Working with Cloudinary presents an interesting challenge since it's a two-step process:

1. Upload the content to Cloudinary
2. Generate the correct URL for each image

I've followed Raymond Camden's [Integrating Cloudinary into Eleventy](https://www.raymondcamden.com/2022/10/20/integrating-cloudinary-into-eleventy) example with some modifications.

The idea is that, every time we run the script, it will crawl through the files in `public/images` and upload them to Cloudinary, skipping images that are already in the server.

When the script is done uploading it will write the list of all our photos to a JSON file that we can use later to create an image gallery we can work with later.

The steps are roughly as follows:

1. Load the necessary Node packages
2. Configure Cludinary using the [dotenv](https://www.npmjs.com/package/dotenv) to store the values
3. Store the location of the image directory
4. Initialize the photos array
5. Set up the Cloudinary image configuration. This is what we want Cloudinary to do with the images
6. Creates the image format we want to use for the web
7. Options for uploading the files to Couldinary
8. Use Node's [readdirSync](https://nodejs.org/api/fs.html#fsreaddirsyncpath-options) to get an array of the files in the target directory
9. for each of the files in the target array
10. Upload the photo to cloudinary
11. Create a photo object with data about the photo
12. Push photo object to the array we created in step 3
13. Write the photos array (we created in step 3) to file

{.custom-ordered}

```js
// 1
require('dotenv').config();
const fs = require('node:fs');
const cloudinary = require('cloudinary').v2;

// 2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 3
const IMG_DIR = './public/images';

module.exports = async () => {

	//4
	let photos = [];

	// 5
	const web_options = { transformation: [
		{width: "500",crop: "scale"},
		{quality: "auto", fetch_format: "auto"},
		// { dpr: "auto", responsive: true, width: "auto", crop: "scale", angle: 20 },
  ]}

	// 6
	const getWeb = (img) => {
		return cloudinary.image(img.public_id, web_options);
	};

	// 7
	const cloudinary_options = {
		use_filename: true,
		unique_filename: false,
		overwrite: false,
	};

	// 8
	let files = fs.readdirSync(IMG_DIR);

	console.log(`Processing images, ${files.length} total`);

	// 9
	for(let i=0; i<files.length; i++) {
		let file = IMG_DIR + '/' + files[i];

		// 10
		const result = await cloudinary.uploader.upload(file, cloudinary_options);
		// console.log(result);

		// 11
		let newPhoto = {
			id: result.public_id,
			web:getWeb(result)
		}
		console.log(`added ${newPhoto.id} to photos array`)

		// 12
		photos.push(newPhoto);
	};

	// 13
	fs.writeFile('photos.json', JSON.stringify(photos), (err) => {
		if (err) throw err;
		console.log("wrote photos.json to disk");
	})
	// return the photos array
	return photos;
}
```

This works, but it has its drawbacks.

The script will run every time that Eleventy rebuilds the site, because of the number of images, it takes significantly longer to build the site.

Some part of the process (don't know if it's Eleventy or Cloudinary) is very sensitive about the files in the directory. The process produces an error when there are is a `.DS_Store` hidden files anywhere in the images directory.

I'm researching if it's possible to run `photos.js` when not in production. This would reduce the time (and potential cost) it takes to build the site on Cloudinary.

## Automating post publishing with Cron

[How to Schedule and Edit Cron Jobs with Netlify Build](https://buttercms.com/blog/schedule-edit-cron-jobs-netlify-github/) shows a good way to automate publishing content updates with a Netlify WebHook and Github Actions in the repo where we host the content.


```yaml
name: Trigger Netlify Build
on:
  schedule:
    # “At 1130 on every Monday and Wednesday”
    # https://crontab.guru/#30_11_*_*_1,3
    - cron: '30 11 * * 1,3'
jobs:
  build:
    name: Build Hook
    runs-on: ubuntu-latest
    steps:
      - name: Curl request
        run: curl -X POST -d {} BUILD_HOOK_URL
```

