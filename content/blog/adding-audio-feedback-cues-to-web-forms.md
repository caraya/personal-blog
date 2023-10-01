---
title: "Adding Audio Feedback Cues To Web Forms"
date: "2023-05-17"
---

In [Speech Synthesis API: computer talks](https://publishing-project.rivendellweb.net/speech-synthesis-api-computer-talks/) I looked at how to use the Text To Speech portion of the [Web Speech API](https://wicg.github.io/speech-api/) to enhance error messages in web forms.

Since I wrote that the speech portion of the API is now supported in all major browsers so we can take a deeper look at two specific cases where the speech portion of the Web Speech API may be useful.

## Audio feedback for forms

The first example revisits the original idea of providing audio cues for form validation errors in addition to visual cues.

The example uses the following HTML:

```html
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

We feature detect speech synthesis by checking if the `speechSynthesis` exists in the `window` object.

If it does then we build functions for each message that we want to give the user.

The functions follow the same basic pattern:

1. We create a new `SpeechSynthesisUtterance` object
2. We add the text of the message in the `text` attribute
3. We add a `lang` attribute to represent the language using ISO 639-1 codes
4. We "speak" the message using the speech synthesis's object `speak` method

We will use these functions in the events that will handle the actual validation.

```js
if ("speechSynthesis" in window) {
  function speakUsernameEmptyError() {
    let msg1 = new SpeechSynthesisUtterance();

    msg1.text = "The Username field can not be empty";
    msg1.lang = "en-US";

    speechSynthesis.speak(msg1);
  }

  function speakPasswordEmptyError() {
    let msg2 = new SpeechSynthesisUtterance();
    msg2.text = "The Password field can not be empty";
    msg2.lang = "en-US";

    speechSynthesis.speak(msg2);
  }

  function speakPasswordTooShortError() {
    let msg3 = new SpeechSynthesisUtterance();
    msg3.text = "The Password field must be at least 6 characters long";
    msg3.lang = "en-US";

    speechSynthesis.speak(msg3);
  }
```

We capture the input field into variables to simplify the event listeners.

```js
  let username = document.getElementById("username");
  let password = document.getElementById("password");
```

In the event listeners, we perform basic validation and, if there's an error, we provide a visual cue by changing the border to red and speaking out the error by calling the appropriate function.

The password event listener tests for more than one type of error.

```js
  username.addEventListener("blur", function () {
    if (username.value.length <= 0) {
      username.style.border = "1px solid red";
      speakUsernameEmptyError();
    } else {
      username.style.border = "1px solid black";
    }
  });

  password.addEventListener("blur", function () {
    if (password.value.length <= 0) {
      password.style.border = "1px solid red";
      speakPasswordEmptyError();
    }

    if (password.value.length < 6) {
      password.style.border = "1px solid red";
      speakPasswordTooShortError();
    } else {
      password.style.border = "1px solid black";
    }
  });
}
```

This is not production code by all means. The validation could stand a lot of improvement. We will cover a more robust validation system in a future post.

## Using audio to help with navigation

Just like we do with forms it should be possible to enhance navigation and other areas of a site or application with aural cues.

One of the difficulties that I see with this approach is that we may get accessibility issues with both a screen reader and the speech API reading at the same time.

I asked in Github and was told there was no conflict but I'll need to do more tests to make sure.
