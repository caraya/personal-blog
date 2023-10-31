---
title: "Analyzing a font with Wakamaifondue"
date: "2021-12-01"
---

When I wrote my article reviewing `font-variant-*` attributes I realized that I needed a way to see what OpenType features the font I'm using supports.

My go-to tool is [Wakamaifondue](https://wakamaifondue.com/) to see what the font has to offer. The screenshots below use [Recursive](https://www.recursive.design/), my favorite variable font, run through Wakmaifondue.

If you've used Wakamaifondue before the screenshots may look a little different. These are from the beta version of the site. I chose it because the UI is better than the original.

The site will first ask you to "upload" a font. All the processing is done on the browser so you can rest assured that the font is safe.

Once Wakamaifondue processes the font, it will show you the information it gathered about it.

The top of the screen will give you information about the font, including the OpenType features it supports.

![Top section of the Wakamaifondue website](/images/2021/10/new-wakamaifondue-01.png)

As you scroll down you will see a text box, a list of OpenType features, and a list of the variable font axes available to the font (if any).

The text box is editable so you can use your own text to test the features. The OpenType feature status buttons and the variable font axes are also editable so you can play with the font using your own test and see which available features and axes best suit your design needs.

![Section of the Wakamaifondue site showing OpenType features and variable fonts axes](/images/2021/10/new-wakamaifondue-02.png)

The final block I want to highlight shows another editable box, a list of the available axes, the range of values for each, and a list of all the predefined instances (combination of different axes values) that the font author created.

Clicking in an instance will automatically shift the axes to match the selected instance so you don't have to. Playing with the sliders will also shift the axes to match the values you select, allowing you to create your own custom instance.

![Top section of the Wakamaifondue website](/images/2021/10/new-wakamaifondue-03.png)

What I like the best about Wakamaifondue is that it provides you with a downloadable CSS stylesheet with all the information about the font and classes for each OpenType feature and predefined instance. This makes it easier to use the fonts in your designs while also allowing you to pick and choose which features you want to include on your existing CSS.
