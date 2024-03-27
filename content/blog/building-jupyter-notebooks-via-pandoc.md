---
title: Building Jupyter Notebooks Via Pandoc
date: 2024-06-30
---

<https://pandoc.org/MANUAL.html#jupyter-notebooks>

```md
---
title: My notebook
jupyter:
  nbformat: 4
  nbformat_minor: 5
  kernelspec:
     display_name: Python 2
     language: python
     name: python2
  language_info:
     codemirror_mode:
       name: ipython
       version: 2
     file_extension: ".py"
     mimetype: "text/x-python"
     name: "python"
     nbconvert_exporter: "python"
     pygments_lexer: "ipython2"
     version: "2.7.15"
---

# Lorem ipsum

**Lorem ipsum** dolor sit amet, consectetur adipiscing elit. Nunc luctus
bibendum felis dictum sodales.

\``` code
print("hello")
\```

\## Pyout

\``` code
from IPython.display import HTML
HTML("""
<script>
console.log("hello");
</script>
<b>HTML</b>
""")
\```

\## Image

This image ![image](myimage.png) will be
included as a cell attachment.
If you want to add cell attributes, group cells differently, or add output to code cells, then you need to include divs to indicate the structure. You can use either fenced divs or native divs for this. Here is an example:

:::::: {.cell .markdown}
\# Lorem

**Lorem ipsum** dolor sit amet, consectetur adipiscing elit. Nunc luctus
bibendum felis dictum sodales.
::::::

:::::: {.cell .code execution_count=1}
\``` {.python}
print("hello")
\```

::: {.output .stream .stdout}
\```
hello
\```
:::
::::::

:::::: {.cell .code execution_count=2}
\``` {.python}
from IPython.display import HTML
HTML("""
<script>
console.log("hello");
</script>
<b>HTML</b>
""")
\```

::: {.output .execute_result execution_count=2}
\```{=html}
<script>
console.log("hello");
</script>
<b>HTML</b>
hello
\```
:::
::::::
```
