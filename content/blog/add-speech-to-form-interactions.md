---
title: Add Speech to Form Interactions
date: 2025-05-12
tags:
  - Speech
  - Accessibility
  - Forms
baseline: true
---

A few years ago I wrote a post about how to add speech to form interactions. Inspired by a [blog post](https://blog.pamelafox.org/2024/12/add-browser-speech-inputoutput-to-your.html) by Pamela Fox, I want to revisit this strategy and enhance it with additional techniques and technologies.

## What is the problem?

Additional forms of feedback can help improve usability and accessibility. For example, we can use audio feebdack when a form field is left empty or when fields are too short. This is especially useful for users with disabilities, such as visual impairments, who may not be able to see the error messages.

We can also use speech recognition to dictate text into form fields. This is useful for users who have difficulty typing or for those who prefer to use their voice to input text.

Finally, we can use AI to improve the accuracy of speech recognition and speech synthesis. AI can help us create more natural-sounding voices and improve the accuracy of speech recognition.

This post seeks to answer two questions:

* How can we add audio feeback to form interactions?
* How can we add speech recognition to web pages?

## Audio Feedback with the Speech Synthesis API

<baseline-status featureid="speech-synthesis"></baseline-status>

The example will provide audio cues when a field is left empty after the user has focused on it. The code is extensible; we can add more fields and messages as needed

The first part of the code is to create an aray of the error messages we want to make available to the user. The keys are the types of errors and the values are the messages we want to use.

```javascript
const errorMessages = {
  usernameEmpty: "The Username field cannot be empty",
  passwordEmpty: "The Password field cannot be empty",
  // add more keys/messages here as needed...
};
```

The core of the code is the `speakError` function, which takes a message and a language code as parameters. The function creates a new `SpeechSynthesisUtterance` object with the message and sets the language. Finally, it calls the `speechSynthesis.speak` method to play the audio.

```javascript
function speakError(
  message,
  lang = "en-US"
) {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}
```

`validateNotEmpty` is a function that checks if the value of an input element is empty. If it is, it sets the border color to red and calls `speakError` with the appropriate message. If the value is not empty, it sets the border color to black.

Other errors can be added to the `errorMessages` object, and we can create functions to handle other error types.

```javascript
function validateNotEmpty(element, messageKey) {
  if (element.value.trim().length === 0) {
    element.style.border = "1px solid red";
    speakError(errorMessages[messageKey]);
  } else {
    element.style.border = "1px solid black";
  }
}
```

We create an object that associates the fields with their corresponding error messages. The `id` property is the ID of the input element, and the `messageKey` property is the key in the `errorMessages` object.

We then loop through the fields and add a `blur` event listener to each input element. When the user leaves the field, the `validateNotEmpty` function is called with the element and its corresponding message key.

```javascript
const fields = [{
    id: "username",
    messageKey: "usernameEmpty"
  },
  {
    id: "password",
    messageKey: "passwordEmpty"
  },
];

// Wire up blur listeners once DOM is ready
fields.forEach(({
  id,
  messageKey
}) => {
  const el = (document.getElementById(id));
  if (!el) return;
  el.addEventListener("blur", () => validateNotEmpty(el, messageKey));
});
// Prevent form submission for demo purposes
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", (e) => e.preventDefault());
}
```

You can see the result of the audio enhanced form validation in this CodePen demo:

<iframe height="340" style="width: 100%;" scrolling="no" title="Spoken form feedback" src="https://codepen.io/caraya/embed/LEEppoB?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/LEEppoB">
  Spoken form feedback</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Speaking input with the SpeechRecognition API

<baseline-status featureid="speech-recognition"></baseline-status>

The SpeechRecognition API allows us to convert speech into text. This is useful for dictation and other large text input.

This sample application will listen for speech input and display the recognized text in a `div` element. It will also handle errors and display them in a separate `div`.

In the first section we capture the browser and microphone capabilities into constants we'll use later.

The code checks if the `SpeechRecognition` API is supported by the browser (unprefixed or with the WebKit prefix) and if the `getUserMedia` API is available.

Next, it checks if the browser supports either [navigator.mediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices) or [navigator.mediaDevices.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

If not, it display an error message and throw an error.

```javascript
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) {
  document.getElementById('error').textContent =
    '⚠️ SpeechRecognition not supported by this browser.';
  throw new Error('SpeechRecognition not supported');
}

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  document.getElementById('error').textContent =
    '⚠️ getUserMedia not supported. Serve over HTTPS or localhost.';
  throw new Error('getUserMedia not supported');
}
```

In modern browsers, you could do the same thing with the following code that uses the with optional‑chaining operator:

```javascript
if (!navigator.mediaDevices?.getUserMedia) {}
```

But I've decided to keep the more verbose code for compatibility with older browsers.

The `requestMicAccess` function wraps the `getUserMedia` call with a timeout. If the user does not respond to the microphone permission prompt within the specified timeout, it rejects the promise with an error message.

```javascript
/** wrap getUserMedia with a timeout */
function requestMicAccess(timeoutMillis = 10000) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
			reject(
				new Error(
					'No response to mic‑permission prompt (timeout)'
				)
			);
    }, timeoutMillis);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        clearTimeout(id);
        resolve(stream);
      })
      .catch(err => {
        clearTimeout(id);
        reject(err);
      });
  });
}
```

It then creates a new `SpeechRecognition` object and sets its properties.

* `lang` specifies the language for recognition
* `interimResults` determines whether to return interim results
* `maxAlternatives` specifies the maximum number of alternative transcriptions to return

```javascript
const recognition = new SR();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
```

The next step is to capture references to the DOM elements we'll use to display results and errors.

```javascript
const startBtn = (document.getElementById('start-btn'));
const transcriptDiv = (document.getElementById('transcript'));
const errorDiv = (document.getElementById('error'));
```

The `startRecognition` function is called when the user clicks the "Start" button. It requests microphone access and starts the speech recognition process. If the user denies access, it displays an error message in the `errorDiv`.

```javascript
async function startRecognition() {
  transcriptDiv.textContent = '';
  errorDiv.textContent = '';
  transcriptDiv.textContent = 'Requesting mic access…';

  try {
    const stream = await requestMicAccess();
    transcriptDiv.textContent = 'Listening…';
    recognition.start();
    // stop raw audio tracks so they don’t linger in the background
    stream.getTracks().forEach(t => t.stop());
  } catch (err) {
    transcriptDiv.textContent = '—';
    errorDiv.textContent = `❌ ${err.message}`;
  }
}
```

The `handleResult` function is called when the speech recognition service returns a result.

1. Destructure the `results` list and the `resultIndex` of the current result
2. From the list of SpeechRecognitionResult objects, pick the one at `resultIndex`, then grab its first (best‑confidence) `SpeechRecognitionAlternative` located at index 0
3. Display the recognized transcript text in your UI. It updates the `transcriptDiv` with the recognized text

```javascript
function handleResult(event) {
  const { results, resultIndex } = event;
  const best = results[ resultIndex ][ 0 ];
  transcriptDiv.textContent = best.transcript;
}
```

The last function handles errors. It updates `errorDiv` with the error message returned by the `SpeechRecognition` code.

```javascript
function handleError(event) {
  errorDiv.textContent = `Error: ${event.error}`;
}
```

Finally, we wire event listeners to the different elements we captured earlier.

```javascript
startBtn.addEventListener('click', startRecognition);
recognition.addEventListener('result', handleResult);
recognition.addEventListener('error', handleError);
```

## Conclusion

Adding speech to form interactions can greatly enhance the user experience, especially for users with disabilities. By using the Speech Synthesis API for audio feedback and the Speech Recognition API for dictation, we can create more accessible and user-friendly web applications without third-party tools and external services.

Both [Caniuse](https://caniuse.com) or the [Web platform features explorer](https://web-platform-dx.github.io/web-features-explorer/) show Speech Recognition as unsupported in all browser but testing code in Chrome works as designed, Safari hangs when starting dictation and Firefox does not support the API. This should dictate the use of the Speech Recognition API in your web applications.

## Links and resources

* [Add browser speech input & output to your app](https://blog.pamelafox.org/2024/12/add-browser-speech-inputoutput-to-your.html)
* [SpeechRecognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) &mdash; MDN
* [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) &mdash; MDN
