---
title: "The Unsuspected Casualty of the AI Copyright War"
date: 2026-07-03
---

The rise of AI has sparked a new wave of copyright battles, with publishers suing AI companies for using their content without permission. An unexpected casualty in this war is the Internet Archive's Wayback Machine, which has been systematically blocked by 241 news sites across nine countries since late 2025.[^1] This means that when a news article is edited after publication, there is no way to document those changes, erasing accountability and the historical record.

This post explores the implications of this development, why it matters, and what it reveals about the AI copyright debate.

## The Internet Archive and the Wayback Machine

For 30 years, the Internet Archive's Wayback Machine has preserved over one trillion web pages[^2]—a digital library of Alexandria for the modern web. Journalists use it to prove when articles were edited after publication. Courts cite it as evidence. Historians treat it as a primary source. Wikipedia alone links to 2.6 million archived news articles across 249 languages.[^2]

This is part of the larger mission of the Internet Archive: to preserve the public record in a rapidly changing digital landscape. The Archive's APIs allow researchers, journalists, legal professionals and yes, AI companies, to access this vast trove of information.

And this is the problem.

## The problem: AI, paywalls, and the backdoor vulnerability

Since late 2025, 241 news sites across nine countries have systematically blocked the Archive's crawlers[^1][^6]. The major publishers leading this charge all cite the same concern: generative AI companies use archived news content to train models without permission or payment.

To understand this escalation, we must look at the territorial war between AI data mining and publisher business models. Generative AI models require massive amounts of high-quality, structured, and fact-checked text to function effectively. Decades of professional journalism represent the perfect training data. As AI companies began aggressively scraping the web, news publishers realized their intellectual property was being ingested to build tools that could ultimately compete with them (such as "zero-click" AI search summaries).

In response, publishers weaponized their paywalls and updated their robots.txt files to block AI web crawlers. This defensive posture has resulted in varied, but increasingly strict, access models:

| Publication | Paywall Model | Archive Access and Limitations |
| --- | --- | --- |
| The New York Times | Strict, metered paywall | Severely restricts the historical archive. Subscribers receive 100 articles per month from 1923–1980; non-subscribers must purchase access. |
| USA Today | Hybrid paywall | Places "select" or "premium" stories, including older investigative or special reports, securely behind a subscription wall. |
| CNN | Metered paywall | Requires users to pay for access after reading a certain number of digital articles (introduced late 2024). |
| The Guardian | Free web/desktop, metered mobile | Maintains free access on its website and historical archive, but enforces a 20-article metered cap on its mobile app. |

## The open web as a perceived backdoor

Once publishers locked the front door, they grew concerned that AI companies would simply bypass these paywalls by harvesting data from free, open repositories.

Organizations like the Internet Archive exist to democratize information. However, because these platforms maintain publicly accessible APIs and hold billions of snapshots of historical, un-paywalled news pages, publishers began to view them as a massive vulnerability. From the publishers' perspective, even if an AI company respects a strict paywall on the primary site, it could theoretically scrape the Internet Archive's copy of that same publisher's content.

A 2023 Washington Post analysis confirmed that data from the Internet Archive had indeed appeared in major AI training datasets.[^1] For publishers already engaged in copyright lawsuits against OpenAI and Perplexity, the Archive became a glaring gap in their defenses. As a New York Times spokesperson put it: "The Times invests enormous resources in producing original journalism, and that work should not be used without our permission."[^1]

Blocking the Archive is the fastest tool available to publishers while lawsuits grind through the courts. It is a blunt instrument, but it works.[^5] And the trend is spreading well beyond the major mastheads: a thread in the Cloudflare community forum — where everyday site operators trade configuration tips — has become a practical how-to guide for blocking the Archive entirely, suggesting the impulse runs far deeper than any coordinated publisher strategy.[^7]

## The Archive's defense

The Internet Archive argues publishers are using them as a scapegoat—what director Mark Graham calls "collateral damage" in a war the Archive did not start.[^1][^3] The Archive notes that it has implemented significant controls to prevent abuse[^3], including:

* Rate limiting for bulk downloads.
* Monitoring to detect and block scraping patterns.
* APIs that the Archive itself controls and limits.
* Active dialogue with publishers on technical solutions.

The Archive's position is clear: they are a neutral preservation institution, not an AI training pipeline. If AI companies are abusing their platform, publishers should sue the AI companies—not the Archive.

The difficulty is that the abuse was real and measurable. Mark Graham confirmed to Wired that several AI companies had intermittently hit the Archive with tens of thousands of requests per second — temporarily overloading its servers.[^8] The Archive's open-internet ethos, embodied in its own motto — *"Like a paper library, we provide free access to researchers, historians, scholars, people with print disabilities, and the general public"* — made it structurally unprepared for that kind of assault. That tension between openness and abuse is precisely what publishers are exploiting, and what the Archive has not yet fully resolved.

## The legal front: Current publisher lawsuits

While publishers block the Archive as a stopgap measure, their primary battlefield is the court system. The organizations militarizing their paywalls have taken varied legal approaches against AI companies:

* **The New York Times**: Leading the legal charge, the Times has two major active lawsuits.
  * It [sued OpenAI and Microsoft](https://www.nytimes.com/2023/12/27/business/media/new-york-times-open-ai-microsoft-lawsuit.html) in late 2023 for using millions of articles to train ChatGPT without compensation.
  * In December 2025, it also sued Perplexity,[^4] alleging the AI search engine's retrieval-augmented generation (RAG) feature bypasses its paywall to steal content and deliver it to users in real time.
* **USA Today (Gannett)**: Gannett takes a multi-pronged approach.[^4] It is actively suing Google in an antitrust lawsuit that explicitly targets Google's AI Overviews, arguing the feature illegally scrapes copyrighted material to produce AI summaries that destroy publisher traffic. Simultaneously, USA Today hedged its bets by signing licensing agreements with other AI companies like Perplexity.
* **CNN and The Guardian**: While both publishers aggressively block AI web crawlers (such as OpenAI's GPTBot) and strictly enforce their paywalls, neither has formally filed a direct copyright lawsuit against an AI developer as of mid-2026. Instead, they rely on technical blocks while waiting for the precedent set by the Times and others.

## Why this matters: Collateral damage and the erasure of history

The immediate consequence is disturbing: when a news article stops being archived, it becomes editable without accountability. Publishers routinely change stories after publication &mdash; correcting errors, softening claims, or removing quotes. The Wayback Machine is a journalist's primary tool for documenting these edits. When major publishers block archiving, that accountability disappears.

But the deeper loss is to the historical record itself. Over 100 working journalists signed a petition[^1] describing the Wayback Machine as preserving "the public record at a time where many major media outlets are questioning whether to allow it to do so." USA Today Co.'s decision to block access has effectively removed hundreds of local newspapers from the historical record at a moment when local journalism is already collapsing.[^6] Articles that may not exist anywhere else are vanishing permanently. And as the Cloudflare forum thread illustrates,[^7] the Archive is now being treated as just another bot to firewall out — its 30-year mission to preserve the public web indistinguishable, in practice, from the scrapers publishers are actually trying to stop.

## The real lesson: The quiet contradiction

Interestingly, this dynamic highlights a profound irony. While publishers aggressively fight AI scraping to protect their paywalls, they simultaneously integrate AI into those same paywalls. Many news organizations now use AI-driven "dynamic paywalls," which analyze reader behavior and habits in real-time to determine exactly when a user is most likely to subscribe, dropping the paywall at the optimal psychological moment.

But dynamic paywalls are only the beginning. Each of the publishers blocking the Internet Archive has quietly built out AI operations of their own — in several cases powered by the very companies they are suing.

**The New York Times** developed an internal AI tool called "Patio," built on top of **OpenAI's GPT-4**, which lets reporters search decades of Times archives and surface relevant prior coverage. The Times is simultaneously suing OpenAI for training on those same archives without permission. Separately, the Times uses AI-assisted tools for headline optimization and SEO recommendations &mdash; again leveraging large language models &mdash; while arguing in court that LLM training on its content constitutes copyright infringement.

**USA Today / Gannett** went furthest and fastest. Beginning in 2023, Gannett rolled out AI-generated articles across hundreds of its local newspapers — sports recaps, real estate summaries, and earnings reports — using **Google's AI infrastructure**, the same Google it is now suing over AI Overviews. The automated articles, produced without human reporters, were initially published without clear disclosure, triggering significant backlash when the practice was uncovered. The contradiction runs even deeper: USA Today itself recently published a major investigative report on ICE detention policy that relied directly on the Wayback Machine to surface deleted government pages.[^8] The same organization that used the Archive as a journalism tool is now the one most aggressively blocking it.

**CNN** has been more guarded publicly, but internally has piloted AI tools for transcription, automated closed captioning, and video content tagging, largely built on **Google Cloud's AI services** (Vertex AI and Speech-to-Text). CNN is owned by Warner Bros. Discovery, which has broader enterprise agreements with Google Cloud — meaning the same infrastructure CNN uses daily is operated by the company whose AI products it criticizes for copyright overreach.

**The Guardian** has perhaps the most conspicuous contradiction. The outlet has published some of the most thoughtful editorial coverage of AI's risks to journalism and society, while internally building a tool that uses **machine learning models** (developed in-house, drawing on open-source LLM frameworks) to identify and resurface high-performing evergreen content for republication. The Guardian has also integrated AI-driven reader personalization into its (free) website, analyzing behavioral data to serve content it predicts will drive voluntary contributions from readers.

## Conclusion

This dispute reveals a structural problem in the AI copyright debate: the institutions designed to serve the public interest &mdash; digital libraries, open web standards, and public archives &mdash; are becoming the path of least resistance in the war between AI companies and publishers. As publishers and rights holders block direct scraping, the pressure accumulates on the public infrastructure they do not control.

The response to AI data scraping should not be collateral damage to the historical record. It should be direct legal action against AI companies &mdash; which publishers are already doing. But because waiting for courts feels too slow, publishers are taking the faster, blunter option: erasing 30 years of web history.

The question is not whether AI companies should face consequences for unauthorized training on copyrighted material.[^2] It is whether that fight should be won by sacrificing the public record entirely — and whether publishers who are simultaneously building on the very AI systems they condemn have the moral standing to make that call.

Martin Fehrensen, a German media journalist and founder of [socialmediawatchblog.de](https://socialmediawatchblog.de), frames the deeper structural failure plainly: "Web archiving has to be treated like public infrastructure, not as a single project by a San-Francisco-based NGO. The fact that, in 2026, it's still dependent on one single organization is the real structural failure."[^8] The current crisis is not just about AI copyright — it is about what happens when a critical piece of public information infrastructure is left exposed, underfunded, and dependent on the goodwill of the very institutions it holds accountable.

![XKCD Dependency Cartoon](https://imgs.xkcd.com/comics/dependency.png)

[^1]: [News publishers are blocking the Internet Archive's Wayback Machine to stop AI companies from using it](https://thenextweb.com/news/news-publishers-are-blocking-the-internet-archives-wayback-machine-to-stop-ai-companies-from-using-it) — The Next Web, May 1, 2026

[^2]: [Blocking the Internet Archive Won't Stop AI, But It Will Erase the Web's Historical Record](https://www.eff.org/deeplinks/2026/03/blocking-internet-archive-wont-stop-ai-it-will-erase-webs-historical-record) — Electronic Frontier Foundation, March 16, 2026

[^3]: [Preserving The Web Is Not The Problem. Losing It Is.](https://www.techdirt.com/2026/02/17/preserving-the-web-is-not-the-problem-losing-it-is/) — TechDirt (Mark Graham, Director of the Wayback Machine), February 17, 2026

[^4]: [News outlets like NYT and USA Today are blocking the Internet Archive's Wayback Machine to prevent AI training models from using their content](https://fortune.com/2026/04/15/why-is-internet-archive-wayback-machine-not-working-news-outlets-block-ai/) — Fortune, April 15, 2026

[^5]: [Why Major News Sites Are Blocking the Internet Archive's Wayback Machine](https://www.forbes.com/sites/anishasircar/2026/04/14/why-major-news-sites-are-blocking-the-internet-archives-wayback-machine/) — Forbes, April 14, 2026

[^6]: [The Internet's Most Powerful Archiving Tool Is in Mortal Peril](https://www.wired.com/story/the-internets-most-powerful-archiving-tool-is-in-mortal-peril/) — Wired, 2026

[^7]: [How to Block Archive.org](https://community.cloudflare.com/t/how-to-block-archive-org/29804/11) — Cloudflare Community

[^8]: [Digital memory at stake: Why news outlets block the Wayback Machine](https://www.dw.com/en/digital-memory-at-stake-why-news-outlets-block-the-wayback-machine/a-76887853) — Deutsche Welle, April 22, 2026
