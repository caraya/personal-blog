---
title: "Speech Synthesis API: you talk to the computer"
date: "2017-03-22"
---

**Speech Recognition only works in Chrome and Opera. Firefox says it supports it but it doesn't work and returns a very cryptic error message.**

The second part of the Speech Synthesis API is recognition. Where in the prior post we used the Speech Synthesis API to have the browser talk to use when there was a problem on the form; in this post we'll use a \[demo from Mozilla\](demo from Mozilla) to illustrate a potential use of speech recognition to make the browser change the background color of the page based on what the user speaks in to a microphone.

Because we're using the user's microphone the page/application must explicitly ask for permission and it must be granted before any of this code will work. This permission can be revoked at any time.

The HTML is simple. A place holder paragraph to hold any hints we provide the user and another paragraph to hold the output of the processes.

```markup
<h1>Speech color changer</h1>

<p class="hints"></p>
<div>
    <p class="output"><em>...diagnostic messages</em></p>
</div>
```

The first portion of the script creates a [JSGF Grammar](https://www.w3.org/TR/jsgf/) for the elements we want to recognize. JSGF is an old Sun Microsystems [W3C submission](https://www.w3.org/TR/jsgf/) that was used as the basis for the W3C Voice Browser Working Group (closed on October, 2015).

This will create the vocabulary that the rest of the script will recognize.

```javascript
var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 
'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 
'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 
'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid',
'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow',
'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
// You can optionally log the grammar to console to see what it looks like
console.log('grammar');
```

We next setup the speech recognition engine. The three variables: `SpeechRecognition`, `SpeechGrammarList` and `SpeechRecognitionEvent` have two possible values, either an unprefixed version (not supported anywhere) or the webkit prefixed version (supported by Chrome and Opera). It's always a good idea to future proof your code; I suspect that when Firefox finally supports the API it will be unprefixed.

```javascript
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
```

The script then does assignments. First it associates variables with the speech recognition engine we set up above. Next the script configures the engine with the grammar created earlier and the attributes for the recognition engine to work. It also create placeholders for the HTML elements that will hold messages to the user and will actually change the background color.

```javascript
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');
```

For each color that we make available to the user, we use the color as the `background-color` to give the user an additional cue regarding the colors he can choose from.

```javascript
var colorHTML= '';
colors.forEach(function(v, i){
    console.log(v, i);
    colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
```

The script is almost ready to start. It adds a message to the `.hint` container and, when the user clicks anywhere on the page, it begins the recognition process.

```javascript
hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try '+ colorHTML + '.';

document.body.onclick = function() {
    recognition.start();
    console.log('Ready to receive a color command.');
};
```

When the user speaks and the script gets a result the `SpeechRecognitionResultList` object contains `SpeechRecognitionResult` objects. It has a getter so it can be accessed like an array.

The `last` variable holds the `SpeechRecognitionResult` object at the last position.

Each `SpeechRecognitionResult` object contains `SpeechRecognitionAlternative` objects that contain individual results. The `last` element represents the latest result the script obtained and, using the array notation we get the `transcript` for first result (\[0\]) of the latest (`last`) response the client has stored.

The script will allso display the result it received (sometimes it's funny to see what the recognition engine thinks you said), change the background color to the specified color and provide a confidence level percentage, the higher the number the most likely the user will get a correct answer and the color will change.

```javascript
recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var color = event.results[last][0].transcript;

    diagnostic.textContent = 'Result received: ' + color + '.';
    bg.style.backgroundColor = color;
    console.log('Confidence: ' + event.results[0][0].confidence);
};
```

The final part of the script handles additional events. When the script detects the end of speech it stops the recognition. When there is no match it will notify the users in the diagnostic element. Finally, if there is an error, we also report it to the user.

```javascript
recognition.onspeechend = function() {
    recognition.stop();
};

recognition.onnomatch = function(event) {
    diagnostic.textContent = "I didn't recognise that color.";
};

recognition.onerror = function(event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}
```

## Full recognition example

**Speech Recognition only works in Chrome and Opera. Firefox says it supports it but it doesn't work and returns a very criptic error message.**

There is another way to work with speech recognition: dictation. Rather than work through the [example](https://caraya.github.io/speech-demos/continuous-recognition.html) that illustrates how we can use the recognition portion of the API to create a dictation application that you can then copy of email.

## Code demo

All the code for this posts is available on [Github](https://github.com/caraya/speech-demos)
