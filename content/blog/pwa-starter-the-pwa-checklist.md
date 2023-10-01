---
title: "PWA Starter: The PWA Checklist"
date: "2017-11-20"
---

Text from Google's PWA Checklist used under a [Creative Commons Attribution 3.0](http://creativecommons.org/licenses/by/3.0/) License.

Google's [PWA checklist](https://developers.google.com/web/progressive-web-apps/checklist) presents both a basic and an advanced set of requirements for Progressive Web Applications. As I mentioned earlier not all these requirements are technical, some of them have to deal with the performance of your application/site and with best practices in responsive web design.

I've grouped them in two categories: Basic and Advanced requirements. I will comment on individual entries as needed.

## Basic Requirements

Serving through HTTPS in a requirement for service workers and most, if not all, modern features available in browsers. Whether you run a PWA or not you should consider moving your site to secure hosting.

If cost is an issue there are way to obtain low cost or free SSL certificates. Tools like [letsencrypt.org](https://letsencrypt.org/) make it trivial to obtain ceertificates and install them on your server.

<table><tbody><tr><td colspan="2"><strong>Site is served over HTTPS</strong></td></tr><tr><td style="width: 25%">To Test</td><td>Use Lighthouse to verify Served over HTTPS</td></tr><tr><td style="width: 25%;">To Fix</td><td><a href="https://developers.google.com/web/fundamentals/security/encrypt-in-transit/enable-https">Implement HTTPS</a> and check out <a href="https://letsencrypt.org/">letsencrypt.org</a> to get started</td></tr></tbody></table>

You're already creating responsive content, right? As designers and developers we know that it's not enough to do a desktop-first design and then tweak it for other form factors.

Even if we look at browser popularity we might be surprised at the results. According to Statcounters ([gs.statcounter.com](https://gs.statcounter.com)) the three most popular browsers, worldwide (08/16 to 08/17), are:

| Browser | Market Share |
| --- | --- |
| Chrome | 54.89% |
| Safari | 14.88% |
| UC Browser | 7.43% |
| Firefox | 5.9% |
| Opera | 4% |
| IE | 3.69% |

If you're looking at working in emerging markets, the figures change. According to Statcounter, the Browser market share for mobile devices in Asia breaks like this over the last year (same time period as before).

| Browser | Market Share |
| --- | --- |
| Chrome | 50.46% |
| UC Browser | 22.23% |
| Safari | 10.27% |
| Opera | 6.38% |
| Samsung Internet | 5.97% |
| Android | 3.31% |

So any way you look at it, it pays to be responsive.

<table><tbody><tr><td colspan="2"><strong>Pages are responsive on tablets &amp; mobile devices</strong></td></tr><tr><td style="width: 25%">To Test</td><td>Use Lighthouse to verify Yes to all of Design is mobile-friendly, although manually checking can also be helpful. Check the <a href="https://search.google.com/test/mobile-friendly">Mobile Friendly Test</a></td></tr><tr><td style="width: 25%;">To Fix</td><td>Look at implementing a <a href="https://developers.google.com/web/fundamentals/design-and-ui/responsive/fundamentals/">responsive design</a>, or adaptively serving a viewport-friendly site.</td></tr></tbody></table>

Use the service worker to make sure that at least the entry page to your site works while offline. This may be just a matter to cache the assets for the starting URL when you install the service worker (as we saw earlier).

Runtime caching should take care of ca ching the rest of your PWA.

<table><tbody><tr><td colspan="2"><strong>The start URL (at least) loads while offline</strong></td></tr><tr><td>To Test</td><td>Use <a href="https://developers.google.com/web/tools/lighthouse/">Lighthouse</a> to verify URL responds with a 200 when offline.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Use a Service Worker.</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Metadata provided for Add to Home screen</strong></td></tr><tr><td>To Test</td><td>Use Lighthouse to verify User can be prompted to Add to Home screen is all Yes.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Add a <a href="https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/">Web App Manifest</a> to your project.</td></tr></tbody></table>

Working with a service worker will smooth out network issues and increase the perceived performance of your site or app. That said we still want the content to load fast and we should take all steps to make sure it happens even for older browsers that don't support service workers or the polyfill.

<table><tbody><tr><td colspan="2"><strong>First load fast even on 3G</strong></td></tr><tr><td>To Test</td><td>Use Lighthouse on a Nexus 5 (or similar) to verify time to interactive &lt;10s for first visit on a simulated 3G network.</td></tr><tr><td style="width: 25%;">To Fix</td><td>There are <a href="https://developers.google.com/web/fundamentals/performance/">many ways to improve performance</a>. You can understand your performance better by using <a href="https://developers.google.com/speed/pagespeed/insights/">Pagespeed Insights</a> (aim for score &gt;85) and SpeedIndex on <a href="https://www.webpagetest.org/">WebPageTest</a> (aim for &lt;4000 first view on Mobile 3G Nexus 5 Chrome) A few tips are to focus on loading less script, make sure as much script is loaded asynchronously as possible using &lt;script async&gt; and make sure <a href="https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css">render blocking CSS is marked as such</a>. You can also look into using the <a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL pattern</a> and tools like <a href="https://developers.google.com/speed/pagespeed/module/">PageSpeed Module</a> on the server.</td></tr></tbody></table>

Browsers are getting there in interoperability but they are not there quite yet. Make sure that it works on all your target browsers for mobile and desktop. Fix whatever doesn't work (duh).

<table><tbody><tr><td colspan="2"><strong>Site works cross-browser</strong></td></tr><tr><td>To Test</td><td>Test site in Chrome, Edge, Firefox and Safari</td></tr><tr><td style="width: 25%;">To Fix</td><td>Fix issues that occur when running the app cross-browser</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Page transitions don't feel like they block on the network</strong></td></tr><tr style="background-color: white;"><td colspan="2">Transitions should feel snappy as you tap around, even on a slow network, a key to perceived performance.</td></tr><tr><td>To Test</td><td>Open the app on a simulated very slow network. Every time you tap a link/button in the app the page should respond immediately, either by:<ul><li>Transitioning immediately to the next screen and showing a placeholder loading screen while waiting for content from the network.</li><li>A loading indicator is shown while the app waits for a response from the network</li></ul></td></tr><tr><td style="width: 25%;">To Fix</td><td>If using a single-page-app (client rendered), transition the user to the next page immediately and show a <a href="http://hannahatkin.com/skeleton-screens/">skeleton screen</a> and use any content such as title or thumbnail already available while content loads.</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Each page has a URL</strong></td></tr><tr><td>To Test</td><td>Ensure individual pages are deep linkable via the URLs and that URLs are unique for the purpose of shareability on social media by testing with individual pages can be opened and directly accessed via new browser windows.</td></tr><tr><td style="width: 25%;">To Fix</td><td>If building a single-page app, make sure the client-side router can re-construct app state from a given URL.</td></tr></tbody></table>

## Advanced Requirements (Exemplary PWAs)

The basic requirements for a PWA represent an "MVP" of what a PWA can be. These advanced requirements point out to additional resources, concepts and ideas that will make the app even better.

These fall under the "nice to have" or "these are optional but strongly encouraged" parts of a PWA.

### Indexability & Social

Whether a PWA or a regular site we want to make sure that search engines can find your app and show it to potential users. Because the concept of PWA is new there hasn't been much done in the search engine space and discoverability spacces. Microsoft Bing search engine has taken the lead in this area.

> We \[Microsoft\] are already using the Bing Crawler to identify PWAs on the Web for our PWA research. The Web App Manifest is a proactive signal from developers that a given website should be considered an app; we’re listening to that signal and evaluating those sites as candidates for the Store. Once we identify quality PWAs, we’ll automatically generate the APPX wrapper format used by the Windows Store and assemble a Store entry based on metadata about the app provided in the Web App Manifest. Aarong Gustafson - [Progressive Web Apps and the Windows Ecosystem](https://www.aaron-gustafson.com/notebook/progressive-web-apps-and-the-windows-ecosystem/)

For more information, see Google's guide to [social optimization](https://developers.google.com/web/fundamentals/discovery-and-monetization/search-optimization/) and [social discovery](https://developers.google.com/web/fundamentals/discovery-and-monetization/social-discovery/).

<table><tbody><tr><td colspan="2"><strong>Site's content is indexed by Google</strong></td></tr><tr><td>To Test</td><td>Use the <a href="https://support.google.com/webmasters/answer/6066468">Fetch as Google</a> tool to preview how Google will see your site when it is crawled.</td></tr><tr><td style="width: 25%;">To Fix</td><td><a href="https://webmasters.googleblog.com/2014/05/understanding-web-pages-better.html">Google's indexing system does run JavaScript</a> but some issues may need to be fixed to make content accessible. For example, if you are using new browser features like the Fetch API, ensure that they are polyfilled in browsers without support.</td></tr></tbody></table>

Just like regular pages, the pages of a PWA bennefit from metadata. This will help Google and other searc engine crawlerss to better index your content. See the examples under the `to-fix` section for ideas of what you can do with Metadata. Also check James Williams course on HTML5 structured data on [Linkedin Learning](https://www.lynda.com/)

Note that this refers to generic metadata, not the one you'd use for Facebook or Twitter. That comes in the next section.

<table><tbody><tr><td colspan="2"><strong>Schema.org metadata is provided where appropriate</strong></td></tr><tr style="background-color: white;"><td colspan="2"><a href="https://schema.org/">Schema.org</a> metadata can help improve the appearance of your site in search engines.</td></tr><tr><td>To Test</td><td>Use the <a href="https://search.google.com/structured-data/testing-tool">testing tool</a> to ensure title, image, description etc. are available.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Markup the content. For example:<ul><li>A recipe app should have the <a href="https://developers.google.com/search/docs/data-types/recipes">Recipe type</a> markup for Rich Cards.</li><li>A news app should have the <a href="https://developers.google.com/search/docs/data-types/articles">NewsArticle type markup</a> for Rich Cards and/or AMP support.</li><li>An ecommerce app should have the <a href="https://developers.google.com/search/docs/data-types/products">Product type markup</a> for Rich Cards.</li></ul></td></tr></tbody></table>

Social metadata is the other part of making you applicaation known and includes Facebook, Twitter, Google+ and others.

<table><tbody><tr><td colspan="2"><strong>Social metadata is provided where appropriate</strong></td></tr><tr><td>To Test</td><td><ul><li>Open a representative page in <a href="https://developers.facebook.com/tools/debug/">Facebook's crawler</a> and ensure it looks reasonable</li><li>Check that <a href="https://dev.twitter.com/cards/overview">Twitter Cards meta data</a> is present (for example &lt;meta name="twitter:card" content="summary" /&gt;) if you feel it would be appropriate</li></ul></td></tr><tr><td style="width: 25%;">To Fix</td><td>Mark up content with <a href="">Open Graph</a> tags and as advised by <a href="https://dev.twitter.com/cards/overview">Twitter</a>.</td></tr></tbody></table>

Some sites still use 2 sites for the same content, one is the standard `www` and the other one is a specialized mobile site, usually called m-dot (`m.site.com`). To help search engine crawlers use the `rel="canonical` attribute of the link tag to tell the crawler which one is the canonical version.

<table><tbody><tr><td colspan="2"><strong>Canonical URLs are provided when necessary</strong></td></tr><tr style="background-color: white;"><td colspan="2">This is only necessary if your content is available at multiple URLs.</td></tr><tr><td>To Test</td><td>Determine whether any piece of content is available at two different URLs. Open both of these pages and ensure they use &lt;link rel=canonical&gt; tags in the head to indicate the canonical version</td></tr></tbody></table>

To Fix Add a canonical link tag to the <head> of each page, pointing to the canonical source document. See [Use canonical URLs](https://support.google.com/webmasters/answer/139066) for more information.

The history API lets you programmatically control the navigation of your app. Using it means that your users will be able to navigate throughout the application without having to worry if the browser will remember the sites you visited.

<table><tbody><tr><td colspan="2"><strong>Pages use the History API</strong></td></tr><tr><td>To Test</td><td>For single page apps, ensure the site doesn't use fragment identifiers. For example everything after the #! in https://example.com/#!user/26601.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API">History API</a> instead of page fragments.</td></tr></tbody></table>

### User experience

A PWA is no different than any other app in how users will react to poor UX and UI. We need to present a great user experience as we can.

Ensure all content, especially images and ads, have fixed sizing in CSS or inline on the element. consider ways to present a preview of the content until it's downloaded.

<table><tbody><tr><td colspan="2"><strong>Content doesn't jump as the page loads</strong></td></tr><tr><td>To Test</td><td>Load various pages in the PWA and ensure content or UI doesn't "jump" as the page loads</td></tr><tr><td style="width: 25%;">To Fix</td><td>Ensure all content, especially images and ads, have fixed sizing in CSS or inline on the element. Before the image loads you may want to show a grey square or blurred/small version (if available) as a placeholder</td></tr></tbody></table>

This is an interesting case. I seldom see this being enforced but the user experience works consistently and doesn't make you scroll up or down to get to the section of the content we were looking at.

<table><tbody><tr><td colspan="2"><strong>Pressing back from a detail page retains scroll position on the previous list page</strong></td></tr><tr><td>To Test</td><td>Find a list view in the app. Scroll down. Tap an item to enter the detail page. Scroll around on the detail page. Press back and ensure the list view is scrolled to the same place it was at before the detail link/button was tapped.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Restore the scroll position in lists when the user presses 'back'. Some routing libraries have a feature to do this for you.</td></tr></tbody></table>

In mobile most applications will use the system's virtual keyboard. When the keyboard appears, make sure the content is not obscured under the keyboard.

<table><tbody><tr><td colspan="2"><strong>When tapped, inputs aren't obscured by the on screen keyboard</strong></td></tr><tr><td>To Test</td><td>Find a page with text inputs. Scroll to put the text input as low on the screen as you can make it. Tap the input and verify it is not covered when the keyboard appears.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Explore using features like <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView">Element.scrollIntoView()</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded">Element.scrollIntoViewIfNeeded()</a> to ensure the input is visible when tapped.</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Content is easily shareable from standalone or full screen mode</strong></td></tr><tr><td>To Test</td><td>Ensure from standalone mode (after adding the app to your home screen) that you are able to share content, if appropriate, from within the app's UI.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Provide social share buttons, or a generic share button within your UI. If a generic button, you may want to directly copy the URL to the user's clipboard when tapped, offer them social networks to share to, or try out the new <a href="https://developers.google.com/web/updates/2016/10/navigator-share">Web Share API</a> to integrate with the native sharing system on Android.</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Site is responsive across phone, tablet and desktop screen sizes</strong></td></tr><tr><td>To Test</td><td>View the PWA on small, medium and large screens and ensure it works reasonably on all.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Review our guide on <a href="https://developers.google.com/web/fundamentals/design-and-ui/responsive/">implementing responsive UIs</a>.</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Any app install prompts are not used excessively</strong></td></tr><tr><td>To Test</td><td>Check the PWA doesn't use an app install interstitial when loaded</td></tr><tr><td style="width: 25%;">To Fix</td><td>There should only be one top or bottom app install banner After the PWA is added to the user's home screen, any top/bottom banners should be removed.</td></tr></tbody></table>

Whenever you use Add to Home Screen you're responsible for not annoying your users by presenting A2HS before the user had the chance to evaluate your site and make a decision or at inoportune times.

<table><tbody><tr><td colspan="2"><strong>The Add to Home Screen prompt is intercepted</strong></td></tr><tr><td>To Test</td><td>Check the browser doesn't display the A2HS at an inopportune moment, such as when the user is in the middle of a flow that shouldn't be interrupted, or when another prompt is already displayed on the screen.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Intercept the beforeinstallprompt event and prompt later Chrome manages when to trigger the prompt but for situations this might not be ideal. You can <a href="https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/#deferring_or_cancelling_the_prompt">defer the prompt</a> to a later time in the app's usage.</td></tr></tbody></table>

### Performance

Users are pushy and expect more than our apps. They want them fast and they want responsive and they want high quality. This section will look at the performance requirements for great PWAs.

<table><tbody><tr><td colspan="2"><strong>First load very fast even on 3G</strong></td></tr><tr><td>To Test</td><td>Use Lighthouse on a Nexus 5 (or similar) to verify time to interactive &lt; 5s for first visit on a simulated 3G network (as opposed to the 10s goal for baseline PWAs)</td></tr><tr><td style="width: 25%;">To Fix</td><td>Review the <a hreef="https://developers.google.com/web/fundamentals/performance/">performance</a> section of WebFundamentals and ensure you're following the best practices. You can understand your performance better by using <a href="https://developers.google.com/speed/pagespeed/insights/">Pagespeed Insights</a> (aim for a score &gt;85) and SpeedIndex on <a href="https://www.webpagetest.org/">WebPageTest</a> (aim for a score &lt;4000 on the first view on Mobile 3G Nexus 5 Chrome). A few tips are to focus on loading less script, make sure as much script is loaded asynchronously as possible using &lt;script async&gt; and make sure render blocking CSS is marked as such.</td></tr></tbody></table>

### Caching

One of the great things about PWAs is that they smooth out network connections making PWAs look like they are faster.

We can accomplish the caching performance with service worker that use cache-first strategies. This will pull the data from the cache and, only if not cached, will fetch it from the network and store it in the cache.

There are exceptions to the rule. You may not want to cache large videos, audio or other large files. If so present the user with cues that the content is not available offline.

<table><tbody><tr><td colspan="2"><strong>Site uses cache-first networking</strong></td></tr><tr><td>To Test</td><td>Set the network emulation to the slowest setting and browse around the app. Then, set the network emulation to offline and browse around. The app should not feel faster when offline than on a slow connection.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Use cache-first responses wherever possible.</td></tr></tbody></table>

There are times when it's important for the user to know if they are offline. For example: You should tell the user they are offline if they are trying to complete an ecommerce transation or trying to view videos that are only available online.

<table><tbody><tr><td colspan="2"><strong>Site appropriately informs the user when they're offline</strong></td></tr><tr><td>To Test</td><td>Emulate an offline network and verify the PWA provides an indication that you are offline.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Use the Network Information API to show the user an indication when they're offline.</td></tr></tbody></table>

### Push notifications

This check list only applies if notifications are implemented. Adding push notifications is not a requirement for an exemplary progressive web app.

Always provide context for the user to decide if they should enable notifications. Tell them what types of messages your app will push and be explicit as to what permissions you want. If you're asking for permission to use Push Notifications then do just that.

If your app is requesting permission for push notification on first visit you better have a good explanation right up front as to why you're asking before users have a chance to exprience your app.

<table><tbody><tr><td colspan="2"><strong>Provide context to the user about how notifications will be used</strong></td></tr><tr><td>To Test</td><td><ul><li>Visit the site, and find the push notifications opt-in flow</li><li>When you are shown the permission request by the browser, ensure that context has been provided explaining what the site wants the permission for</li><li>If the site is requesting for the permission on page load, ensure it provides very clear context simultaneously for why the user should enable push notifications</li></ul></td></tr><tr><td style="width: 25%;">To Fix</td><td>See our guide to <a href="https://docs.google.com/document/d/1WNPIS_2F0eyDm5SS2E6LZ_75tk6XtBSnR1xNjWJ_DPE/view">creating user-friendly Notifications permissions flows</a>.</td></tr></tbody></table>

Please, please, please don't annoy your users by presenting them with Push Notification signups on every page of your site. Remember that if they block your application, it will stay blocked until they decide to unblock it an add notifications from your site.

As the test below indicates, if the user doesn't opt in to your application's notification workflow you shouldn't prompt them againn in the same session.

<table><tbody><tr><td colspan="2"><strong>UI encouraging users to turn on Push Notifications must not be overly aggressive.</strong></td></tr><tr><td>To Test</td><td>Visit the site and find the push notifications opt in flow. Ensure that if you dismiss push notification, the site does not re-prompt in the same way within the same session.</td></tr><tr><td style="width: 25%;">To Fix</td><td>If users say they don't want a certain kind of notification, do not reprompt for at least a few days (for example, one week).</td></tr></tbody></table>

 

<table><tbody><tr><td colspan="2"><strong>Site dims the screen when permission request is showing</strong></td></tr><tr><td>To Test</td><td>Visit the site and find the push notifications opt-in flow. When Chrome is showing the permission request, ensure that the page is "dimming" (placing a dark overlay over) all content not relevant to explaining why the site needs push notifications.</td></tr><tr><td style="width: 25%;">To Fix</td><td>When calling <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission">Notification.requestPermission</a> dim the screen. Undim it when the promise resolves.</td></tr></tbody></table>

If you decide to use push notifications in your site make sure they are relevant ant timely. By this I mean that the user only gets notifications when they perform and acction, therre is new/updated information, something happens that requires the user to take action and it's about the site they are visting.

<table><tbody><tr><td colspan="2"><strong>Push notifications must be timely, precise and relevant</strong></td></tr><tr><td>To Test</td><td>Enable push notifications from the site and ensure the use cases they're using the push notifications for are:<ul><li>Timely — A timely notification is one that appears when users want it and when it matters to them</li><li>Precise — A precise notification is one that has specific information that can be acted on immediately</li><li>Relevant — A relevant message is one about people or subjects that the user cares about</li></ul></td></tr><tr><td style="width: 25%;">To Fix</td><td>See our guide on <a href="https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/good-notification">creating great push notifications</a> for advice. If your content is not timely and relevant to this user, consider using email instead.</td></tr></tbody></table>

Make sure the user has a way to disable and, hopefully, reenable notifications without going to the browser's UI to do so.

<table><tbody><tr><td colspan="2"><strong>Provides controls to enable and disable notifications</strong></td></tr><tr><td>To Test</td><td>Enable push notifications from the site. Ensure there is some place on the site that allows you to manage your notifications permissions or disable them.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Create a UI that allows users to manage their notification preferences.</td></tr></tbody></table>

### Additional features

These are additional features that make PWAs easier to work with. They only apply if you're using the API on your site/app.

<table><tbody><tr><td colspan="2"><strong>User is logged in across devices via Credential Management API</strong></td></tr><tr style="background-color: white;"><td colspan="2">This only applies if your site has a sign in flow.</td></tr><tr><td>To Test</td><td>Create an account for a service and ensure you see the save password/account dialog show up. Click "Save". Clear cookies for the site (via clicking on the padlock or Chrome settings) and refresh the site. Ensure that you either see an account picker (e.g. if there are multiple accounts saved) or are automatically signed back in.<p>Sign out and refresh the site. Ensure that you see the account picker.</p></td></tr><tr><td style="width: 25%;">To Fix</td><td>Follow our <a href="https://developers.google.com/web/fundamentals/security/credential-management/">Credential Management API Integration Guide</a>.</td></tr></tbody></table>

<table><tbody><tr><td colspan="2"><strong>User is logged in across devices via Credential Management API</strong></td></tr><tr style="background-color: white;"><td colspan="2">This check only applies if your site accepts payments.</td></tr><tr><td>To Test</td><td>Enter the payment flow. Instead of filling out a conventional form, verify the user is able to pay easily via the native UI triggered by the Payment Request API.</td></tr><tr><td style="width: 25%;">To Fix</td><td>Follow our Payment Request API Integration Guide.</td></tr></tbody></table>
