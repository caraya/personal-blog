---
title: "What are Triadic and Tetradic Color Palettes and How to Use Them"
date: 2024-02-26
tags:
  - CSS
  - Color
draft: true
---

In my last post [Creating an OKLCH Generator Tool](https://publishing-project.rivendellweb.net/creating-an-oklch-generator-tool/), I wrote about about Triadic and Tetradic palettes and how to build them using vanilla JS.

This post will cover what these palettes are and how to use them.

## Triadic Colors

![OKLCH color wheel, provided for reference. Source [Coloraide](https://github.com/facelessuser/coloraide)](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/oklch-color-wheel_kz2mmy.png)

[Triadic colors](https://www.interaction-design.org/literature/article/triadic-color-scheme) are equidistant on the color wheel.

<figure>
<div style="display:flex;flex-flow:row-wrap">
  <div style="background-color:oklch(0.5 1 0 /1);height:100px;width:200px;">&nbsp;</div>
  <div style="background-color:oklch(0.5 1 120 /1);height:100px;width:200px;">&nbsp;</div>
  <div style="background-color:oklch(0.5 1 240 /1);height:100px;width:200px;">&nbsp;</div>
</div>
<figcaption>Example of Triadic Colors at 0, 120, and 240 degrees in the color wheel</figcaption>
</figure>

If we use blue as our starting color, the palette will loop around, that's why the third color is at 92 on the wheel.

<figure>
<div style="display:flex;flex-flow:row-wrap">
  <div style="background-color:oklch(0.5 1 212 /1);height:100px;width:200px;">&nbsp;</div>
  <div style="background-color:oklch(0.5 1 332 /1);height:100px;width:200px;">&nbsp;</div>
  <div style="background-color:oklch(0.5 1 92 /1);height:100px;width:200px;">&nbsp;</div>
</div>
<figcaption>Example of Triadic Colors at 212, 332, and 92 degrees in the color wheel</figcaption>
</figure>

## Tetradic colors

Tetradic colors are four colors equidistant in the color wheel. Because there are four colors, and I'm using the square Tetradic color scheme, they are placed 90 degrees from each other in the color wheel.

Tetradic colors will create two pairs of complementary colors.

<figure>
<div style="display:flex;flex-flow:row-wrap;">
	<div style="background-color:oklch(0.5 1 0 /1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.5 1 90 /1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.5 1 180 /1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.5 1 270 /1);height:100px;width:200px;">&nbsp;</div>
</div>
<figcaption>Example of Triadic Colors at 0, 90, 180, and 270 degrees in the color wheel</figcaption>
</figure>

We can use any color as a starting point to generate the swatches by adding 90 degrees to the starting color.

<figure>
<div style="display:flex;flex-flow:row-wrap">
	<div style="background-color:oklch(0.50 1 212 / 1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.50 1 302 / 1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.50 1 32 / 1);height:100px;width:200px;">&nbsp;</div>
	<div style="background-color:oklch(0.50 1 122 / 1);height:100px;width:200px;">&nbsp;</div>
</div>
<figcaption>Example of Triadic Colors at 212, 302, 21, and 122 degrees in the color wheel</figcaption>
</figure>


## General Considerations

There is no dominant color in either palette, you will have to pick the primary color for your project.

Using different colors in the palette as your primary color will have different effects on your audience. **This is especially important when working with cross-cultural audiences that may interpret colors differently**.

The table below, taken from [Creating Culturally Customized Content for Website Translation](https://web.archive.org/web/20111104184034/http://blog.globalizationpartners.com/culturally-customized-website.aspx), shows how people in different countries perceive colors.

| &nbsp; | 	Countries |||||
| Color | USA | China | India | Egypt | Japan |
| :---: | --- | --- | ---| ---| --- |
| Red | Danger<br>Love<br>Stop| Good fortune<br>Luck<br>Joy | Luck<br>Fury<br>Masculine| Death| Anger<br>Danger |
| Orange| Confident<br>Dependable<br>Corporate | Fortune<br>Luck<br>Joy| Sacred (the Color Saffron)| Virtue<br>Faith<br>Truth| Future<br>Youth<br>Energy |
| Yellow | Coward<br>Joy<br>Hope |Wealth<br>Earth<br>Royal | Celebration | Mourning | Grace<br>Nobility |
| Green | Spring<br>Money<br>New | Health<br>Prosperity<br>Harmony | Romance<br>New<br>Harvest | Happiness<br>Prosperity | Eternal life |
| Blue | Confident<br>Dependability<br>Corporate | Heavenly<br>Clouds | Mourning<br>Disgust<br>Chilling | Virtue<br>Faith<br>Truth | Villainy |
| Purple | Royalty<br>Imagination | Royalty | Unhappiness | Virtue | Wealth |
| Black | Funeral<br>Death<br> | Evil | Heaven<br>Neutral<br>High Quality | Evil | Death |
| White | Purity<br>Peace<br>Holy | Mourning | Fun<br>Serenity<br>Harmony | Joy | Purity<br>Holiness |

As with any other aspect of UX work, test your colors with your target audience.

## Links and Resources

* [Everything You Need To Know About Triadic Colors](https://www.interaction-design.org/literature/article/triadic-color-scheme)
* [Square Colors – How to Master This Lesser-Known Color Scheme](https://www.colorsexplained.com/square-colors/)
* [Tetradic Colour Schemes – The Square](https://quiltsbyjen.ca/tetradic-colour-schemes-the-square/)
