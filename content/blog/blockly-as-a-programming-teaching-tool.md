---
title: "Blockly as a programming teaching tool"
date: "2017-07-24"
---

One of the first things that brought me to programming was Logo back in the mid 1980's. It wasnt the structure of the programs that you could type stuff that would make things happen on the screen. To me the magic was that you could share and that typing the same things would always produce the same results so you could iterate and do even crazier things with your designs.

If running the following commands:

```
repeat 4
forward 90
```

would create a square what would happen if we started moving the turtle around without drawing anything and then run our square command? How would we write circles? Triangles? Other geometrical shapes?

This has always motivated my interest in computers, the web, and odball projects that will make something interesting but not necessarily useful. It's curiosity, the desire to know how to do something even if there are better ways to do it.

Move forward about 30 years and I found [Scratch](https://scratch.mit.edu/) and I found myself thinking back to Logo and my experiences with old computers at school.

But it looks different and it uses a different paradigm to create the scripts that will make things happen. The first figure shows an animated example created with Scratch and the second shows a more technically complex example using the same language.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/scatch-screen-shot-2013.png)

Scratch 2.0 screenshot

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/mihoxw.png)

More complex example of Scratch

Wouldn't it be cool if we could leverage these technologies to serve children and other people coming into code with a less threatening introduction to programming? Coding is not hard, figuring out the rules behind code is more complicated, at least it was to me.

That's where I think Scratch and similar tools can be useful. Google released a set of coding tutorials using Wonder Woman and [Blockly](https://developers.google.com/blockly/), a Scratch-like application to make teaching computer science concepts easier for children.

The figure below shows an example of what one of the [Wonder Woman based tutorials](https://www.madewithcode.com/projects/wonderwoman) look like: you assemble the tasks for Wonder woman using blocks and then play the actions represented by the blocks we've assembled together.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/wonder-woman-coding-tutorial.jpg)

[Wonder Woman Coding Tutorial](https://www.madewithcode.com/projects/wonderwoman)

How can we leverage these tools for a larger audience? How can we make a programming environment that gives us both the advantage of Blockly/Scratch and allows us to copy and paste the resulting code in one of many programming languages.

Blockly has several advantages: it allows you to see the results of your block actions in the target language of your choice. The currently supported languages are:

- Javascript
- Dart
- PHP
- Lua
- Python

In the configuration we can create groups of blocks to show users.

We can configure Blockly to show only a few block or the entire set.

We can also create custom blocks that better fit the language we want to teach or the session's objectives.

It can be configured to run on Google's App Engine. This will create a community where scripts will be automatically saved and shared with the community.

Let's build a Blockly app.

## Building Basics

Download the code or clone the Git repository from:

```
https://github.com/google/blockly
```

If you downloaded a compressed version of the files expand them and get them ready. We'll come back to them to build the directory structure for o ur application.

Blockly is built with Javascript, Node/NPM and Google's Closure Compiler. I will not cover how to build the app... You can rebuild the scripts on your own if interested.

We'll start with the most basic Blockly app. It is a simple HTML page where we insert a series of elements to make Blockly work.

The first part is to add Blockly an associated scripts for the page:

- Blockly itself
- A basic set of blocks
- The Javascript syntax file
- English translation of Blockly's messages

```markup
<script src="js/blockly_compressed.js"></script>
<script src="js/blocks_compressed.js"></script>
<script src="js/javascript_compressed.js"></script>
<script src="msg/js/en.js"></script>
```

We then set up two empty elements: A div that will hold the blocks and the work area, and a text are that will hold the Javascript version of the block code.

```markup
<div id="blocklyDiv"
      style="height: 600px; width: 800px;"></div>
<textarea id="textarea"
          style="width: 800px; height: 300px"></textarea>
```

The next postion is an `xml` element that will hold the block elements that we want to use in our application.

```markup
<xml id="toolbox"
      style="display: none">
  <block type="controls_if"></block>
  <block type="controls_repeat_ext"></block>
  <block type="logic_compare"></block>
  <block type="math_number"></block>
  <block type="math_arithmetic"></block>
  <block type="text"></block>
  <block type="text_print"></block>
</xml>
```

The final portion is the script that will make everything work. This is also broken in three sections.

The first part injects Blockly with the toolbox we defined earlier.

The next function defines how Blockly will update the text area with the result of coverting the blocks into Javascript.

Finally we add a change listener and tell it to run `myUpdateFunction` every time it's triggered.

```markup
<script>
var workspace = Blockly.inject('blocklyDiv', 
{toolbox: document.getElementById('toolbox')}); 

function myUpdateFunction(event) { 
  var code = Blockly.JavaScript.workspaceToCode(workspace); 
  document.getElementById('textarea').value = code;
}
workspace.addChangeListener(myUpdateFunction);
</script>
```

That's it. We have a Blockly application that will convert the blocks into Javascript. However it won't save the code and provides no way of sharing it. We'll tackle that challenge next.

## Adding a backend server

Blockly comes pre-configured to work with [Google App Engine](https://cloud.google.com/appengine/) (it's a Google product, after all). For this section I will assume that you have some experience in configuring and installing applications in App Engine; if not I would recommend you find a [good tutorial](https://cloud.google.com/appengine/docs/standard/python/quickstart) and go through it before continuing.

1. Download and install the [Python SDK](https://cloud.google.com/appengine/downloads)
2. Log into [Google App Engine](https://appengine.google.com/) and create an application.
3. Edit `appengine/app.yaml` and change the application ID from blockly-demo to the application name you created in the previous step.
4. Copy (or soft-link) the following files and directories into appengine/static/:
    
    - demos/
    - msg/
    - media/
    - \*\_compressed.js
5. Run the Google App Engine Launcher from the GUI, add your appengine directory as an existing application, and press the "Deploy" button. If you prefer to use the command line, run: `appcfg.py --oauth2 update appengine/`

**Optional**: If you'd like to use `blockly_uncompressed.js` on the server, also copy that file into `appengine/static/`, copy core into appengine/static/, and copy closure-library/ into the parent directory, appengine/.

**Optional**: If you'd like to run the Blockly Playground, you'll have to copy the blocks, generators, and tests directories, as well as the files in the prior optional step.

Note that the Google App Engine Launcher has been deprecated and a replacement has not been implemented or made official. That said I could get away with using an older version of the App Engine Launcher and deploy the application.

You can find it at [https://blockly-demo-171420.appspot.com/](https://blockly-demo-171420.appspot.com/)

The demos will show you the capabilities of Blockly beyond what we've discussed so far. Now that we have the tools we can talk a little bit about philosophy.

## Why use Blockly?

When we start looking at Blockly one of the first things to consider is who is our target audience. I'll apply an ADDIE model to suggest ideas about how to use Blockly in an educational environment.

**Analysis**:

We're building an application that will make it easier to learn programming.

These Blocky applications can be targeted towards younger users who are learning to program and interact with code for the first time and also for older users who have not had formal programming experiences.

**Design**:

Depending on how we want to structure the learning experiences we can either create individual Blockly pages like the Made with Code [Wonder Woman's Examples](https://www.madewithcode.com/projects/wonderwoman) where you limit the number of blocks you can use and also the type of blocks a given page has access to.

For older users or those children who have mastered the more limited concepts we can also provide a larger set of blocks to experiment with.

Finally, if we're working with frameworks we can generate custom blocks that will do specific tasks. For example, if we're using Blockly to teach web components concepts we can create blocks that will translate to class-based custom elements.

**Development**:

Before we modify any of the blocks and create pages we need to know what the breakdown for the pages is: what blocks are they using and what is our objective for that particular page.

Once we do we can take some of pages on the demo site and modify them to match our goals. We can also theme the pages to a common look and feel.

**Implementation**:

Implementing the pages is easy. We can start from scratch or we can clone an existing demo page that has the features we need and modify it to suit.

At the server level we must make sure to change the version of the application in the `app.yaml` configuration file. This will allow us to deploy multiple versions of the blocks and pages to App Engine without loosing the ability to rollback if there is a problem.

**Evaluation**:

I think evaluation of Blockly projects is mostly outcomes based. Did they participant's learn? Did they enjoy themselves in the process? Can they translate the content they learned into other areas and domains?

## Links and References

- Papers and essays
    
    - [This Computer Language Is Feeding Hacker Values into Young Minds](https://backchannel.com/the-kids-computer-language-that-became-a-mind-bomb-for-the-hacker-ethic-a0b7e42c229d)
    - [Mitchel Resnick: Designing for Wide Walls](https://design.blog/2016/08/25/mitchel-resnick-designing-for-wide-walls/)
    - [A Different Approach to Coding](https://brightreads.com/a-different-approach-to-coding-d679b06d83a)
    - [Learn to Code, Code to Learn](https://www.edsurge.com/news/2013-05-08-learn-to-code-code-to-learn)
- Authoring environments
    
    - Blockly
    - [Developer Documentation](https://developers.google.com/blockly/)
    - [Github Code Repository](https://github.com/google/blockly)
    - Scratch
    - [Website](https://scratch.mit.edu/)
    - [Developer Documentation](https://scratch.mit.edu/developers)
    - Other Alternatives
    - Pencil Code
        
        - [Website](http://pencilcode.net/)
        - [Droplet Editor](https://github.com/droplet-editor/droplet)
        - [Pencil Code Dev](http://dev.pencilcode.net/)
    - Snap
        
        - [Main Website](http://snap.berkeley.edu/)
        - [Github Repo](https://github.com/jmoenig/Snap--Build-Your-Own-Blocks)
