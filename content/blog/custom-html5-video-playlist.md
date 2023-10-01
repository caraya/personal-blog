---
title: "Custom HTML5 video playlist"
date: "2017-04-17"
---

Another idea is how to create playlists like those on Youtube but without having to code the entire interface from scratch. Dudley Storey, again, [proposed a solution](http://thenewcode.com/792/Create-A-Simple-HTML5-Video-Playlist) using CSS `display: table` and a little Javascript magic.

I've taken the layout from Storey's article as is (I'm still learning about `display: table` and related CSS) and enhanced the Javascript with some of my working ideas. The two main constraints:

- It must work without Javascript; The user must be able to view the videos when there Javascript is not available
- It must work without the mouse using only keyboard

THe HTML uses a figure as the container for the playlist. The two children are a `video` element with the traditional sources. We make sure to leave the controls visible so people who choose to work with the standard video controls.

In the `figcaption` element we add links and images for the other videos available in the playlist.

```markup
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Video Playlist</title>
    <link rel="stylesheet" href="styles/styles.css">

</head>
<body>
<figure id="video_player">
    <video controls poster="images/SAO-Ordinal-Scale-Trailer1.jpg" id="video">
        <source src="video/SAO-Ordinal-Scale-Trailer1.mp4" type="video/mp4">
        <source src="video/SAO-Ordinal-Scale-Trailer1.webm" type="video/webm">
    </video>
    <figcaption>
        <a href="video/SAO-Ordinal-Scale-Trailer2.mp4">
          <img src="images/SAO-Ordinal-Scale-Trailer2.jpg" alt="SAO Ordinal Scale Trailer 2"></a>
        <a href="video/SAO-Ordinal-Scale-Trailer3.mp4">
          <img src="images/SAO-Ordinal-Scale-Trailer3.jpg" alt="SAO Ordinal Scale Trailer 3"></a>
        <a href="video/SAO-Ordinal-Scale-Trailer4.mp4">
          <img src="images/SAO-Ordinal-Scale-Trailer4.jpg" alt="SAO Ordinal Scale Trailer 4"></a>
    </figcaption>
</figure>
<script src="scripts/script.js"></script>
</body>
</html>
```

### Javascript

The first portion of the script is a shortcut. Rather than attach the same event to multiple elements manually we define the elements we want to attach the event to, in this case all the `a` elements inside `figcaption` and loop through them attacking the handler function to the `onclick` event for each link.

```javascript
let anchors = document.querySelectorAll('figcaption a');
let links = [...anchors];

for (let i=0; i<links.length; i++) {
    links[i].onclick = handler;
}
```

Next we define the `handler` function that we've attached to the anchors in the page.

For each element we:

1. Prevent the default click. We want this function to handle the click rather than the browser's default link handling mechanism.
2. Capture a reference to the link's `href` attribute
3. Extract the file name by creating a substring of the `href` attribute we generated in the prvious step
4. Create a reference to the video element and remove the poster attribute. We don't want the poster from the previous movie to overlap the new video
5. We create a node list (**not an array**) of the source children elements
6. Assign the `mp4` version of the video to the first child and the `webm` version of the video to the second child source element
7. Load the video
8. Play

```javascript
function handler(e) {
    e.preventDefault(); // 1
    let videotarget = this.getAttribute("href"); // 2
    let filename = videotarget.substr(0, videotarget.lastIndexOf('.')); // 3
    let video = document.getElementById("video"); // 4
    video.removeAttribute("poster"); // 4
    let source = document.querySelectorAll("#video_player video source"); // 5
    source[0].src = filename + ".mp4"; // 6
    source[1].src = filename + ".webm"; // 6
    video.load(); // 7
    video.play(); // 8
}
```

I've copied the keyboard event handler from another project to make sure we meet the keyboard accessibility requirement.

1. If the user presses either the space bar or enter key then toggle playback, if the video is paused then play it and if it's playing then pause it.
2. If the user presses the left key then seek 5 seconds backwards on the video
3. If the user presses the right key then seek 5 seconds forward on the video

For the arrow keys we use a utility function to seek the video.

```javascript
// Event handler for keyboard navigation
window.addEventListener('keydown', (e) => {
    switch (e.which) {
        case 32:  // 1
        case 13:  // 1
            e.preventDefault();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            break;

        case 37:  // 2
            skip(-5);
            break;

        case 39:  // 3
            skip(5);
            break;
    }

});

function skip(value) {
    video.currentTime += value;
}
```

### CSS

The CSS uses `display: table` to layout the content in a way that is backwards compatible. The video (the `#video_player` element )is the main component of our 'table' layout and will take 2/3rd of the space while each of the video thumbnails (`figcaption a` elements) are stacked in the remaining width of the element.

This is similar to using a table but not quite the same: The table element in HTML is a semantic structure. The `table` value for display is an indication of how the content should be displayed and has nothing to do with the structure of the content like the `table` tag does

```css
#video_player {
    display: table;
    line-height: 0;
    font-size: 0;
    background: #fff;
}
#video_player video,
#video_player figcaption {
    display: table-cell;
    vertical-align: top;
}
#video_player figcaption {
    width: 25%;
}
#video_player figcaption a {
    display: block;
    opacity: .5;
    transition: 1s opacity;
}
#video_player figcaption a img,
figure video {
    width: 100%;
    height: auto;
}
#video_player figcaption a:hover {
    opacity: 1;
}
```

### One further refinement

Right now there is no way to navigate between videos and now way to play the first video again after you navigate to the thumbnails. It'll require some additional Javascript like the one in this [post](http://thenewcode.com/909/Create-An-Automatic-HTML5-Video-Playlist) by Dudley Storey.
