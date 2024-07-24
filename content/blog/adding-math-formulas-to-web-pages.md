---
title: Adding math formulas to web pages
date: 2024-07-31
tags:
  - Math
  - MathML
  - MathJax
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

Out of the three possible inputs, I think I'll stick with LaTeX for the input. I'll explain why when I discuss MathML later in the post.

### Using MathJax

Before we write LaTeX for use with MathJax, we need to configure and load the library.

The first script configures the library and it must be loaded before we load the library.

```html
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
```

The second script loads MathJax asynchronously and assigns an ID to the script so we can reference it later.

```html
<script id="MathJax-script"
  async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
</script>
```

Now that we have this setup, let's look at what we can do with MathJax. Whatever input we decide to use we should be at least somewhat familiar with the syntax to use. This is particularly because, while there are editors that will allow you to create inline and block equations, most of them are not WYSIWYG so you should have some familiarity with math formulas and with LaTeX way of laying them out for them to be useful.

This is an example of both inline and block equations in the same block.

The inline equations are surrounded by `\(\)`.

The good thing is that we only have to configure MathJax, load the script and enclose the equations in the appropriate characters

```html
<p>When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\)
  and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</p>
```

The code looks like this:

<p>When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</p>

### Block using MathJax

The LaTeX syntax is the same for inline and block elements. The block equations are enclosed in `$$` delimiters. MathJax will center the equation when it's declared as a block.

This example also uses CSS to control the size of the equation on screen.

```html
<div style="font-size:2rem;" class="math">
  $$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}
  -\phi\Bigr) e^{\frac25 \pi}} \equiv 1
  +\frac{e^{-2\pi}} {1+\frac{e^
  {-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac
  {e^{-8\pi}} {1+\cdots} } } }$$
</div>
```

The equation looks like this:

<div style="font-size:2rem;" class="math">$$\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}} -\phi\Bigr) e^{\frac25 \pi}} \equiv 1 +\frac{e^{-2\pi}} {1+\frac{e^ {-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac {e^{-8\pi}} {1+\cdots} } } }$$
</div>

MathJax provides a right-click context menu with MathJax functionality. This may not be ideal since it overrides the default context menu that may have necessary commands.

## MathML (Core)

Mathematical Markup Language (MathML) is an XML-based language for describing mathematical notation.

[MathML](https://w3c.github.io/mathml/) was originally designed as a general-purpose specification for browsers, office suites, computer algebra systems, EPUB readers, and LaTeX-based generators. However, this approach was not very adapted to the Web: the subset focusing on semantics has never been implemented in browsers while the subset focusing on math layout led to incomplete and inconsistent browser implementations.

[MathML Core](https://w3c.github.io/mathml-core/) is a subset with increased implementation details based on rules from LaTeX and the Open Font Format. It is tailored for browsers and designed specifically to work well with other web standards including HTML, CSS, DOM, and Javascript.

<https://developer.mozilla.org/en-US/docs/Web/MathML>

```mathml
<math class="math" display="block">
  <mstyle mathsize="2rem">
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
        <mrow>
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
            <mrow>
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
                <mrow>
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
                    <mrow>
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
  </mstyle>
</math>
```

<math class="math" display="block">
  <mstyle mathsize="2rem">
    <mfrac>
      <mn>1</mn>
      <mrow>
        <mrow>
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
        <mrow>
          <mo minsize="1.623em" maxsize="1.623em">)</mo>
        </mrow>
        <msup>
          <mi>e</mi>
          <mrow>
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
        <mrow>
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
            <mrow>
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
                <mrow>
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
                    <mrow>
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
  </mstyle>
</math>

The next example [derives the quadratic formula](https://developer.mozilla.org/en-US/docs/Web/MathML/Examples/Deriving_the_Quadratic_Formula) and is taken from MDN's [MathML examples](https://developer.mozilla.org/en-US/docs/Web/MathML/Examples/)

```html
<math display="block">
  <semantics>
    <mtable>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <mrow>
                  <mi>a</mi>
                  <mo>⁢<!-- INVISIBLE TIMES --></mo>
                  <msup>
                    <mi>x</mi>
                    <mn>2</mn>
                  </msup>
                </mrow>
                <mo>+</mo>
                <mi>b</mi>
                <mo>⁢<!-- INVISIBLE TIMES --></mo>
                <mi>x</mi>
              </mrow>
              <mo>+</mo>
              <mi>c</mi>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mn>0</mn>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mi>a</mi>
              <mo>⁢<!-- INVISIBLE TIMES --></mo>
              <msup>
                <mi>x</mi>
                <mn>2</mn>
              </msup>
            </mrow>
            <mo>+</mo>
            <mi>b</mi>
            <mo>⁢<!-- INVISIBLE TIMES --></mo>
            <mi>x</mi>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mo>−</mo>
          <mi>c</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <msup>
                <mi>x</mi>
                <mn>2</mn>
              </msup>
            </mrow>
            <mo>+</mo>
            <mfrac>
              <mi>b</mi>
              <mi>a</mi>
            </mfrac>
            <mo>⁤</mo>
            <mi>x</mi>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>c</mi>
            </mrow>
            <mi>a</mi>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Divide out leading coefficient.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <msup>
                  <mi>x</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mi>a</mi>
              </mfrac>
              <mo>⁤</mo>
              <mi>x</mi>
              <mo>+</mo>
              <msup>
                <mrow>
                  <mo>(</mo>
                  <mfrac>
                    <mrow>
                      <mi>b</mi>
                    </mrow>
                    <mrow>
                      <mn>2</mn>
                      <mi>a</mi>
                    </mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <mn>2</mn>
              </msup>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mrow>
            <mfrac>
              <mrow>
                <mo>−</mo>
                <mi>c</mi>
                <mo>(</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mo>)</mo>
              </mrow>
              <mrow>
                <mi>a</mi>
                <mo>(</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mo>)</mo>
              </mrow>
            </mfrac>
            <mo>+</mo>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </mrow>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Complete the square.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mo>(</mo>
              <mi>x</mi>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mrow>
                  <mn>2</mn>
                  <mi>a</mi>
                </mrow>
              </mfrac>
              <mo>)</mo>
              <mo>(</mo>
              <mi>x</mi>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mrow>
                  <mn>2</mn>
                  <mi>a</mi>
                </mrow>
              </mfrac>
              <mo>)</mo>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <msup>
                <mi>b</mi>
                <mn>2</mn>
              </msup>
              <mo>−</mo>
              <mn>4</mn>
              <mi>a</mi>
              <mi>c</mi>
            </mrow>
            <mrow>
              <mn>4</mn>
              <msup>
                <mi>a</mi>
                <mn>2</mn>
              </msup>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Discriminant revealed.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <msup>
                <mrow>
                  <mo>(</mo>
                  <mi>x</mi>
                  <mo>+</mo>
                  <mfrac>
                    <mrow>
                      <mi>b</mi>
                    </mrow>
                    <mrow>
                      <mn>2</mn>
                      <mi>a</mi>
                    </mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <mn>2</mn>
              </msup>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <msup>
                <mi>b</mi>
                <mn>2</mn>
              </msup>
              <mo>−</mo>
              <mn>4</mn>
              <mi>a</mi>
              <mi>c</mi>
            </mrow>
            <mrow>
              <mn>4</mn>
              <msup>
                <mi>a</mi>
                <mn>2</mn>
              </msup>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <mi>x</mi>
                <mo>+</mo>
                <mfrac>
                  <mrow>
                    <mi>b</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                    <mi>a</mi>
                  </mrow>
                </mfrac>
              </mrow>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <msqrt>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </msqrt>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>x</mi>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>b</mi>
            </mrow>
            <mrow>
              <mn>2</mn>
              <mi>a</mi>
            </mrow>
          </mfrac>
          <mo>±</mo>
          <mrow>
            <mo>{</mo>
            <mi>C</mi>
            <mo>}</mo>
          </mrow>
          <msqrt>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </msqrt>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">There's the vertex formula.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>x</mi>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>b</mi>
              <mo>±</mo>
              <mrow>
                <mo>{</mo>
                <mi>C</mi>
                <mo>}</mo>
              </mrow>
              <msqrt>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </msqrt>
            </mrow>
            <mrow>
              <mn>2</mn>
              <mi>a</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <annotation encoding="TeX">TODO</annotation>
  </semantics>
</math>
```

This is what the code looks like on the page:

<math display="block">
  <semantics>
    <mtable>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <mrow>
                  <mi>a</mi>
                  <mo>⁢<!-- INVISIBLE TIMES --></mo>
                  <msup>
                    <mi>x</mi>
                    <mn>2</mn>
                  </msup>
                </mrow>
                <mo>+</mo>
                <mi>b</mi>
                <mo>⁢<!-- INVISIBLE TIMES --></mo>
                <mi>x</mi>
              </mrow>
              <mo>+</mo>
              <mi>c</mi>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mn>0</mn>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mi>a</mi>
              <mo>⁢<!-- INVISIBLE TIMES --></mo>
              <msup>
                <mi>x</mi>
                <mn>2</mn>
              </msup>
            </mrow>
            <mo>+</mo>
            <mi>b</mi>
            <mo>⁢<!-- INVISIBLE TIMES --></mo>
            <mi>x</mi>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mo>−</mo>
          <mi>c</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <msup>
                <mi>x</mi>
                <mn>2</mn>
              </msup>
            </mrow>
            <mo>+</mo>
            <mfrac>
              <mi>b</mi>
              <mi>a</mi>
            </mfrac>
            <mo>⁤</mo>
            <mi>x</mi>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>c</mi>
            </mrow>
            <mi>a</mi>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Divide out leading coefficient.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <msup>
                  <mi>x</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mi>a</mi>
              </mfrac>
              <mo>⁤</mo>
              <mi>x</mi>
              <mo>+</mo>
              <msup>
                <mrow>
                  <mo>(</mo>
                  <mfrac>
                    <mrow>
                      <mi>b</mi>
                    </mrow>
                    <mrow>
                      <mn>2</mn>
                      <mi>a</mi>
                    </mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <mn>2</mn>
              </msup>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mrow>
            <mfrac>
              <mrow>
                <mo>−</mo>
                <mi>c</mi>
                <mo>(</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mo>)</mo>
              </mrow>
              <mrow>
                <mi>a</mi>
                <mo>(</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mo>)</mo>
              </mrow>
            </mfrac>
            <mo>+</mo>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </mrow>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Complete the square.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mo>(</mo>
              <mi>x</mi>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mrow>
                  <mn>2</mn>
                  <mi>a</mi>
                </mrow>
              </mfrac>
              <mo>)</mo>
              <mo>(</mo>
              <mi>x</mi>
              <mo>+</mo>
              <mfrac>
                <mrow>
                  <mi>b</mi>
                </mrow>
                <mrow>
                  <mn>2</mn>
                  <mi>a</mi>
                </mrow>
              </mfrac>
              <mo>)</mo>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <msup>
                <mi>b</mi>
                <mn>2</mn>
              </msup>
              <mo>−</mo>
              <mn>4</mn>
              <mi>a</mi>
              <mi>c</mi>
            </mrow>
            <mrow>
              <mn>4</mn>
              <msup>
                <mi>a</mi>
                <mn>2</mn>
              </msup>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">Discriminant revealed.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <msup>
                <mrow>
                  <mo>(</mo>
                  <mi>x</mi>
                  <mo>+</mo>
                  <mfrac>
                    <mrow>
                      <mi>b</mi>
                    </mrow>
                    <mrow>
                      <mn>2</mn>
                      <mi>a</mi>
                    </mrow>
                  </mfrac>
                  <mo>)</mo>
                </mrow>
                <mn>2</mn>
              </msup>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <msup>
                <mi>b</mi>
                <mn>2</mn>
              </msup>
              <mo>−</mo>
              <mn>4</mn>
              <mi>a</mi>
              <mi>c</mi>
            </mrow>
            <mrow>
              <mn>4</mn>
              <msup>
                <mi>a</mi>
                <mn>2</mn>
              </msup>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mrow>
            <mrow>
              <mrow>
                <mi>x</mi>
                <mo>+</mo>
                <mfrac>
                  <mrow>
                    <mi>b</mi>
                  </mrow>
                  <mrow>
                    <mn>2</mn>
                    <mi>a</mi>
                  </mrow>
                </mfrac>
              </mrow>
            </mrow>
          </mrow>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <msqrt>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </msqrt>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>x</mi>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>b</mi>
            </mrow>
            <mrow>
              <mn>2</mn>
              <mi>a</mi>
            </mrow>
          </mfrac>
          <mo>±</mo>
          <mrow>
            <mo>{</mo>
            <mi>C</mi>
            <mo>}</mo>
          </mrow>
          <msqrt>
            <mfrac>
              <mrow>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </mrow>
              <mrow>
                <mn>4</mn>
                <msup>
                  <mi>a</mi>
                  <mn>2</mn>
                </msup>
              </mrow>
            </mfrac>
          </msqrt>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;">There's the vertex formula.</mtext>
          </mrow>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>x</mi>
        </mtd>
        <mtd>
          <mo>=</mo>
        </mtd>
        <mtd>
          <mfrac>
            <mrow>
              <mo>−</mo>
              <mi>b</mi>
              <mo>±</mo>
              <mrow>
                <mo>{</mo>
                <mi>C</mi>
                <mo>}</mo>
              </mrow>
              <msqrt>
                <msup>
                  <mi>b</mi>
                  <mn>2</mn>
                </msup>
                <mo>−</mo>
                <mn>4</mn>
                <mi>a</mi>
                <mi>c</mi>
              </msqrt>
            </mrow>
            <mrow>
              <mn>2</mn>
              <mi>a</mi>
            </mrow>
          </mfrac>
        </mtd>
        <mtd>
          <mrow>
            <mtext style="color: red; font-size: 10pt;"></mtext>
          </mrow>
        </mtd>
      </mtr>
    </mtable>
    <annotation encoding="TeX">TODO</annotation>
  </semantics>
</math>

## Which one to use?
