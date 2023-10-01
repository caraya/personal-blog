---
title: "Custom controls for HTML5 video"
date: "2017-04-12"
---

One of the cool things about HTML5 video is that you can fully customize it to suit your needs and preferences. Dudley Storey has an interesting [demo and tutorial](http://thenewcode.com/479/Easy-Custom-Controls-For-HTML5-Video-With-JavaScript) on how to add custom controls for a video. I will take his idea and take it in a different direction... Rather than attach the controls to the video I'll create a control-panel like interface for a video.

When working in projects like this I create a minimal set of requirements. In this case the requirements are:

- Video still works if Javascript is not available
- Video is captioned and the captions can be toggled on and off
- Video can be played through keyboard commands

Some additional enhancements and ideas are at the end of the post. Now let's dive into code :-)

### HTML

The HTML code is pretty straightforward. The root element for the demo is a section element with a class of `display-wrap`; it's purpose is to serve as the root of our flexbox layout.

The `videoPlayer` class div holds our video element. This is the core of the experiment with `mp3` and `webm` versions of the video and an Eglish version of our `vtt` captions. These are the elements that we'll manipulate with Javascript.

```markup
<section class='display-wrap'>
  <div class='videoPlayer'>
    <video id='video' controls poster='video/hololens.jpg'>

        <source
                src='video/hololens.mp4'
                type='video/mp4'>
        <source
                src='video/hololens.webm'
                type='video/webm'>

        <track kind='captions' src='video/hololens.en.vtt' srclang='en'
               label='English' id='english'>
    </video>
</div>
```

The last portion, the `control-panel` div holds the icons for the player controls. I wasn't able to find an icon for both captions on and off so I left them as text links. This is also a flexbox layout.

```markup
<div class='control-panel'>
    <h2>Video Control Panel</h2>

    <div class='player-icons'>
        <a href='#' id='rewind'><img class='icon' src='images/icons/rewind.svg' alt='back'></a>
        <a href='#' id='play'><img class='icon' id='playIcon' src='images/icons/play-button.svg' alt='play'></a>
        <a href='#' id='myStop'><img class='icon' src='images/icons/stop.svg' alt='stop'></a>
        <a href='#' id='forward'><img class='icon' src='images/icons/fast-forward.svg' alt='forward'></a>
    </div>
    <div class='player-icons'>
        <!--<a href='#' id='reset'-->
        <a href='#' id='showCaptions'>Enable Captions</a>
        <a href='#' id='disableCaptions'>Disable Captions</a>
    </div>
  </div>
</section>
```

## Javascript

The Javascript is very event driven and works by reacting to events that you've triggered. As usual, I'll break the Javascript in sections and describe what each one does or any relevant thing about the code.

The first section holds place holders for all the objects that will afect the video player.

```javascript
// Event Listeners For Play/Pause Button
let video = document.getElementById('video');

let play = document.getElementById('play');
let playIcon = document.getElementById('playIcon');

let myStop = document.getElementById('myStop');

let rewind = document.getElementById('rewind');
let forward = document.getElementById('forward');

let showCaptions = document.getElementById('showCaptions');
let hideCaptions = document.getElementById('hideCaptions');

// Remove native controls
video.removeAttribute('controls');
```

The second part is our keyboard navigation. Using a `keydown` event listener we intercept multiple keys using a switch statement.

If the key code is 32 (space bar) or 13 (enter) then we trigger the play sequence: if the video is not playing (represented by the pause state) then we play the video and changge the icon to the pause icon. if the video is playing then we pause it and change the icon to play.

If the key code is 37 (left arrow) then we seek back 30 second in the video.

If the key code is 39 (right arrow) then we seek forward 30 seconds in the video.

In my original code I was using `keypress` instead of `keydown`. For some reason the code for left and right arrows was not working. Trying to figure out why.

```javascript
// Event handler for keyboard navigation
window.addEventListener('keydown', (e) => {
  switch (e.which) {
    case 32:
    case 13:
      e.preventDefault();
      if (video.paused) {
          video.play();
          playIcon.src = 'images/icons/pause.svg';
      } else {
          video.pause();
          playIcon.src = 'images/icons/play-button.svg';
      }
      break;

    case 37:
      skip(-30);
      break;

    case 39:
      skip(30);
      break;
  }

});
```

What happens when the user click the play button is similar to what happens when they press the space bar or enter key:

- If the video is not playing (represented by the pause state) then we play the video and changge the icon to the pause icon
- If the video is playing then we pause it and change the icon to play

```javascript
// play handler
play.addEventListener('click', (e) => {
  // Prevent Default Click Action
  e.preventDefault();
  if (video.paused) {
      video.play();
      playIcon.src = 'images/icons/pause.svg';
  } else {
      video.pause();
      playIcon.src = 'images/icons/play-button.svg';
  }
});
```

Working with captions proved very difficult. At first I had done something like the commented code below. The first part worked properly but not the second one... so I had to break it into separate items

```javascript
//  captions.addEventListener('click', (e) => {
//
//      e.preventDefault();
//      console.log(video.textTracks[0].mode);
//      if (video.textTracks[0].mode = 'showing') {
//          video.textTracks[0].mode = 'hidden';
//          console.log(video.textTracks[0].mode);
//      } else {
//          video.textTracks[0].mode = 'showing';
//          console.log(video.textTracks[0].mode);
//      }
//
//  })
```

Each of the links uses attributes from the VTT Text Track to show or hide the video where appropriate. I'm still looking at merging these two into a single event listener like I did for play but haven't been able to find an easy way to do it.

```javascript
// Show captions
showCaptions.addEventListener('click', (e) => {
 e.preventDefault();
 video.textTracks[0].mode = 'showing';
});

// Hide captions
disableCaptions.addEventListener('click', (e) => {
  e.preventDefault();
  video.textTracks[0].mode = 'hidden';
});
```

In this demo I've made a very important difference between play/pause and stop. Pause will keep the play head at the current location so clicking the button again will resume play without interruption.

The stop button will stop playback, change the play button icon to play (regardless of its previous status) and reset the playback to the beginning of the video.

```javascript
// Stop and reset
myStop.addEventListener('click', (e) => {
  video.pause();
  playIcon.src = 'images/icons/play-button.svg';
  video.currentTime = 0;
  video.load();
});
```

The seeking functions both forwards and backwards using a small convenience function, `skip` to adjust the timeline forward or backwards by the specifiec ammount.

```javascript
// Back 30
rewind.addEventListener('click', (e) => {
  skip(-30);
});

// Forward 30
forward.addEventListener('click', (e) => {
  skip(30);
});

function skip(value) {
  video.currentTime += value;
}
```

Most of the CSS deals with layout and making the video a responsive one. We first define our outer display as a `flex` container and give some basic styles to look like a separate unit... we also make the control panel take 1 portion of the flex layout.

```css
.display-wrap {
    display: flex;
    flex-flow: row wrap;
}

.control-panel {
    border: 1px solid black;
    height: 20vh;
    flex: 1;
    padding: 1em;
}
```

The `.videoPlayer` classes make the video responsive and size it to be 16:9. This also takes 4 units in the flex layout.

```css
.videoPlayer {
    position: relative;
    padding-bottom: 56.23%;
    /* Use 75% for 4:3 videos */
    height: 0;
    overflow: hidden;
    max-width: 100%;
    background: #000;
    margin: 5px;
    flex: 4;
}

.videoPlayer #video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: transparent;
}
```

The last piece of CSS we use is to lyout the icons using flexbox and size each individual icon appropriate. Initially I used SVG icons but I could not get them to size like I wanted inside a flexbox grid so I reverted back to using PNG. I may revisit this using the icons as background images.

```css
.player-icons {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
}

.icon {
    border: 0;
    flex: 1;
    height: auto;
    width: 32px;
}
```

### Changes, refinements and future ideas

The code in the page works fine for a single video in a page. In future iterations of the project I'd like to do a few things:

**Convert this into a class for better reusability.** One thing I'd like to change is moving the code into a class so I can instantiate one per video in a page. Some of the challenges are learning more about classes and how to instantiate event handlers from inside a class (if it's possible at all).

**Naming conventions for multiple videos.** If using more than one video for the page then I need to come up with a convention for the IDs, ideally onne that would allow me to use string literal templates when triggering the events. This goes together with using classes.

**Using background images instead of just regular icons.** I really want to use SVG for the icons but was unable to use it. As part of a later iteration I want to explore using background images (inserted in the CSS code) instead of regular icons. This will make the code harder to read and may cause accessibility problems but it's worth researching.
