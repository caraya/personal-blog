---
title: "My CSS Starter Kit: Color Manipulation"
date: "2016-12-12"
---

# Taking advantage of SASS to play with colors

I'm bad at remembering headecimal, rgba or hsl colors. These fuctions will help convert the hexadecimal values

```scss
$base-color: #AD141E;
```

**Darken & Lighten** These two adjust the Lightness of the color’s HSL values. Sass will parse our hex color variable to hsl, then make the adjustments. You call them on the color with a percentage value between 0 and 100. I usually stay in the range of 3-20%.

```scss
darken( $base-color, 10% )
lighten( $base-color, 10% )
```

![](http://media.tumblr.com/tumblr_luv5i70HPp1qb5ozt.png)

**Saturate, & Desaturate**

These will will adjust the Saturation of the colors HSL values, much like Darken and Lighten adjusted the Lightness. Again, you need to give a percentage value to saturate and desaturate.

```scss
saturate( $base-color, 20% )
desaturate( $base-color, 20% )
```

![](http://media.tumblr.com/tumblr_luv5ij6hvY1qb5ozt.png)

**Adjust-hue**

This adjusts the hue value of HSL the same way all of the others do. Again, it takes a percentage value for the change.

```scss
adjust-hue( $base-color, 20% )
```

![](http://media.tumblr.com/tumblr_luv5iuczYx1qb5ozt.png)

**Adding Alpha Transparency**

Using our hex color we can do a few things to get it to be a little transparent. I stick to rgba as it comes most naturally to me which takes a color and a value from 0 to 1 for the alpha.

```scss
rgba( $base-color, .7 )
```

With these techniques we can build color palettes for our base colors. for example:

```scss
$red-base: #AD141E;
$red-l10: lighten( $red-base, 10%);
$red-l20: lighten( $red-base, 20%);
$red-l30: lighten( $red-base, 30%);
$red-l40: lighten( $red-base, 40%);
$red-l50: lighten( $red-base, 50%);
$red-d10: darken( $red-base, 10%);
$red-d20: darken( $red-base, 20%);
$red-d30: darken( $red-base, 30%);
$red-d40: darken( $red-base, 40%);
$red-d50: darken( $red-base, 50%);
```

Using `$red-base` we've used SASS to create 5 progressively lighter and 5 progressively darker shades of the color without having to learn what the hexadecimal values are for each of the 10 colors we created automatically.

We can repeat the process for each of the colors that we want to work with. We can take the colors from [The New Defaults](http://dudleystorey.github.io/thenewdefaults/) or a palete from [Material Palette](http://materialpalette.com/)and build a 5 up and 5 down scale for each color.

Color manipulation functions can also be used directly in selectors. The example below show some ways we can use the color functions inside selectors.

```scss
.example {
  border: 1px solid darken($base-color, 20%);
  text-shadow: 0 -1px 0 darken($base-color, 10%);
  box-shadow: 10px 5px 5px lighten($base-color, 20%));
}
```

The stylesheets provide the following list of colors along with their names:

```scss
//Greens
$turqoise: #1abc9c;
$green-sea: #16a085;
$emerald: #2ecc71;
$nephritis: #27ae60;
$green: #4caf50;
$light-green: #8bc34a;
$lime: #cddc39;
//Blues
$river: #3498db;
$belize: #2980b9;
$asphalt: #34495e;
$midnight-blue: #2c3e50;
$blue: #2196f3;
$light-blue: #03a9f4;
$cyan: #00bcd4;
$teal: #009688;
//Reds
$alizarin: #e74c3c;
$pomegranate: #c0392b;
$red: #f44336;
//Oranges
$carrot: #e67e22;
$pumpkin: #d35400;
$dull-orange: #f39c12;
$orange: #ff9800;
$blood-orange: #ff5722;
$amber: #ffc107;
//Yellows
$sunflower: #f1c40f;
$yellow: #ffeb3b;
//Purples + Pinks
$rebecca-purple: #663399;
$amethyst: #9b59b6;
$plum: #8e44ad;
$purple: #9c27b0;
$deep-purple: #673ab7;
$pink: #e91e63;
$indigo: #3f51b5;
//Browns
$brown: #795548;
//Greys
$grey: #9e9e9e;
$gun-metal: #607d8b;
$asbestos: #7f8c8d;
$concrete: #95a5a6;
$silver: #bdc3c7;
//Whites
$clouds: #ecf0f1;
$paper: #efefef;
```
