---
title: "Conference Report: Books in Browsers"
date: "2016-12-26"
---

> Part conference review and part ideas moving forward. This may or may not make as much sense as the review for AEA did. I still think they complement each other.

Where AEA dealt with the how to create content and the tools to use. BIB (Books in Browsers), to me, deals with the content we create and the intersection of the stories we tell and the technologies we use to tell them. I was surprised to see how much of these new channels interact with the web is and what the web can be and become.

It is also interesting to see where the technology has changed the way we tell stories and how the telling of stories change the technology(ies) we use to tell them.

Some of these ideas are radical like the [3D Aditivist Manifesto](http://additivism.org/manifesto)

<iframe src="https://player.vimeo.com/video/122642166" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

Others ideas are less radical and make different, or more creative, uses of existing and emerging technologies.

### Changing narratives

The first thing that caught my attention is how easy we can change the way we write our content and and the stories we tell by changing our traditional creation mechanisms and tools.

Writing content as we'd write a play or screen play would make it easier to work with structures other than plain 2D content. We have new technologies that make storytelling more interesting and more engaging than what we get with traditional media.

Some of the questions that BIB brought up:

**How do we change the stories we tell**? Does the medium we tell our stories in changes what stories we tell? is the same to tell a stories in 360 video than it is to use the environment where the stories is told become a part of the story?

### Video

> 360-degree videos, also known as immersive videos\[[1](http://qz.com/562697/with-googles-new-immersive-videos-you-can-feel-what-its-like-to-be-a-ballet-dancer/)\] or spherical videos,\[[2](https://techcrunch.com/2015/03/25/facebook-to-support-spherical-video-in-news-feed-and-oculus/)\] are video recordings where a view in every direction is recorded at the same time, shot using an omnidirectional camera or a collection of cameras. During playback the viewer has control of the viewing direction like a panorama, a form of virtual reality. From Wikipedia's entry for [360-degree video](https://www.wikiwand.com/en/360-degree_video)

This is essentially different than just shooting video. The camera will register every area around it and will affect how you tell the story.

![360-video camera rig for GoPro Hero 4](https://static.bhphoto.com/images/images500x500/freedom360_f360e4_f360_explorer_mount_for_1464040216000_1212820.jpg)

We still have to stitch the images together to create the full 360 degree effect but it is now possible to do so without using insanely expensive equipment

The best way I've seen a rig like this is when used to document a scene or event where the facts may be in dispute. With a 360 degree view of the surroundings and all the available information for the user to decide.

### Augmented Reality

Another turning of an idea on its head is what makes a virtual reality beyond experiments like [Google Glass](https://developers.google.com/glass/) or the full head mounted displays like the [Oculus Rift](https://www3.oculus.com/en-us/rift/) or [Playstation VR](https://www.playstation.com/en-us/explore/playstation-vr/)?

We should be able to marry augmented reality (Glass or Microsoft Hololens can provide additional information about a location. What if we could mix the augmented reality with a story that happens in the "real world" and that depends on interactions both virtual and real?

Once again we have to be mindful of the types of stories we tell in this medium. We also need to make sure that people in charge know what we're doing... last thing we want to do is have some of our performers arrested.

### Fully immersive VR

I don't define VR as an exclusive 3D virtual construct. I've interacted in Text-based virtual realities that were far more engaging than any 3D environment and did a much better job of keeping me engaged with content and other performers than the new crop of graphical 3D environments.

LARP, [Nordic LARP](https://nordiclarp.org/what-is-nordic-larp/) and its southern equivalents like [The Society for Creative Anachronism](http://www.sca.org/) are the best immersive experiences I'm aware of. The SCA does a great job of recreating middle ages and the life in that time period.

How much of them can we take to an online environment?

Granted, Sword Art Online is still a long ways off (if ever) there has to be some ways to keep the online portion of our "Game Identities" alive while in the real world.

Perhaps the answer is not to recreate the real on the virtual but use elements of the virtual to create a whole immersive experience in the real world.

Another example from BIB that caught my attention was an interactive art piece where people were taken to a basement set up as an office cube with a computer and many traditional office tools in it. The

### Performance

I remember when working through my undergraduate when I first heard of Readers' Theater where people (actors and non actors) would perform a piece only as a reading exercise without any of the movement or physicality I normally associated with theater. Reading itself became the performance.

> Readers Theatre or Reader's Theater is a style of theater in which the actors do not memorize their lines. Actors use only vocal expression to help the audience understand the story rather than visual storytelling such as sets, costumes, intricate blocking, and movement. This style of performance of literature was initially lauded because it emphasized hearing a written text as a new way to understand literature. From Wikipedia's entry for [Reader's Theater](https://www.wikiwand.com/en/Reader's_theatre)

Now let's flip this idea of only using voice and inflexion to convey the meaning of a piece and now use the physical location of a play to add to the meaning we want to convey.

The first time I saw potential on the web as a performance technology was the [Unnumbered Sparks](http://www.unnumberedsparks.com/) installation from [Janet Echelman](http://www.echelman.com/) and [Aaron Koblin](http://www.aaronkoblin.com/) created as part of TED's 30th anniversary.

<iframe width="560" height="315" src="https://www.youtube.com/embed/npjTmG-TBHQ?rel=0" frameborder="0" allowfullscreen></iframe>

Granted, they used a lot of Google expertise and technologies but none of the technologies are propietary or hard to learn. WebGL is in most browsers now and version 2.0 (which brings capabilities of OpenGL ES 3.0 to the browser) is in development for adoption in the not too distant future.

It all depends on how much effort we want to put in the project.

### Idea

One interesting idea for using place as a storytelling device is to use beacons to tell stories in a given place that change throughout the day. Using [physical web](https://google.github.io/physical-web/) beacons we can push a single URL each to browsers that support Web Bluetooth (Chrome in Android and iOS) which can open the URL and interact with the content of the page without any further action from the beacon device.

The content of the pages can be anything supported by the browser directly or via plugins.

## Leverage the web platform for increased interaction

Use the affordances of the web platform to make experiences (author < --> reader and reader < --> reader) better. We no longer need dedicated applications to share our content. We already have an awesome reading device on our computers... it's called a browser

A good example of how to do this is [Membrane](http://nytlabs.com/blog/2015/11/05/membrane/), a project from the New York Times Lab, sadly now dormant and nowhere to be found other than the reference article. The idea is to provide an interactive annotation system.

One iteration of the NYT experiment looks like the image below.

![](http://nytlabs.com/blog/images/membrane4.gif)

It works as a prompt - response system for multiuser communication between readers and the author. The readers can create any number of prompts on the piece which the author can then choose to answer creating a feedback loop that the community can participate in.

Some of the ideas in the NYT piece about Membrane:

- **Different types of responses**. A reporter could respond to prompts with text, or they could respond to prompts with images, videos, audio, etc
- **Different types of subject matter**. In addition to news articles about people or events, Membrane could be used for ongoing written pieces that are soliciting ideas/next steps from the community
- **Different lengths of time**. The community that forms around an author who uses Membrane very consistently would likely look different from the more ephemeral communities that form around a time-constrained event (elections, Oscars, etc.).
- **Different types of questions**. A writer could use the default “who, what, when, where, why” list of questions, or customize their list with subject-specific questions (Membrane tailored for an article on cooking, auto repair, etc.).
- **Different numbers and types of authors**. Membrane supports multiple authors, so a piece could be written by just one author or several authors, and support community members who become authors.
- **Different forms of interaction**. Membrane might be used to get additional detail or source material on a finished piece; to get updates on an ongoing event or situation; to ask for more justification on an opinion piece; to nudge the evolution of an ongoing piece or project, and more.

All these options invite deeper and ongoing interactions between reders and authors and readers with content. What more can we do with technology like this or similar bits of technologies?

### Hit them often in as many different places

I've always been intrigued by the concept of transmedia storytelling. How does it work and what events and technologies are more appropriate for them

> Transmedia storytelling (also known as transmedia narrative or multiplatform storytelling, cross-media seriality\[1\]) is the technique of telling a single story or story experience across multiple platforms and formats using current digital technologies, not to be confused with traditional cross-platform media franchises, sequels, or adaptations. From Wikpedia entry for [Transmedia Storytelling](https://www.wikiwand.com/en/Transmedia_storytelling)

One of the best examples I've seen of transmedia storytelling is Defiance it was both a [TV Show](https://www.wikiwand.com/en/Defiance_(TV_series)) and an open ended [Computer Game](http://www.trionworlds.com/defiance/en/). The storie from the TV show affected the computer game and vice versa.

The latest example I've seen of cross media story telling is Westworld, a TV show remake of the [1974 movie](http://www.michaelcrichton.com/westworld/) written by Michael Chrichton. The show's website portrays the Westworld Resort of the show as a real attraction that people can interact with and be a part of the "Westworld Experience". I haven't seen enough of the show to tell how they interact together but I have a hunch that it's not anywhere as deep as the Defiance experience.

#### Idea: Daemon by Daniel Suarez

In Daemon and FreedomTM Daniel Suarez presents a frigthening world. Not because of what it does but because it may very well be happening now, right in front of our eyes and we wouldn’t even notice. If you’ve read the novels (won’t spoil them for you) you’ll see that the Daemon uses agents and interacts with the actual world even from virtual reality.

Now imagine if the book (the main storytelling vehicle) would ask questions of the reader instead of the characters. It would turn into an adult ‘choose your own adventure’ and, depending on the gear available to the player (or required by the book) it would use different story telling devices like augmented reality (if the user owned a hololens) or even full 3D environment (if the reading device supported WebGL). The idea is to use the different dimensions of the world to draw the reader into the story of the daemon and the fight for the Darknet.

We may also think about incorporating elements of the real world into the story. What if Darknet operatives could meet in real world locations invited either by Beacons or by other types of augmented realities?

## Reminder

<iframe src="https://embed.ted.com/talks/chris_milk_how_virtual_reality_can_create_the_ultimate_empathy_machine" width="560" height="315" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

<iframe src="https://player.vimeo.com/video/19670849?color=f00068" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

It's an interesting challenge and one that leverages both current technology, future technology and the creative process.

**_Bring it on_**

- Links and Resources
    
    - [Transmedia Storytelling 101](http://henryjenkins.org/2007/03/transmedia_storytelling_101.html) -- Henry Jenkins
    - [Transmedia 202: Further Reflections](http://henryjenkins.org/2011/08/defining_transmedia_further_re.html) \-- Henry Jenkins
    - [Henry Jenkins explains his vision of transmedia and audience engagement](http://www.transmedialab.org/en/events/henry-jenkins-explains-his-vision-of-transmedia-and-audience-engagement/)
    - [The 7 Literacies of Transmedia Storytelling](https://designerlibrarian.wordpress.com/2013/11/21/the-7-literacies-of-transmedia-storytelling/)
    - [A look at transmedia storytelling](http://nerdist.com/a-look-at-transmedia-storytelling/) - Nerdist
    - [5-tips-for-transmedia-storytelling030](http://mediashift.org/2013/01/5-tips-for-transmedia-storytelling030/)
    - [A Creator's Guide to Transmedia Storytelling](http://www.deusexmachinatio.com/book/)
    - \[The 15 Things I've Learned about Transmedia Storytelling\](The 15 Things I've Learned about Transmedia Storytelling)
    - [Transmedia Storytelling and Entertainment: A New Syllabus](http://henryjenkins.org/2013/08/transmedia-storytelling-and-entertainment-a-new-syllabus.html)
    - [Creating Transmedia: An Interview with Andrea Phillips (Part One)](http://henryjenkins.org/2012/11/creating-transmedia-an-interview-with-andrea-phillips-part-one.html)
    - [4 Inspiring Examples of Digital Storytelling](http://mashable.com/2012/01/31/digital-storytelling/#kkhPFTtaukqU)
    - [Transmedia Storytelling](http://www.technologyreview.com/news/401760/transmedia-storytelling/)
    - [5 Lessons For Storytellers From The Transmedia World](http://www.fastcocreate.com/1680902/5-lessons-for-storytellers-from-the-transmedia-world)
    - [Storyworlds](http://convergenceishere.weebly.com/storyworlds.html)
    - [Here Are the 5 Things That Make a Good Transmedia Project](http://www.indiewire.com/article/here-are-the-5-things-that-make-a-good-transmedia-project)
    - [Videos from Transforming Hollywood 6: Alternative Realities, Worldbuilding, and Immersive Entertainment](http://henryjenkins.org/2015/05/videos-from-transforming-hollywood-6-alternative-realities-worldbuilding-and-immersive-entertainment.html)
