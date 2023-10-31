module.exports = {
	permalink: function (data) {
		const slug = data.slug ?? this.slugify(data.title);
		return `/${slug}/index.html`;
	},
		tags: [
		"posts"
	],
	// What layout to use
	"layout": "layouts/post.njk",
	// draft status for the post. May use it later
	draft: false,
	// all conditional elements are set to false by default
	"youtube": false,
	"vimeo": false,
	"mermaid": false,
	"mavo": false,
};
