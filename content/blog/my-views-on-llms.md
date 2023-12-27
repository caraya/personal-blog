---
title: My Thoughts on AI - Where We Are and Where We're Going
date: 2024-06-30
draft: true
youtube: true
---

AI has become a hot topic button (again) and, I have to admit, I'm torn on the subject.

Part of me wants to leverage technologies like ChatGPT and Google Bard to make work easier and faster.

But another part of me wonders what are the long-term implications of AI, both legal and social, for multiple fields.

The starting point for this post is the CNBC article [In generative AI legal Wild West, the courtroom battles are just getting started](https://www.cnbc.com/2023/04/03/in-generative-ai-legal-wild-west-lawsuits-are-just-getting-started.html), other lawsuits related to LMMs and their associated copyright issues.

There are other considerations in addition to ownership of training data. I want to explore some of those considerations: job security, who does a better job, whether AI can do creative work as well as a human, what else can AI do, and what we can do with AI moving forward.

To get started, I thought it would be good to share two overviews of Generative AI

One, taken from the [MIT GenAI Summit](https://www.mitgenaisummit.com/).

<lite-youtube videoid="f5Cm68GzEDE"></lite-youtube>

Another one, taken from Google's Introduction to Generative AI course.

<lite-youtube videoid="G2fqAlgmoPo">
</lite-youtube>

## Job security

A central point of the WGA and SAG strikes against streamers like Netflix and TV and movie studios revolves around the use of AI in the writing process. We won't discuss the mechanics of the strike, the writing rooms and the need for strikes to move things forward. That happened and will have to run its course.

What we can discuss is whether AI writing will be of the same quality as human-produced writing and how AI affects production workflows moving forward.

[Do LLM's Truly "Create" Or Merely "Arrange": Just How Much Of An LLM's Writing Is Original?](https://blog.gdeltproject.org/do-llms-truly-create-or-merely-arrange-just-how-much-of-an-llms-writing-is-original/) presents one such comparison. In their analysis. How much of ChatGPT's content is original and how much of it is just rewording of existing content?

> To examine how much of this text overlaps with content that already exists on the web, we'll use a naïve LCS (longest common subsequence) approach, starting with the first word of the text and expanding into successively longer phrases for as long as we find a match on the web using Google's exact phrase matching capability. For example, we start with "caring", then "caring for" then "caring for peace" then "caring for peace lilies" then "caring for peace lilies requires", all of which return at least one Google search result, but when we get to "caring for peace lilies requires attention", Google reports 0 results, so we output "caring for peace lilies requires" as the longest phrase that overlaps with at least one page on the web and then repeat the process with "attention", then "attention to" then "attention to their" and so on. Note that we require an exact match such that a page with "do require attention" will not match "requires attention" and so on. Thus, the results below are a substantial undercount in that much longer clauses may exist on the web with just one or two word differences, while here we consider only exact matches.

So how do we vet LLM content and how do we ensure originality and accuracy without human intervention? This is one of the largest issues that I see. This is also why I don't see human programmers in any kind of danger of being replaced by AI.

We can also look at other professions where AI competes with trained human professionals.

Interpretation or simultaneous translation is an interesting use of LLMs. It presents challenges in accuracy, rhythm and timeliness.

Wired Magazine presented such a comparison. Human versus AI in different simultaneous translation use cases.

<lite-youtube videoid="pwOxlpGYJAY">
</lite-youtube>

### Can AI write (good) code?

Writing code is, in my opinion, one of the most challenging AI tasks.

[How to write better code with ChatGPT](https://bdtechtalks.com/2023/06/26/chatgpt-coding-tips/) presents some very interesting strategies for writing code with ChatGPT.

Use LLMs in areas where you're familiar with the subject so you can test the code and know whether it's going to work or not.

I tried to get ChatGPT to generate a Vue 3 component to paginate a WordPress application using the WordPress REST API.

The result I got from ChatGPT seemed to work after several prompt refinements but when applied to the application I built it for, it never worked as it was supposed to and I wasn't able figure out if the problem was with the code I got from ChatGPT, the quality of the prompts that I used to write the code or the fact that the training data used to train ChatGPT doesn't contain any material past the 2021 cutoff date and the code may have changed since then.

Writing code using LLMs is very dependent on how you craft your prompts. This is not intuitive and may require additional training. [Tips to enhance your prompt-engineering abilities](https://cloud.google.com/blog/products/application-development/five-best-practices-for-prompt-engineering) provide some good starting points.

This type of prompt engineering requires mastery of the target language or framework and the best techniques to craft prompts that produce the desired results.

But the reverse is also worth considering. What will it take to make your code easier for LLMs to extend and expand? Would it even be possible? How much will you need to change your coding habits to make your codebase work with LLMs?

[Coding LLMs are here to stay: Here’s how to write your code so that LLMs can extend it](https://grbsh.substack.com/p/coding-llms-are-here-to-stay-heres) presents a series of interesting ideas on how to write code that is easier for LLMs to extend and expand. It also presents an interesting question for people working with LLMs in their codebases:

> One obvious conclusion from this could be that the underlying tech (LLMs with coding abilities) simply isn’t there yet. But I’m not convinced. I’ve seen too many first hand examples of GPT-4’s superhuman coding abilities in ideal conditions. The problem: we’re not giving it ideal conditions.
>
> Imagine if you were given an average JIRA ticket specifying some task in a codebase for which you are completely unfamiliar. But instead of being given access to the codebase itself, you are provided only with the top 10-50 most “semantically relevant” blocks of code (each ~50 lines). Is it reasonable to expect you to be able to make the right changes to complete the task?

## Pitfalls of LLMS

Using the current crop of LLMs, like ChatGPT and Google Bard, has a variety of technical issues that may or may not apply to custom solutions. Some of these potential pitfalls

**They are non-deterministic**. They won't provide the same result when presented with the same prompt.

**They don't guarantee correct answers**. The answer may be completely incorrect, it may be slightly incorrect to the point where only an expert would know, or it may be a separate tangent, called a hallucination.

When I asked ChatGPT to create a Vue component it produced code that wasn't correct and I couldn't figure out why the code wouldn't work.

When writing prose, both ChatGPT and Bard give good results but it's impossible to tell if the material you get is original or if it copies someone else's work.

**The accuracy of LLMs is limited by their training data**. Like all AI models, LLMs are only as good as the data that you use to train them.

ChatGPT was trained on data from before 2021. The makers stopped training ChatGPT in 2021. This can be a problem if the data is not current with the newest versions of the technology you want to work with, or if the technology you want to use is newer than the training data set.

I haven't been able to find out if there is a cutoff date for Bard's training data and whether Google has incorporated search result data into Bard's training data set.

**Lack of transparency**. It is difficult, if not impossible, to get full citations of the works created by LLM prompts.

This presents a particularly important issue when dealing with writing prompts and producing results where original content is important.

In [ChatGPT's Work Lacks Transparency and That Is a Problem](https://www.rand.org/blog/2023/05/chatgpts-work-lacks-transparency-and-that-is-a-problem.html) the author points out some of these transparency problems.

Since we cannot review the sources that LLMs used in creating the content it returned it's impossible to measure the text accuracy and the sources' validity or how accurately the sources used in the LLM's response were.

They close the article by stating that:

> In a world with LLMs, there is a growing need for modernized data literacy. While basic numeracy is useful when reading statistical analysis, that is not sufficient to understanding how to treat outputs from LLMs and other modern AI. Developers need to be more transparent about their algorithms and data sources so that people can assess the inherent sources of bias or problems with the approach.
>
> Users of LLMs may find them to be a nice shortcut to drafting material, but should be wary of factual statements made and read with a careful and critical eye. While LLMs like ChatGPT have a lot of uses, providing deep commentary or useful policy analysis is not one of those uses, for now.
>
> Source: [ChatGPT's Work Lacks Transparency and That Is a Problem](https://www.rand.org/blog/2023/05/chatgpts-work-lacks-transparency-and-that-is-a-problem.html)

**Algorithmic biases**.

The fact that LLMs are created by humans makes it very likely that there are human biases introduced into the algorithms. I'm not saying that the biases are intentional but they are present and they must be addressed.

> In sectors as diverse as health care, criminal justice, and finance, algorithms are increasingly used to help make complex decisions that are otherwise troubled by human biases. Imagine criminal justice decisions made without race as a factor or hiring decisions made without gender preference. The upside of AI is clear: human decisionmakers are far from perfect, and algorithms hold great promise for improving the quality of decisions. But disturbing examples of algorithmic bias have come to light. Our own work has shown, for example, that a widely-used algorithm recommended less health care to Black patients despite greater health needs. In this case, a deeply biased algorithm reached massive scale without anyone catching it&mdash;not the makers of the algorithm, not the purchasers, not those affected, and not regulators.
>
> Source: [To stop algorithmic bias, we first have to define it](https://www.brookings.edu/articles/to-stop-algorithmic-bias-we-first-have-to-define-it/)

Identifying the biases in the algorithms is only the first step.

We need enforceable policies to address biases, data collection and ownership issues, and we're nowhere near such a solution yet.

[Algorithmic bias detection and mitigation: Best practices and policies to reduce consumer harms](https://www.brookings.edu/articles/algorithmic-bias-detection-and-mitigation-best-practices-and-policies-to-reduce-consumer-harms/) list several examples of real-world algorithmic biases and how they affect people who are already disenfranchised and marginalized.

[Challenging the Appearance of Machine Intelligence: Cognitive Bias in LLMs and Best Practices for Adoption](https://arxiv.org/abs/2304.01358v2) presents an additional 180 biases present in LLMs and proposes solutions to address these biases.

I will echo three of the recommendations from the paper:

**Best Practice #2: Individuals are accountable for how and when LLM outputs are used, as well as the intended and unintended consequences of that use**: Whenever we use a tool, we're responsible for how the tool is used. LLMs should be no different and people using them, particularly when the decisions made using them have real-world impact, should be held accountable for the results of their decisions.

**Best Practice #3: LLM users carry the onus of being knowledgeable and informed**: People using LLMs should be knowledgeable about the technology and its limitations. They should also be experts in the field where they are using LLMs.

**Best Practice #4: Individuals who employ LLMs in the workplace must be vigilant regarding threats**: The data that we feed into LLMs becomes part of the training data set and can be shared with users outside your organization.

This is a potential security risk and should be addressed within organizations with strong data security and data protection policies both extant and newly created to address LLMs.

**Data ownership is a concern**.
: One of the biggest unresolved issues with LLMs is data ownership. How are the LLM builders capturing the data that they use in training their models? How are they ensuring that the data they use is not commercially licensed or under a license that requires attribution or payment?

There is a wave of lawsuits regarding data ownership and how LLMs use the collected data.

[In generative AI legal Wild West, the courtroom battles are just getting started](https://www.cnbc.com/2023/04/03/in-generative-ai-legal-wild-west-lawsuits-are-just-getting-started.html) show some of the legal issues arising from LLMs and how the companies that create them collect data to train them.

Most of the LLM training data sets are created by scraping data from existing web sources. Scraping is not new and is something that data owners have had to fight against for years.

The scrappers for LLMs and their purpose were not known at the time so they would not be handled like other similar applications were at the time.

The emergence of commercial LLMs like ChatGPT and large-scale experiments like Google Bard have brought the issue to the forefront and have rekindled the debate on data ownership and how it is used.

This has led to several lawsuits against companies that created LLMs.

I've summarized some of the lawsuits related to LLMs and data ownership below.

[Getty Images sued the makers of Stable Difusion](https://www.theverge.com/2023/1/17/23558516/ai-art-copyright-stable-diffusion-getty-images-lawsuit)
: Stable Difussion is accused of crawling the entire Getty Images website, both free and paid content, to train their LLM without permission or paying a license fee.

[OpenAI’s regulatory troubles are only just beginning](https://www.theverge.com/2023/5/5/23709833/openai-chatgpt-gdpr-ai-regulation-europe-eu-italy)
: So far the problems with OpenAI's ChatGPT have been limited to the US but the EU is starting to take notice and they are not happy with the way OpenAI is using data to train ChatGPT.

[OpenAI sued for using everybody's writing to train AI](https://futurism.com/the-byte/openai-sued-train-ai)
: In the article, they mention that:
: > When Gordon Graham, a writer also known as That Whitepaper Guy, asked ChatGPT to define a whitepaper, he was struck by the similarities between the answer he got and the one he wrote on his website and contributed to Wikipedia. While the three-paragraph definition wasn’t verbatim, it was similar enough that he suspects the AI scraped it from one of those sources.
: Yes, the content on his site is copyrighted, but the content of Wikipedia pages is licensed under a more liberal license than the content on the author's website.
: According to the Wikipedia copyright page:
: > The text of Wikipedia is copyrighted (automatically, under the Berne Convention) by Wikipedia editors and contributors and is formally licensed to the public under one or several liberal licenses. Most of Wikipedia's text and many of its images are co-licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA) and the GNU Free Documentation License (GFDL) (unversioned, with no invariant sections, front-cover texts, or back-cover texts). Some text has been imported only under CC BY-SA and CC BY-SA-compatible license and cannot be reused under GFDL; such text will be identified on the page footer, in the page history, or on the discussion page of the article that utilizes the text. Every image has a description page that indicates the license under which it is released or, if it is non-free, the rationale under which it is used.
>
> Source: [Wikipedia:Copyrights](https://en.wikipedia.org/wiki/Wikipedia:Copyrights)
: If we look at the footer of the Wikipedia page for [Whitepaper](https://en.wikipedia.org/wiki/White_paper) we see that the page is licensed under the [Creative Commons Attribution-ShareAlike License](https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License).
: So, it's not a copyright violation. If anything, ChatGPT failed to properly attribute the content as required by the Creative Commons license. How will the courts see this difference is hard to tell but it's something worth keeping in mind.

['New York Times' considers legal action against OpenAI as copyright tensions swirl](https://www.npr.org/2023/08/16/1194202562/new-york-times-considers-legal-action-against-openai-as-copyright-tensions-swirl)

[Report: Potential NYT lawsuit could force OpenAI to wipe ChatGPT and start over](https://arstechnica.com/tech-policy/2023/08/report-potential-nyt-lawsuit-could-force-openai-to-wipe-chatgpt-and-start-over/)
: The New York Times is also considering a lawsuit against OpenAI as the licensing negotiations to include NYT content in ChatGPT's training data have stalled and may have broken down.
: A lawsuit from the Times against OpenAI would set up what could be the most high-profile legal case yet over copyright protection in the age of generative AI.
: If ChatGPT results include paragraphs created by LLMs based on existing content, the original site may see less traffic, with the corresponding drop in ad and subscription revenue.
: If OpenAI is found guilty of willful infringement, the penalties can increase to $150000 per offense (see [17 U.S. Code § 504](https://www.law.cornell.edu/uscode/text/17/504)), potentially running OpenAI to the ground

[Lawsuits accuse AI content creators of misusing copyrighted work](https://www.reuters.com/legal/transactional/lawsuits-accuse-ai-content-creators-misusing-copyrighted-work-2023-01-17/)
: According to the article " A group of visual artists has sued artificial intelligence companies Stability AI Ltd, Midjourney Inc, and DeviantArt Inc for copyright infringement, adding to a fast-emerging line of intellectual property disputes over AI-generated work".
: This is, again, a matter of data collection for LLM training and whether licensing is required


[Google hit with class-action lawsuit over AI data scrapping](https://www.reuters.com/legal/litigation/google-hit-with-class-action-lawsuit-over-ai-data-scraping-2023-07-11/)
: This seeks to blame Google for how people use the Internet. Google doesn't need to scrape data, most website owners submit information about their sites voluntarily for Google to use on their search engine so now flipping the script, they do a disservice to the Internet community.
: Another interesting aspect of these lawsuits is the same attorney who filed the lawsuit against Google, filled the lawsuit against OpenAI for using Internet data available to everyone to train ChatGPT.

## What else can AI do?

A lot of times I see AI used to represent LLMs and that is a dangerous misconception. LLMs is not the only field of AI that has been made public, it's the one that has been hyped the most recently.

Google (both before and after merging all AI research into Google DeepMind) created a number of AI products and services that, in my opinion, are more impressive and useful than LLMs.

These are not the only successful AI projects out there; There is equivalent research going on in AI at other companies and educational institutions... these are the more hyped, and successful, technologies I've seen as DeepMind seeks to build [artificial general intelligence](https://en.wikipedia.org/wiki/Artificial_general_intelligence).

And yes, I know that these AI applications are different than LLMs but they are successful and their training data sets don't require scraping the web and, potentially, acquiring Personally Identifiable Information (PII) and other sensitive data.

[AlphaGo](https://www.deepmind.com/research/highlighted-research/alphago) combines advanced search tree with deep neural networks. These neural networks take a description of the Go board as an input and process it through a number of different network layers containing millions of neuron-like connections.

One neural network, the “policy network”, selects the next move to play. The other neural network, the “value network”, predicts the winner of the game. AlphaGo used amateur human games as its starting point and then played against different versions of itself to improve its play.

In [March 2016](https://www.deepmind.com/research/highlighted-research/alphago/the-challenge-match) AlphaGo played against Lee Sedol, a Korean Go player and 18 time world champion. AlphaGo won the best of 5 series 4 to 1.

[AlphaGo Zero](https://www.deepmind.com/blog/alphago-zero-starting-from-scratch) is the next iteration of AlphaGo.

Instead of training from human games information, AlphaGo Zero learned to play by playing games against itself, starting from completely random play.

AlphaGo Zero played 100 games against the version that won against Lee Sedol and won 100 to 0.

[Alpha Zero](https://www.deepmind.com/blog/alphazero-shedding-new-light-on-chess-shogi-and-go), the next step in the evolution of AlphaGo. Rather than concentrating on Go, this iteration works with Go, Shoji (Chinese chess), and (Western) Chess without human input or training data.

[Mu Zero](https://www.deepmind.com/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules) mastered Go,  Chess, Shogi and Atari console games without needing to be told the rules.

[Alpha Fold](https://www.deepmind.com/research/highlighted-research/alphafold) predicts models of protein structures faster and more accurately. See also this [MIT Review](https://www.technologyreview.com/2022/02/23/1045016/ai-deepmind-demis-hassabis-alphafold/) article for a more detailed analysis if what is protein folding and the importance of tools like AlphaFold

[AlphaCode](https://www.deepmind.com/blog/competitive-programming-with-alphacode) is modified version of Alpha Zero designed for [competitive programming](https://usaco.guide/general/intro-cp?lang=py).

The final entry in the AlphaGo/Alpha Zero family is [AlphaTensor](https://www.deepmind.com/blog/discovering-novel-algorithms-with-alphatensor), described by DeepMind as **the first artificial intelligence (AI) system for discovering novel, efficient, and probably correct algorithms for fundamental tasks such as matrix multiplication.**

## Who owns the content on the web?

## AI: Where we are and were we're going

