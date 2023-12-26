import dotenv from 'dotenv'
import Twitter from 'twitter'
import { decode } from 'html-entities'

dotenv.config()

// URL of items JSON feed
const itemS_URL = 'https://publishing-project.rivendellweb.net/feed/feed.json'

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
const processitems = async (items) => {
    if (!items.length) {
        return status(404, 'No items found to process.')
    }

    // assume the last item is not yet syndicated
    const latestitem = items[0]
    if (!latestitem.syndicate) {
        return status(
            400,
            'Latest item has disabled syndication. No action taken.'
        )
    }

    try {
        // check twitter for any tweets containing item URL.
        // if there are none, publish it.
        const q = await twitter.get('search/tweets', { q: latestitem.url })
        if (q.statuses && q.statuses.length === 0) {
            return publishitem(latestitem)
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
	return fetch(itemS_URL)
		.then((response) => response.json())
		.then(processitems)
		.catch(handleError)
}
