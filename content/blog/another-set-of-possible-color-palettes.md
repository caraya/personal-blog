---
title: "Another set of possible color palettes"
date: 2024-02-28
tags:
  - CSS
  - Color
---

This post is an extension to the previous one [What are Triadic and Tetradic Color Palettes and How to Use Them](https://publishing-project.rivendellweb.net/what-are-triadic-and-tetradic-color-palettes/). It will explore further types of palettes, also known as harmonies in color theory, and how to generate them.

## Complementary colors

These are two colors that are positioned on opposite ends of the color wheel, 180 degrees from each other.

<figure>
  <div style="display:flex;flex-flow:row-wrap;gap:1rem;">
		<div style="background-color:oklch(0.5 1 265);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.5 1 85);height:100px;width:100px;">&nbsp;</div>
	</div>
	<figcaption>Complementary Colors</figcaption>
</figure>

## Split-complementary colors

This is more complicated. Split complementary colors are one primary hue and two hues adjacent to the primary color’s complement. For this example I've chosen colors 30 degrees away from the complementary color

Given the base color is oklch(0.5, 1, 270), the two additional colors in the split complementary scheme are calculated as follows:

* For the first split complementary color, subtract 30 from the complementary color making it 150: (270 + 150) % 360 = 420 % 360 = 60
* For the second split complementary color, we add 30 to the complementary color making it 210: (270 + 210) % 360 = 480 % 360 = 120

Therefore, the split complementary palette for the given OKLCH color is:

1. Base Color: `oklch(0.5 1, 270)`
2. First Split Complementary Color: `oklch(0.5 1 60)`
3. Second Split Complementary Color: `oklch(0.5 1 120)`

<figure>
  <div style="display:flex;flex-flow:row-wrap;gap:1rem;">
		<div style="background-color:oklch(0.5 1, 270);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.5, 1, 60);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.5, 1, 120);height:100px;width:100px;">&nbsp;</div>
	</div>
	<figcaption>Split-complementary Colors</figcaption>
</figure>

## Analogous colors

Three colors, all positioned next to each other on the color wheel.

For this example, I chose the following colors, 30 degrees in either direction from the base color:

1. First analogous color: `oklch(0.5 1, 240)`
2. Base Color: `oklch(0.5 1, 270)`
3. Second analogous color: `oklch(0.5 1, 300)`

<figure>
  <div style="display:flex;flex-flow:row-wrap;gap:1rem;">
    <div style="background-color:oklch(0.5, 1, 240);height:100px;width:100px;">&nbsp;</div>
		<div style="background-color:oklch(0.5 1, 270);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.5, 1, 300);height:100px;width:100px;">&nbsp;</div>
	</div>
	<figcaption>Split-complementary Colors</figcaption>
</figure>

## Monochromatic colors

I build Monochromatic palettes by adjusting the lightness values of an OKLCH color, ranging from 0.1 to 0.9 while keeping the chroma and the hue the same.

<figure>
  <div style="display:flex;flex-flow:row-wrap;">
    <div style="background-color:oklch(0.10 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.20 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="color:white;background-color:oklch(0.30 0.2 268);height:100px;width:100px;"></div>
    <div style="background-color:oklch(0.40 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.50 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.60 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.70 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.80 0.2 268);height:100px;width:100px;">&nbsp;</div>
    <div style="background-color:oklch(0.96 0.2 268);height:100px;width:100px;">&nbsp;</div>
  </div>
  <figcaption>OKLCH monochromatic scale using lightness modification</figcaption>
</figure>
