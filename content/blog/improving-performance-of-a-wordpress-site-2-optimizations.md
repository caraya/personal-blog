---
title: "Improving performance of a WordPress site (2): Optimizations"
date: "2023-08-16"
---

Now that we've set up the baseline, let's see how much we can improve it.

## Enable a cache plugin

We will first install a Cache Plugin to make easier to cache different portions of the website.

I will use [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) with the default settings.

| Source | Form Factor | Performance | Best Practices | Accessibility | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 68 | 98 | 100 | 100 | N/A |
| PSI | Desktop | 98 | 98 | 100 | 100 | N/A |
| Node | Mobile | 84 | 98 | 100 | 100 | Pass |
| Node | Desktop | 57 | 98 | 100 | 100 | Pass |

After these numbers I chose to fine tune the cache settings.

I've made sure that the following setings are enabled:

- Page Cache: Disk Basic
- Opcode Cache: Zend Opcache
- Database Cache: Disk
- Object Cache: Disk

I chose not to enable Browser Cache at this time since there is more configuration work involved in properly fine-tuning the cache.

At this time I've also chosen to enable some additional settings:

- Disable Emoji
- Disable wp-embed script
- Disable jquery-migrate on the front-end

I did not enable lazy loading since that is handled natively in all major browsers by adding `loading="lazy"` to all images and iframes that we want to lazy load.

| Source | Form Factor | Performance | Accessibility | Best Practices | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 65 | 98 | 100 | 100 | N/A |
| PSI | Desktop | 98 | 98 | 100 | 100 | N/A |
| Node | Mobile | 75 | 98 | 100 | 100 | Pass |
| Node | Desktop | 57 | 98 | 100 | 100 | Pass |

### Configure and fine tume browser cache settings

Once we've enabled the caches, we can look at the browser cache and finetuning the cache's Time To Live (for different assets).

Once again, we'll leverage the W3 Total Cache plugin.

The first step is to enable the browser cache in the general settings.

Next we need to set expire headers and the duration in seconds for each section:

- CSS & JS

    - The duration for these items to one year (31536000 seconds)
    - We enable gzip compression for the assets
- HTML & XML

    - The duration for these items is 30 days (25920000 seconds)
    - We enable gzip compression for the assets
- Media & Other Files

    - The duration for these items to one year (31536000 seconds)
    - We enable gzip compression for the assets

I wish I had more granularity for media and other files. I don't mind having fonts be cached for a year but other assets like I may want to cache for shorter periods or force to revalidate.

| Source | Form Factor | Performance | Accessibility | Best Practices | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 75 | 98 | 100 | 100 | N/A |
| PSI | Desktop | 97 | 98 | 100 | 100 | N/A |
| Node | Mobile | 77 | 98 | 100 | 100 | Pass |
| Node | Desktop | 57 | 98 | 100 | 100 | Pass |

### Sidenote: Will a 10kb `.htaccess` file slow down page load?

W3 Total Cache inserts instructions into into the sites `.htaccess` configuration file.

I already use this file to provide pretty URLs and to redirect the http version of the site to https.

But the W3 Total Cache additions push the size of the file to 10KB. My concern is that this will affect the site's performance since the server reads the `.htaccess` file for every request. But is this the case?

According to the [Apache HTTP Server Tutorial: .htaccess files](https://httpd.apache.org/docs/2.4/howto/htaccess.html) the answer is yes, `.htaccess` files (of any size) will affect performance.

They state that:

> You should avoid using .htaccess files completely if you have access to httpd main server config file. Using .htaccess files slows down your Apache http server. Any directive that you can include in a .htaccess file is better set in a Directory block, as it will have the same effect with better performance.

The page goes into more detail explaining the performance impact of `.htaccess` files:

> There are two main reasons to avoid the use of .htaccess files. The first of these is performance. When `AllowOverride` is set to allow the use of `.htaccess` files, httpd will look in every directory for `.htaccess` files. Thus, permitting `.htaccess` files causes a performance hit, whether or not you actually even use them! Also, the `.htaccess` file is loaded every time a document is requested. Further note that httpd must look for .htaccess files in all higher-level directories, in order to have a full complement of directives that it must apply. (See section on how directives are applied.) Thus, if a file is requested out of a directory /www/htdocs/example, httpd must look for the following files: /.htaccess /www/.htaccess /www/htdocs/.htaccess /www/htdocs/example/.htaccess And so, for each file access out of that directory, there are 4 additional file-system accesses, even if none of those files are present. (Note that this would only be the case if .htaccess files were enabled for /, which is not usually the case.)

Since my hosting provider doesn't provide a way to use the main Apache configuration file and will not provide a sensible alternative, I will have to evaluate if the performance hit of such a large `.htaccess` file is noticeable.

#### Changing cache TTL

To serve static assets with an efficient cache policy we need to change the cache TTL from what Lighthouse is seeing to a more sane value.

W3 Total Cache provides tools change the behavior of these files. The default behavior is to disable all the cache change behaviors.

However, even though it improves performance, it doesn't change the caching behavior of my font file, one of the largest assets downloaded.

**Note**: I forgot to run my tests after this change so no data is recorded.

### Add `fetchpriority` to the header image

[Priority hints](https://www.debugbear.com/blog/priority-hints) give developers a way to change the loading priority for specific elements.

In this case, we want to make sure that the header image is loaded as early as possible in the process.

The `fetchpriority` attribute is the HTML way to indicating that we want to change the priority of the element the attribute is attached to.

This example image uses `fetchpriority` to let the browser know that we want to load the image as early as possible.

```html
<img src="my_image.jpg" fetchpriority="high"
```

Rather than use a plugin to do this in Wordpress, we'll leverage a WordPress function to do this.

My theme uses [the\_header\_image\_tag](https://developer.wordpress.org/reference/functions/the_header_image_tag/) to print the `img` element with the proper value inside the `header.php` template.

The function takes an array of attributes that will get printed as attributes to the generated image. So the modified `the_header_image_tag` function inside `header.php` looks like this.

```php
  <?php the_header_image_tag(
    array(
      'fetchpriority' => 'high'
    )
  ); ?>
```

The numbers change like shown below:

| Source | Form Factor | Performance | Accessibility | Best Practices | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 65 | 98 | 92 | 100 | N/A |
| PSI | Desktop | 97 | 98 | 92 | 100 | N/A |
| Node | Mobile | 68 | 98 | 92 | 100 | Pass |
| Node | Desktop | 48 | 98 | 92 | 100 | Pass |

### Move scripts to footer

Since there are many scripts that get loaded by plugins, we can't use WordPress enqueue functions to place scripts on the footer of pages and we can't depend on plugin authors to do it either.

There are ways to programmatically add attributes like defer or async to `script` elements from PHP, I've done this with the Prism script that I install from the theme.

However, you have to be careful when doing this as this may break your site.

```php
<?php
function rivendellweb_js_defer_attr( $tag ) {
  $scripts_to_include = array( 'prism.js' );

  foreach ( $scripts_to_include as $include_script ) {
    if ( true == strpos( $tag, $include_script ) ) {
      return str_replace( ' src', ' defer src', $tag );
    }
  }
  return $tag;

}
add_filter( 'script_loader_tag', 'rivendellweb_js_defer_attr', 10 );
```

However, I've chosen to move most of the scripts to the footer. This way they no longer block rendering, and we no longer care who added the plugins to the page.

After activating the plugin I checked if there were any settings that I wanted to enable. Most of these settings are about sections where I would like scripts **not** to be moved to the bottom of the page.

There are none.

Unfortunately, when I move the scripts to the bottom of the page, the header image stops displaying and, I would assume, all Cloudinary images would stop displaying elsewhere on the blog.

The Cloudinary's initialization script must be on the header for it to work and there is no way to identify it so we can exclude it with the scripts to footer plugin.

Cloudinary support provided the following script to keep their initialization script on the head of the document.

```php
<?php
add_action(
  'cloudinary_ready',
  static function() {

    $bypass = apply_filters(
      'cloudinary_bypass_lazy_load',
      false,
      array(
        'atts' => array(
          'class' => '',
        ),
      )
    );

    if ( ! $bypass && ! has_action( 'wp_head', 'wp_print_scripts' ) ) {
      $plugin    = Cloudinary\get_plugin_instance();
      $lazy_load = $plugin->get_component( 'lazy_load' );

      add_action( 'wp_head', array( $lazy_load, 'enqueue_assets' ) );
    }
  }
);
```

With this plugin in place and all other scripts that can be moved, moved to the footer, the numbers look like this:

| Source | Form Factor | Performance | Accessibility | Best Practices | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 66 | 98 | 92 | 100 | N/A |
| PSI | Desktop | 97 | 98 | 92 | 100 | N/A |
| Node | Mobile | 74 | 98 | 92 | 100 | Pass |
| Node | Desktop | 52 | 98 | 92 | 100 | Pass |

### Remove unnecessary scripts

There are scripts that get loaded without need. One example is the Gutenberg block library (`block-library/style.min.css`) that is not needed because I'm not using the block editor. The first attempt at removing the script is to disable the block editor altogether.

Rather than manually code a solution to remove the scripts and stylesheets that I don't want and having to remember to change it if I ever switch to working with block, I decided to use the [Asset CleanUp: Page Speed Booster](https://wordpress.org/plugins/wp-asset-clean-up/) to do most of the cleanup.

Although the plugin requires an annual, paid, "pro" version for things that I consider basic like adding `async` or `defer` attributes to scripts, it's not a deal breaker since I have custom scripts to add the attributes where necessary.

The plugin allows you to remove scripts and stylesheets for individual pages or for the entire site.

![](/images/2023/07/asset-cleanup-01.png)

Asset Cleanup plugin example showing scripts and stylesheets blocked site-wide and how the administrator can configure exceptions to the site-wide rule

![alt text](/images/2023/07/asset-cleanup-02.png)

Asset Plugin example showing a site-wide removal with a logged-in user override

Even with the plugin limitations, even though I won't get a paid an annual subscription, it does a good enough job to merit another test.

There are also potential issues with Google Tag Manager that loads code that is not used.

This also reduced the number of scripts in the chains of scripts and stylesheets that block rendering as they download.

| Source | Form Factor | Performance | Accessibility | Best Practices | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 78 | 98 | 92 | 100 | N/A |
| PSI | Desktop | 99 | 98 | 92 | 100 | N/A |
| Node | Mobile | 86 | 98 | 92 | 100 | Pass |
| Node | Desktop | 53 | 98 | 92 | 100 | Pass |
| Browser | Mobile | 89 | 96 | 92 | 100 | Pass |
| Browser | Desktop | 98 | 96 | 92 | 100 | Pass |
| Webpagetest | Mobile | 70 | 96 | 92 | 100 | Pass |
