---
title: "Improving performance of a WordPress site (1): Getting ready"
date: "2023-07-31"
---

Performance is important. Performance will keep people coming back to your site. Performance is very hard to get right, specially for mobile devices.

I'm particularly interested in seeing how my blog ([https://publishing-project.rivendellweb.net](https://publishing-project.rivendellweb.net)) does in mobile.

The first step is to check what the browser tells me:

Running [PageSpeed Insights](https://pagespeed.web.dev/) will produce both mobile and desktop reports. What I find most interesting is the differences between mobile and desktop and between runs on different browsers.

It also provides both the results of the [Chrome User Experience (CrUX)](https://developer.chrome.com/docs/crux/) for the site and the artificial results from Lighthouse.

Unfortunately, there is no CrUX data for my site on mobile devices (but there is a CrUX report for desktop that we'll cover later).

Rather than running the PageSpeed report on the browsers, I've chosen to run [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) from the command line hoping to get more consistent results.

I will also use [PageSpeed Insights](https://pagespeed.web.dev/) to compare with the results I get locally. I expect the PSI results to be worse.

## Preparing to run

Since I'll be using Lighthouse to measure performance

Both commands will run the same code.

We ask for reports in JSON and HTML (the default Lighthouse format)

the `--view` flag will open the default browser with the HTML report.

The `--output-path` is based on shell variables that I built to be able to run both commands at the same time.

The other parameter is the URL we want to run. We type that in the command line. If I were really lazy I would hardcode it into the commands.

```bash
lighthouse --formFactor mobile \
--output json \
--output html  \
--view \
--output-path lighthouse-reports/$outputString  $inputUrl
```

The only difference in the desktop command is the inclusion of `--screenEmulation.disable`. Without this parameter Lighthouse complains.

```bash
lighthouse --formFactor desktop \
--screenEmulation.disabled \
--output json \
--output html  \
--view --output-path lighthouse-reports/$outputString  $inputUrl
```

I've also built a Bash shell script to run both commands at the same time.

```bash
#!/usr/bin/env bash

# variables
formFactor=( "desktop" "mobile" )
inputUrl=$1
outputString=$(date +%Y%m%d-%H%M)


for i in "${formFactor[@]}"
do
  if [[ "${i}" == "desktop" ]]
  then
    echo 'running desktop code'
    lighthouse --formFactor desktop \ 
    --screenEmulation.disabled \ 
    --output json \ 
    --output html \ 
    --view \  --output-path lighthouse-reports/$outputString-desktop  \ 
    $inputUrl
  else  
    echo 'running mobile code'
    lighthouse --formFactor mobile \ 
    --output json \ --output html \  --view \ 
    --output-path \ 
    lighthouse-reports/$outputString-mobile \ 
    $inputUrl

  fi
done
```

## Methodology

Before we make any changes, we need to establish a baseline we can compare to after running any changes.

I ran two separate commands to test Lighthouse on mobile and desktop and I ran the PageSpeed Insights against the site.

After each run I've added a table with the results. The PWA section is pass/fail since it doesn't assign a numeric score.

I will repeat the tests after each change I make to see if they improve performance and, if so, by how much.

All these optimizations are done against a WordPress installation running pre-release code. It is possible that performance regressions were introduced during the WordPress development process.

Several of these optimizations require plugins, which introduce its own performance questions and challenges.

## Baseline Run

Now that we've decided what to do. Let's get started.

The baseline results look like this.

| Source | Form Factor | Performance | Best Practices | Accessibility | SEO | PWA |
| --- | --- | :-: | :-: | :-: | :-: | :-: |
| PSI | Mobile | 63 | 98 | 100 | 100 | N/A |
| PSI | Desktop | 94 | 98 | 100 | 100 | N/A |
| Node | Mobile | 79 | 98 | 100 | 100 | Pass |
| Node | Desktop | 56 | 72 | 100 | 100 | Pass |

I'm surprised at the differences in the results of running the tests in different environments. I would expect them to be more consistent
