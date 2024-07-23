---
title: Adding math formulas to web pages
date: 2024-07-24
---
<script>
  MathJax = {
    tex: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)']
      ]
    },
  };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

It's not common but there are times when we need to render math equations in a web page.

This post will discuss two strategies for rendering math on web pages: The MathJAX third-party library and MathML, a native way to render math in browsers. We'll discuss the individual tools and why would we choose one over the other.

## MathJax

MathJax is a cross-browser JavaScript library that displays mathematical notation in web browsers, using [MathML](https://developer.mozilla.org/en-US/docs/Web/MathML), [LaTeX](https://en.wikibooks.org/wiki/LaTeX/Mathematics) and [ASCIIMathML](https://www1.chapman.edu/~jipsen/mathml/asciimathsyntax.html) markup. MathJax is released as open-source software under the Apache License.

Out of the three possible inputs, I thin I'll stick with LaTeX for the input. I'll explain why when I discuss MathML later in the post.

### Using MathJax

Before we write LaTeX for use with MathJax, we need to configure and load the

```html
  MathJax = {
    tex: {
      inlineMath: [
        ['$', '$'],
        ['\\(', '\\)']
      ]
    },
  };
</script>
<script id="MathJax-script"
	async
	src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
```

```html
<p>When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\)
	and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</p>
```

<p>When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</p>

### Block using MathJax

```html
<div style="font-size:2rem;" class="math">
	$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}
	-\phi\Bigr) e^{\frac25 \pi}} \equiv 1
	+\frac{e^{-2\pi}} {1+\frac{e^
	{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac
	{e^{-8\pi}} {1+\cdots} } } }$
</div>
```

<div style="font-size:2rem;" class="math">$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}} -\phi\Bigr) e^{\frac25 \pi}} \equiv 1 +\frac{e^{-2\pi}} {1+\frac{e^ {-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac {e^{-8\pi}} {1+\cdots} } } }$
</div>

## MathML

<https://developer.mozilla.org/en-US/docs/Web/MathML>

```mathml
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mfrac>
    <mn>1</mn>
    <mrow>
      <mrow data-mjx-texclass="OPEN">
        <mo minsize="1.623em" maxsize="1.623em">(</mo>
      </mrow>
      <msqrt>
        <mi>&#x3D5;</mi>
        <msqrt>
          <mn>5</mn>
        </msqrt>
      </msqrt>
      <mo>&#x2212;</mo>
      <mi>&#x3D5;</mi>
      <mrow data-mjx-texclass="CLOSE">
        <mo minsize="1.623em" maxsize="1.623em">)</mo>
      </mrow>
      <msup>
        <mi>e</mi>
        <mrow data-mjx-texclass="ORD">
          <mfrac>
            <mn>2</mn>
            <mn>5</mn>
          </mfrac>
          <mi>&#x3C0;</mi>
        </mrow>
      </msup>
    </mrow>
  </mfrac>
  <mo>&#x2261;</mo>
  <mn>1</mn>
  <mo>+</mo>
  <mfrac>
    <msup>
      <mi>e</mi>
      <mrow data-mjx-texclass="ORD">
        <mo>&#x2212;</mo>
        <mn>2</mn>
        <mi>&#x3C0;</mi>
      </mrow>
    </msup>
    <mrow>
      <mn>1</mn>
      <mo>+</mo>
      <mfrac>
        <msup>
          <mi>e</mi>
          <mrow data-mjx-texclass="ORD">
            <mo>&#x2212;</mo>
            <mn>4</mn>
            <mi>&#x3C0;</mi>
          </mrow>
        </msup>
        <mrow>
          <mn>1</mn>
          <mo>+</mo>
          <mfrac>
            <msup>
              <mi>e</mi>
              <mrow data-mjx-texclass="ORD">
                <mo>&#x2212;</mo>
                <mn>6</mn>
                <mi>&#x3C0;</mi>
              </mrow>
            </msup>
            <mrow>
              <mn>1</mn>
              <mo>+</mo>
              <mfrac>
                <msup>
                  <mi>e</mi>
                  <mrow data-mjx-texclass="ORD">
                    <mo>&#x2212;</mo>
                    <mn>8</mn>
                    <mi>&#x3C0;</mi>
                  </mrow>
                </msup>
                <mrow>
                  <mn>1</mn>
                  <mo>+</mo>
                  <mo>&#x22EF;</mo>
                </mrow>
              </mfrac>
            </mrow>
          </mfrac>
        </mrow>
      </mfrac>
    </mrow>
  </mfrac>
</math>
```
