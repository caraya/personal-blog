---
title: "Web Performance Improvement"
date: "2018-05-14"
---

One thing we as developers tend to forget is that not all web experiences are equal. One of the positive things I've found about AMP is that it reduces the fat of your web content by reducing the number of requests, reducing the amount of CSS that you can use and, mostly, by eliminating Javascript.

That's good but I don't think we need a whole new platform or library to do that. We need to be smarter about how we pack and serve our content. This is not new, some of the tools and tricks we'll discuss in this section are old (in web terms).

## Experiences outside the big city

The first thing we need to do is decide who our audience is. I don't mean just figure out where they are coming from (although that's important) but also figure out what their bandwidth and bandwidth cost is as this may have an effect on how they access the web and whether they will keep your application on their devices or not.

I love the two parallel views of the next billion users of the web, where they come from and what they can and cannot do with their data.

Bruce Lawson presents a more user-centered view of these next billion users and offers insights of emerging markets and things we can do to make their experiences easier.

<iframe width="560" height="315" src="https://www.youtube.com/embed/BHO70H9tvqo?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Tal Oppenheimer presents a more technical view (and Chrome-centered) view of what we can do to improve the experience of your users who are outside the US and other bandwidth rich markets.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wD3rpdiLMyY?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Some of the biggest takeaways for me:

- How much does bandwidth cost for your users?
- What devices are they using to access your app?
- What kind of network are your users on?
- How fast does your application load?

Answering these questions will help not only users in emerging markets but all your users, improve the overall site's performance, and give users the perception that this is a fast page.

## (Real) Performance Test

<iframe width="560" height="315" src="https://www.youtube.com/embed/4bZvq3nodf4?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

If you've read previous posts in this blog you've probably seen Alex's video on why you should test performance on actual devices and why this is important so I'll spare you the gory details and leave some important points to consider.

Even if you simulate a network connection, adjust network latency and modify other aspects of the browser's network connection or use third party tool like Apple's Network Link Conditioner the connection will not be a real mobile connection.

Alex goes into a lot of details and in much more depth than I could but the main take away is: **Test your site in an actual device plugged into your laptop and using chrome://inspect**

## Server-side tools to improve performance

There are a few ways that we can help the user save data and improve their web experiences from the server without making any changes to the content and letting the server make the changes or fetch resources for you.

### Proxy Browsers

Opera Mini is a proxy browser that is very popular in emerging markets where bandwidth is expensive and storage may not be as available as we are used to. It takes your request and forwards it to one of a number of Data Centers where they will make the request, download and process assets before sending the processed request back to your device for rendering.

Chrome in Android and UCBrowser do the same thing using different strategies.

Chrome uses the [PageSpeed Module](https://www.modpagespeed.com/) to process the pages it proxies.

UCBrowser uses a similar technology but I'm not fully familiar with the details of how it works.

The fact that these browsers proxy the page you want to access means that highly interactive applications will not work well in a proxy browser and some technologies will not work at all.

But if you pay a large percentage of your monthly salary for internet access, you have to swap memory cards to make sure that all your content is available to you or you expect pages to load faster than they do, then it makes more sense.

## Configuring the server to preload resources

One of the cool things about resource hints is that we can implement them either on the server or the client. In this section, we'll look at implementing them on the server with an example of preloading assets for a single page using Nginx or Apache.

The idea is as follows:

1. When we hit `demo.html` we add link preload headers to load 3 resources: a stylesheet and two images
2. The server will also set a cookie
3. In subsequent visits, the server will check if the cookie exists and it will only load the link preload headers if it `does not` exist. If it exists it means the resources were already loaded and don't need to be downloaded again

This is what the configuration looks like on Nginx. Note that this is the full configuration.

```nginx
server {
    listen 443 ssl http2 default_server;

    ssl_certificate ssl/certificate.pem;
    ssl_certificate_key ssl/key.pem;

    root /var/www/html;
    http2_push_preload on;

    location = /demo.html {
        add_header Set-Cookie "resloaded=1";
        add_header Link $resources;
    }
}

map $http_cookie $resources {
    "~*resloaded=1" "";
    default "; as=style; rel=preload,
    ; as=image; rel=preload,
    ; as=style; rel=preload";
}
```

And this is how preloading the resources look like in an Apache HTTPD configuration. Unlike Nginx this is a partial configuration that does the following:

1. Checks if the HTTP2 module is installed
2. Checks if a `resloaded` cookie already exists
3. Tests if the file requested is demo.html
4. If it does then add the link preload headers
5. Adds the `resloaded` cookie to check for in subsequent visits

```apacheconf
<IfModule http2_module>
  SetEnvIf Cookie "resloaded=1" resloaded
  <Files "demo.html">
    Header add Link "</style.css>; as=style; rel=preload,
  </image1.jpg>; as=image; rel=preload,
  </image2.jpg>; as=style; rel=preload" env=!resloaded
    Header add Set-Cookie "resloaded=1; Path=/; Secure; HttpOnly" env=!resloaded
  </Files>
</IfModule>
```

We can load different resources based on the page we are working with and we can load resources that are needed by all pages and then additional resources that are specific to a page or set of pages.

The one problem when working with preload (and any other resource hint) on the server is that we don't have an easy way to check if the client has already downloaded the file. That's why we use a session cookie to handle the check, if it exists we'll skip preloading the resources.

## The Save-Data header

In addition to the tricks we've discussed above, we can take advantage of Chrome's data saver feature and have Chrome send the request to a data compression proxy server that will reduce the size of the requested files by 60% according to Google.

As of Chrome 49 when the user has enabled the Data Saver feature in Chrome, Chrome will add a save-data HTTP Header with the value 'on' to each HTTP Request. The HTTP Header will not be present when the feature is turned off. Use this as a signal of intent from the user that they are conscious of the amount of data that they are using and not that their connection is going through the Data Compression Proxy. We can use this header to write conditional code as we'll see in the following sections.

The first step is to add a header on the server side if the user agent (browser) sent the `Save-Data` header. This is what it looks like for Apache.

We also tell downstream proxies that data may change based on whether the `Save-Data` header is present or not.

```apacheconf
# If the browser sent the Save-Data header
SetEnvIfNoCase ^Save-Data$ "on" data_saver="on"
# Unset link
Header unset Link env=data_saver
# Tell downstream servers that the response may change
# Based on the Save-Data header
Vary: Save-Data
```

Now that we've done the work on the server side we can look at client side code. These examples use PHP because that's what I'm most familiar with because of my work on Wordpress.

The first code block does the following:

1. Create a `saveData` variable and set it to false by default
2. Check the existence of a `save_data` header and that its value is on
3. If both of the conditions in the prior step are true then set the `saveData` variable to true

```
// false by default.
$saveData = false;

// Check if the Save-Data header exists
// Check if Save-Data is set to a value of "on".
if  (isset($_SERVER["HTTP_SAVE_DATA"]) &&
    strtolower($_SERVER["HTTP_SAVE_DATA"]) === "on") {
      // Set saveData to true.
      $saveData = true;
}
```

Now that we know whether the `Save_Data` was enabled in the client we can use it to conditionally do things for people who are in data saver mode. For example, we may want to skip preloading resources for people in data saver mode.

We create a string with the elements we need to preload a resource, in this case, a stylesheet.

We check if the `saveData` variable is set to true and, if it is, we append the `nopush` option to the preload string. The `nopush` directive will skip preloading the resource.

We then add a `Link` header with the value of our `preload` variable as configured (with or without the `nopush` directive)

```
// `preload` like usual...
$preload = "; rel=preload; as=style";

if($saveData === true) {
  // ...but don't push anything if `Save-Data` is detected!
  $preload .= "; nopush";
}

header("Link: " . $preload);
```

Another thing we can do is conditionally use responsive images on our pages. In the example below, we will load a single image if the `saveData` variable is true and load a set of responsive images otherwise.

```
if ($saveData === true) {
  // Send a low-resolution version of the image for clients specifying `Save-Data`.
  ?><img src="butterfly-1x.jpg" alt="A butterfly perched on a flower."/>< ?php
}
else {
  // Send the usual assets for everyone else.
  ?><img src="butterfly-1x.jpg" srcset="butterfly-2x.jpg 2x, butterfly-1x.jpg 1x"
  alt="A butterfly perched on a flower."/>< ?php
}
```

We can also choose whether to load images at all or not. Just like we did with responsive image sets, we can choose to load images when not saving data (the `saveData` variable is set to false).

```
<p>This paragraph is essential content.
<p>The image below may be humorous, but it
is not critical to the content.</p>
< ?php
if ($saveData === false) {
  // Only send this image if `Save-Data` has NOT been detected.
  ?><img src="meme.jpg" alt="One does not simply consume data."/>< ?php
}?>
```

The last thing I wanted to highlight is a way to conditionally work with fonts and CSS in general.

The first part is to add a class to the HTML element based on whether `saveData` is true or false; this example will only add the class if we are saving data.

```
<html class="<?php if ($saveData === true): ?>save-data<?php endif; ?>">
```

The second part is the reverse of what I do when working with Fontface observer. I use web fonts by default and have a second set of selectors where the user is saving data and we don't want to force them to load web fonts.

```css
p,
li {
  font-family: 'Fira Sans', 'Arial', sans-serif;
}

.save-data p,
.save-data li {
  font-family: 'Arial', sans-serif;
}
```

If we've decided we want to do the work ourselves to make our content more efficient to download we can opt out of the Data compression proxy. The proxy respects the standard `Cache-Control: no-transform` directive and will not process resources that use that header.
