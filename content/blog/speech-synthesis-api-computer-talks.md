---
title: "Speech Synthesis API: computer talks"
date: "2017-03-20"
---

Accidentally I discovered a new API that makes it easier to interact with your site/app using your voice. The [Speech Synthesis API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) provide both ends of the computer conversation, the recognition to listen and the synthesis to speak.

Right now I'm more interested in the synthesis part and how we can include it as additional feedback on our sites and applications as an additional cue for user interaction.

## Synthesis

The Speech Syntthesis API gives us a way to "speak" strings of text without having to record them. These 'utterances' (in API speak) can be further customized.

At the most basic the utterance is made of the following:

- An instance of `SpeechSynthesisUtterance`
- The text and language we want the voice spoken in
- The instruction to actually speak the command using `speechSynthesis.speak`

```javascript
var msg1 = new SpeechSynthesisUtterance();
msg1.text = "I'm sorry, Dave, I can't do that";
msg1.lang = 'en-US';

speechSynthesis.speak(msg1);
```

The example below changes the content and the language to `es-cl` (Spanish as spoken in Chile). The structure of the code is the same.

```javascript
var msg2 = new SpeechSynthesisUtterance();
msg2.text = "Dicen que el tiempo guarda en las bastillas";
msg2.lang = 'es-cl';

speechSynthesis.speak(msg2);
```

Copy and past each example in your Dev Tools (I use Chrome's and have tested in Chrome and Firefox) and notice how different the default voices are for each message and for each browser you test with.

We can further customize the utterance with additional parameters. The parameters are now

- `msg` contains a new instance of `SpeechSynthesisUtterance`
- `voices` contains an array of all the voices available to the user agent (browser in this case)
- `voice` assigns a voice from the voices array to the instance of utterance we are working with
- `voiceURI` specifies speech synthesis voice and the location of the speech synthesis service that the web application wishes to use
- `rate` indicates how fast the text is spoken. 1 is the default rate supported by the speech synthesis engine or specific voice (which should correspond to a normal speaking rate). 2 is twice as fast, and 0.5 is half as fast
- `pitch` specifies the speaking pitch for the utterance. It ranges between 0 and 2 inclusive, with 0 being the lowest pitch and 2 the highest pitch. 1 corresponds to the default pitch of the speech synthesis engine or specific voice

As before `text` holds the message we want the browser to speak, `lang` holds the language we want the browser to speak in and the `speechSynthesis.speak` command will actually make the browser speak our phrase.

```javascript
var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
// Note: some voices don't support altering params
msg.voice = voices[0]; 
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10
msg.pitch = 2; //0 to 2
msg.text = 'Hello World';
msg.lang = 'en-US';

speechSynthesis.speak(msg);
```

## Putting speech synthesis into action: why and where would we use this?

The most obvious place for me to use speech synthesis is as additional cues and messages to end-users when there is an error and problem. We'll define three different functions to encapsulate the errors messages we want to "talk" to the user about.

For this example we'll use the following HTML code:

```markup
<form id="form">
  <fieldset>
    <legend>Basic User Information</legend>
    <label for="username">Username</label>
    <input id="username" type="text" placeholder="User Name">
    <label for="password">Password</label>
    <input id="password" type="password" placeholder="password">
  </fieldset>
</form>
```

For the sake of the demo I'm only interested in the input fields and not in having a fully functional working form.

I will break the Javascript portion of the demo in two parts. The first part defines the Speech Recognition portion of the script which is very similar to the examples we've already discussed.

```javascript
// Setup the Username Empty Error function
function speakUsernameEmptyError() {
  let msg1 = new SpeechSynthesisUtterance();

  msg1.text = "The Username field can not be empty";
  msg1.lang = 'en-US';

  speechSynthesis.speak(msg1);
}

// Setup the Password Empty Error function
function speakPasswordEmptyError() {
  let msg2 = new SpeechSynthesisUtterance();
  msg2.text = "The Password field can not be empty";
  msg2.lang = 'en-US';

  speechSynthesis.speak(msg2);
}
```

The second part of the script assigns `blur` event listeners to the input elements. Inside each event handler the code checks if the field is empty. If it is the code adds a 1px red border around it and plays the appropriate utterance we crafted earlier. If the field is not empty, either because the user entered a value before moving out of the field or at a later time, we set the border to a 1-pixel solid black color.

```javascript
// Assign variables to hold the elements
let username = document.getElementById('username');
let password = document.getElementById('password');

// Add blur event listener to the username field
username.addEventListener('blur', function() {
  // If the field is empty
  if (username.value.length <= 0) {
    // Put a 1 pixel red border on the input field
    username.style.border = '1px solid red';
    // Speak the error as specified in the
    // speakUsernameEmptyError function
    speakUsernameEmptyError();
  } else {
    username.style.border = '1px solid black';
  }
});

// Add blur event listener to the password field
password.addEventListener('blur', function() {
  // If the field is empty
  if (password.value.length <= 0) {
    // Put a 1 pixel red border on the input field
    password.style.border = '1px solid red';
    // Speak the error as specified in the
    // speakPasswordEmptyError function
    speakPasswordEmptyError();
  } else {
    password.style.border = '1px solid black';
  }
})
```

The functions and event listeners are very basic and could stand some additional work, particularly in the validation area.

## Sources

- [Web apps that talk - Introduction to the Speech Synthesis API](https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API)
- [Talking Web Pages and the Speech Synthesis API](https://www.sitepoint.com/talking-web-pages-and-the-speech-synthesis-api/)
