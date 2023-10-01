---
title: "Internationalizing WordPress Themes and Plugins (part 1)"
date: "2020-06-15"
---

According to [GALA (Globalization and Localization Alliance)](https://www.gala-global.org/language-industry/intro-language-industry/what-internationalization):

> Internationalization is a design process that ensures a product (usually a software application) can be adapted to various languages and regions without requiring engineering changes to the source code. Think of internationalization as readiness for localization... Some practical examples of how internationalization is critical to multilingual products include:
> 
> - Independence from a specific language/character set encoding
> - Independence from specific cultural conventions
> - Removal of hard-coded text
> - Minimization of concatenated text strings
> - Careful use of in-line variables
> - Compatibility with third-party tools
> - Unicode compliance for global text display
> - Accommodation of double-byte languages (for example, Japanese)
> - Accommodation of right-to-left languages (for example, Arabic)

In the context of WordPress, internationalization means at least two things:

- Ensuring that the text in our themes and plugins is ready for localization
- Making sure that we consider right-to-left languages

The strategies for internationalizing plugins and themes are slightly different so we'll cover them separately.

## Internationalization tools in WordPress

WordPress translation infrastructure is built on top of [GNU Gettext](https://www.gnu.org/software/gettext/) so that's a good starting point for research. The rest of he post is WordPress Specific.

### Text Domain

The text domain provides WordPress with a unique identifier for our plugin or theme. This is important because WordPress will have many plugins and a theme to sort through so having unique names makes things easier.

In a theme, the text domain and the domain path, the location of our translated files, is placed on the root CSS style sheet. For our `my-demo-theme` theme this is placed in a comment inside `style.css`.

```php
/*
* Theme Name: My Theme
* Author: Theme Author
* Text Domain: my-demo-theme
* Domain Path: /languages
*/
```

For plugins, the Text Domain and Domain path are placed in a comment on the root PHP file, either index.php or the root of the plugin code.

```php
/*
 * Plugin Name: My Plugin
 * Author: Plugin Author
 * Text Domain: my-demo-plugin
 * Domain Path: /languages
 */
```

### i18n functions

There are several i18n functions available for PHP internationalization

The most basic one is [\_\_()](https://developer.wordpress.org/reference/functions/__/) that will just translate its content.

```php
<?php
__('Hello World', 'my-demo-theme');
```

Note that it will not echo the result, you have to use a different function (`_e()`), discussed next.

[\_e()](https://developer.wordpress.org/reference/functions/_e/) is similar to the previous example but it also displays the output to the page.

```php
<?php
_e('Hello World', 'my-demo-theme');
```

The next one, [\_x()](https://developer.wordpress.org/reference/functions/_x/), is similar to `__()` but it also provides a context to help translators. You could do a comment before the item being translated but this will help systems like [Polyglots](https://translate.wordpress.org/) do a better job.

The function takes three arguments:

- The string to translate
- The context for the translation
- The text domain

```php
_x( 'Read', '
    past participle: books I have read',
    'my-demo-theme'
);
```

In this example, the word read, on its own, has multiple meanings and the translator will not be able to get the context right away so adding the context helps with the translation.

The [\_ex()](https://developer.wordpress.org/reference/functions/_ex/) function is a combination of `_e()` and `_x()`.

```php
_ex( 'Read', '
    past participle: books I have read',
    'my-demo-theme'
);
```

The next block is for strings that should be pluralized. The first one is [\_n()](https://developer.wordpress.org/reference/functions/_n/) and it takes a singular term, a plural term, their definition, and the text-domain.

```php
<?php
people = sprintf(
  _n(
    '%s person', // Singular Form
    '%s people', // Plural Form
    $count, // Number to compare to
    'my-demo-theme' // Text Domain
  ),
  number_format_i18n( $count )
  // Converts number to
  // locale appropriate version
);
```

The second parameter to `sprintf()` formats the number we produce into something appropriate to the locale the function is being called from.

[\_nx()](https://developer.wordpress.org/reference/functions/_nx/) is a combination of `_n()` and `_x()` in that it provides a way to pluralize content and the context necessary for translators.

```php
<?
$people = sprintf( _nx(
    '%s person', // Singular
    '%s people', // Plural
    $count, // Number to compare
    'context', // Context
    'my-demo-theme' // Text Domaain
  ),
  number_format_i18n( $count )
  // Converts number to
  // locale appropriate version
);
```

THe final block of functions are equivalent to [\_n\_noop()](https://developer.wordpress.org/reference/functions/_n_noop/) and[\_nx\_noop()](https://developer.wordpress.org/reference/functions/_nx_noop/) keep structures with translatable plural strings and use them later when the value is known.

Once you're ready to process the noop functions, you call [translate\_nooped\_plural()](https://developer.wordpress.org/reference/functions/translate_nooped_plural()/)

```php
<?
printf(
  translate_nooped_plural(
    $people,
    $count,
    'my-demo-theme'
  ),
  number_format_i18n( $count )
);
```

### Escaping HTML

Three of the functions have equivalent versions that will escape any HTML In their values, rendering the string safe to use in HTML attributes.

- [esc\_html\_\_()](https://developer.wordpress.org/reference/functions/esc_html__/)
- [esc\_html\_e()](https://developer.wordpress.org/reference/functions/esc_html_e/)
- [esc\_html\_x()](https://developer.wordpress.org/reference/functions/esc_html_x/)

The following code will use the translation for `Hello World` available in the theme represented by `my-demo-theme` and escape the translated string to render HTML-specific characters safe.

```html
<p><?php esc_html_e(
  'Hello World!',
  'my-demo-theme'
); ?></p>
```

### Variables

What if you have a string like the following:

```php
<?php
echo 'Hello $city.'
```

`$city` is a variable and should not be translated as such. The solution is to use placeholders for the variable, along with the `printf` family of functions. Especially helpful are [printf](http://php.net/printf) and [sprintf](http://php.net/sprintf). Here is what one solution looks like:

```php
<?php
$city = Sao Paulo;

printf(
  /* translators: %s: Name of a city */
  __( 'Your city is %s.', 'my-plugin' ),
  $city
);
```

Notice that here the string for translation is just the template "Your city is %s.", which is the same both in the source and at run-time.

Also, note that there is a hint for translators so that they know the context of the placeholder.

### Argument swapping

If you have more than one placeholder in a string, it is recommended that you use argument swapping.

With argument swapping, you must use single quotes (') around the string because double quotes (") will cause PHP to interpret the $s as the s variable, which is not what we want.

In the following example, the first substitution is the name of a city and the second is the zip code.

```php
<?php
printf(
  /* translators: 1: Name of a city 2: ZIP code */
  __( 'Your city is %1$s, and your zip code is %2$s.', 'my-plugin' ),
  $city,
  $zipcode
);
```

This will work for most western languages. However, for some languages displaying the zip code and city in opposite order would be more appropriate.

Using %s prefix in the above example allows for such a case. A translation can thereby be written:

The modified example changes the order of the variables without changing their meaning.

```php
<?php
printf(
  /* translators:
    1: Name of a city
    2: ZIP code */
  __( 'Your zip code is %2$s, and your city is %1$s.', 'my-plugin' ),
  $city,
  $zipcode
);
```
