module.exports = {
	site_name: "The Publishing Project",
	url: "https://publishing-project.rivendellweb.net/",
	language: "en-US",
	author: {
		twitter_handle: "@elrond25",
		name: "carlos araya",
		email: "carlos.araya@gmail.com",
		url: "https://publishing-project.rivendellweb.net"
	},
	// How do I put a function in here?
	// desc: "This is an example description"
	desc: content => {
		return `Testing if this will work in putitng a description in`;
	},
}

/*
	function (content) {


*/
