---
title: "Syndicating content to Twitter/X"
date: 2024-06-30
desc: "The process of configuring an Eleventy site to syndicate content to Twitter/X"
tags:
  - Javascript
  - Netlify
  - Eleventy
---

One of the things I miss from my WordPress days is the ability to automatically post links to new content to Twitter/X once the content is published.

You can get equivalent functionality in an Eleventy site but it's more complicated and it takes many steps to accomplish.

This post will document the process and the results.

Before we start working with the code to post to Twitter, we need to set up the Twitter Card entries. This is not strictly related to syndication but it will give a better output when we paste the link on Twitter or Facebook.

Rather than do it manually, we will use the [Metagen](https://github.com/tannerdolby/eleventy-plugin-metagen) Eleventy plugin.

The plugin is not perfect. We still have to do some manual work on posts, meaning that we won't be able to update older posts (at least not easily), but it's worth the effort anyway.

The plugin will pull data from different locations:

* A global metadata file located (`_data/metadata.js`)
* Metadata specific to each post
* Hard-coded values in the Metagen declaration

As with many other plugins, using it takes three steps:

1. Install the plugin using NPM (`npm i eleventy-plugin-metagen`)
2. Set up the plugin in the `eleventy.config.js` configuration file
3. Configure the data for the metagen in the template where you want to place the content. I placed them inside the `head` element of the base template

The Metagen configuration looks like this:

{% raw %}

```text
{%- metagen
	comments=true,
	title=title or metadata.title,
	desc=desc or metadata.desc,
	url=url,
	img="/images/Thumbnail_Trinity_College_Dublin_Ireland.webp",
	img_alt="Trinity College Library, Dublin",
	twitter_card_type=summary,
	twitter_handle=elrond25
-%}
```

{% endraw %}

Once we have the metadata set up, we need to write code to publish the tweet whenever we post new content.

I chose to use [Netlify functions](https://www.youtube.com/watch?v=VHYVipdTE8k) following the ideas from [Syndicating Content to Twitter](https://mxb.dev/blog/syndicating-content-to-twitter-with-netlify-functions/)

The idea is that we'll use

```js
import dotenv from 'dotenv'
import Twitter from 'twitter'
import { decode } from 'html-entities'

dotenv.config()

// URL of items JSON feed
const ITEMS_URL = 'https://publishing-project.rivendellweb.net/feed/feed.json'

// Configure Twitter API Client
const twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// Helper Function to return unknown errors
const handleError = (err) => {
    console.error(err)
    const msg = Array.isArray(err) ? err[0].message : err.message
    return {
        statusCode: 422,
        body: String(msg)
    }
}

// Helper Function to return function status
const status = (code, msg) => {
    console.log(msg)
    return {
        statusCode: code,
        body: msg
    }
}

// Check exisiting items
const processItems = async (items) => {
    if (!items.length) {
        return status(404, 'No items found to process.')
    }

    // assume the last item is not yet syndicated
    const latestItem = items[0]
    if (!latestItem.syndicate) {
			return status(
				400,
				'Latest item has disabled syndication. No action taken.'
			)
    }

    try {
			// check twitter for any tweets containing item URL.
			// if there are none, publish it.
			const q = await twitter.get('search/tweets', { q: latestItem.url })
			if (q.statuses && q.statuses.length === 0) {
					return publishitem(latestItem)
			} else {
				return status(
					400,
					'Latest item was already syndicated. No action taken.'
				)
			}
    } catch (err) {
			return handleError(err)
    }
}

// Prepare the content string for tweet format
const prepareStatusText = (item) => {
	const maxLength = 280 - 3 - 1 - 23 - 20

	// strip html tags and decode entities
	let text = item.content.trim().replace(/<[^>]+>/g, '')
	text = decode(text)

	// truncate item text if its too long for a tweet.
	if (text.length > maxLength) {
		text = text.substring(0, maxLength) + '...'
	}

	// include the item url at the end;
	text += ' ' + item.url

	// if it has a link, let that be the last url
	// so twitter picks it up for the preview
	if (item.link && item.link.length) {
		text += ' ' + item.link
	}

	return text
}

// Push a new item to Twitter
const publishitem = async (item) => {
	try {
		const statusText = prepareStatusText(item)
		const tweet = await twitter.post('statuses/update', {
				status: statusText
		})
		if (tweet) {
			return status(
				200,
				`item ${item.date} successfully posted to Twitter.`
			)
		} else {
			return status(422, 'Error posting to Twitter API.')
		}
	} catch (err) {
		return handleError(err)
	}
}

// Main Lambda Function Handler
exports.handler = async () => {
	// Fetch the list of published items to work on,
	// then process them to check if an action is necessary
	return fetch(ITEMS_URL)
		.then((response) => response.json())
		.then(processItems)
		.catch(handleError)
}
```
