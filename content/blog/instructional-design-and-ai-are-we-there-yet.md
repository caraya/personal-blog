---
title: "Instructional Design and AI: Are we there yet?"
date: 2026-07-15
tags:
  - Instructional Design
  - AI
  - Learning
---

One of the things that concerns me about the current state of AI in instructional design is that it often feels like a rehash of every technology hype cycle we've seen before. We get excited about the potential of a technology, we see some early successes, but then we hit a wall where the technology can't quite deliver on the promises. I worry that we might be in for a long period of disillusionment before we see any real breakthroughs.

This post is not meant to be a critique of AI in instructional design, but rather a reflection on the challenges we face in trying to integrate new technologies into our field. I think it's important to have realistic expectations about what AI can do and to be prepared for the fact that it might take a long time before we see any significant impact.

We will do this in two parts. The first part will be a look at what we do with AI in instructional design with prompts and examples. The second part will build an instructional design agent to remove repetitive tasks from our workflow and how can we use it to create better learning experiences.

## Problem Statement

The discipline of instructional design has always been enamored of new technologies. From the early days of radio and television to the rise of computers and the internet, instructional designers have been quick to adopt new tools in the hopes of improving learning outcomes. However, the reality is that many of these technologies have not lived up to their promises. We often find ourselves in a cycle of hype and disappointment, where we get excited about a new technology, only to find that it doesn't quite deliver on its potential.

My fear is that, without understanding the underlying technologies that drive AI and their limitations, we might be setting ourselves up for another round of disillusionment. We need to be cautious about how we integrate AI into our instructional design practices and be prepared for the fact that it might take a long time before we see any significant impact.

## The Hype Cycle of Instructional Design Technologies

Since 2000, we've see the rise of many different technologies for instructional design, including:

Artificial Intelligence (AI)
: Generative AI and machine learning now automate content creation (scripting, assessments) and power Adaptive Learning pathways that adjust difficulty based on real-time learner performance.

Augmented Reality (AR), Virtual Reality (VR), Extended Reality (XR)
: Virtual Reality provides risk-free simulations for hands-on fields like medicine
: Augmented Reality overlays 3D models onto physical environments for contextual learning.
: Both require expensive hardware and have struggled to achieve widespread adoption in education, with many institutions citing cost and technical challenges as barriers.

Second Life
: A virtual world platform that allowed users to create and interact in a 3D environment, used for immersive learning experiences.
: In the late 2000s, Second Life was touted as a revolutionary platform for education, enabling immersive virtual classrooms and simulations. However, it failed to gain widespread adoption due to technical limitations and lack of user engagement.
: Several hundred educational institutions continue to maintain a presence in Second Life, although this is a decrease from its peak in the late 2000s when over 800 institutions were active.
: Recent estimates and historical data indicate that while many organizations have migrated to newer virtual reality or video conferencing platforms, a core group of over 700 learning organizations globally still utilizes the platform for immersive 3D education.

The Gartner Hype Cycle shows how new technologies go through a predictable pattern of overhyped expectations followed by a period of disillusionment before they eventually find their place in the market, if they find their place in the market at all.

The steps are as follows:

1. Innovation trigger
2. Peak of inflated expectations
3. Trough of disillusionment
4. Slope of enlightenment
5. Plateau of productivity

In [The hidden curves of the Gartner hype cycle](https://beantin.net/the-hidden-curves-of-the-gartner-hype-cycle/), researcher James Royal-Lawson cites research from [The Economist](https://archive.ph/ibJZV), showing that "of the innovations that enter the trough of disillusionment, only 40% make it to the other side and up the slope of enlightenment to the plateau and widespread adoption. The other 60% fade away and never make it out."

![Gartner Hype Cycle](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/gartner-hype-cycle?_a=BAMAOGAa0)

So even if the technology is real and has potential, we get no guarantee that it will be adopted or that it will have significant impact on the field. This is why I think it's important to be cautious about how we integrate AI into our instructional design practices and to be prepared for the fact that it might take a long time before we see any significant impact, if we see impact at all.

To make this practical, we need to move from the pattern-level view (hype cycles) to a systems view of what today's AI stack is actually made of. Once those building blocks are clear, we can evaluate where each one helps instructional design and where each one introduces risk.

### The Different Types of AI

LLMs
: Large Language Models (LLMs) serve as the foundation for modern generative AI tools. They process vast amounts of text data to understand patterns and generate human-like language. In educational contexts, LLMs enable applications that can summarize texts, answer questions, and draft instructional content rapidly.

Prompts
: Prompts act as the explicit instructions provided to an AI model to guide its output. Effective prompt engineering requires clear, specific language and appropriate context to ensure the AI generates relevant and accurate materials for instructional use.

Agents
: AI agents function autonomously to perform specific, multi-step tasks. Instructional design agents handle repetitive workflows, such as formatting documents, curating resources, or providing continuous interactive feedback to learners through conversational interfaces.

This progression matters: LLMs provide raw capability, prompts shape that capability for a specific task, and agents orchestrate multiple tasks into a repeatable workflow. With that model in place, we can now look at concrete instructional design use cases.

## Challenges and Limitations of AI in Instructional Design

Governance
: Integrating AI into educational environments necessitates robust governance frameworks. Institutions must establish clear, transparent policies regarding AI usage, data privacy, and security to protect learners and ensure tools align with institutional standards.

Ethics
: Ethical AI deployment requires a commitment to transparency, accountability, and academic integrity. Instructional designers must evaluate the ethical implications of using AI, ensuring that these tools support equitable learning outcomes without compromising student privacy or promoting "cognitive surrender" (Shaw & Nave, 2026).

Bias in Training Data
: AI models train on massive datasets that frequently contain historical and societal biases. Without critical oversight, instructional designers risk inadvertently incorporating and perpetuating algorithmic bias within their learning materials, which can disproportionately impact marginalized learner populations (Rogers & Jonker, 2026).

Non-Deterministic Outputs
: LLMs are non-deterministic; they can produce entirely different responses to the exact same prompt. This unpredictability complicates the standardization of learning experiences and requires instructional designers to implement thorough validation processes to ensure consistency across different learner sessions.

Hallucinations
: AI systems occasionally generate fabricated or entirely false information, a phenomenon known as hallucination. Relying on AI without rigorous human fact-checking introduces critical errors into instructional materials, making continuous oversight essential.

Data Curation
: Leveraging AI effectively requires high-quality data curation practices. Institutions must carefully manage the data used to train and fine-tune localized AI models to guarantee the resulting tools reflect accurate, relevant, and secure educational information.

Source Material Collection
: AI assists instructional designers by rapidly searching and synthesizing source materials from vast information repositories. While this accelerates the initial research phase, designers must critically evaluate all selected sources for credibility, relevance, and accuracy before integrating them into a curriculum.

Transparency and Explainability
: Effective instructional design requires understanding the "why" behind an AI’s suggestion. Without transparency in how a model reaches a specific pedagogical recommendation, designers cannot verify if the output adheres to established learning sciences or if it is merely a statistical probability (Wynants et al., 2026).

Overreliance and Cognitive Surrender
: There is a growing concern regarding "cognitive surrender," where both designers and learners delegate critical thinking and problem-solving to the AI. This overreliance can lead to a degradation of original thought and a reduction in the designer’s ability to troubleshoot complex pedagogical challenges (Shaw & Nave, 2026).

Memory Constraints and State Persistence
: Current LLMs are largely stateless, meaning they have a finite "context window" and do not naturally possess long-term memory across different conversations. In instructional design, this leads to Context Drift, where the AI may forget initial project constraints—such as brand voice or specific learner prerequisites—as a session progresses. Designers must manually manage state or use external databases to maintain consistency across a multi-month development lifecycle.

### From Constraints to Practice

Taken together, these limitations do not mean AI is unusable. They mean AI must be treated as a supervised design collaborator, not an autonomous instructional decision-maker. In practice, that shifts the goal from "getting perfect output" to creating reliable workflows with clear constraints, verification steps, and pedagogical intent at every stage.

That is why the next section starts with concrete examples and prompting: this is where those constraints become operational.

## Part 1: Working With Prompts

### Examples of AI in Instructional Design

Content Creation
: AI streamlines content creation by rapidly generating text, audio, and video assets. Instructional designers use generative AI to draft course outlines, script multimedia elements, and design interactive scenarios, provided they rigorously review the outputs for pedagogical alignment and accuracy.

Adaptive Learning
: Adaptive learning systems employ AI algorithms to personalize educational pathways based on real-time learner performance data. These systems dynamically adjust the difficulty, sequence, and delivery of content to address individual knowledge gaps and help learners master concepts efficiently (Moskal et al., 2017).

Assessment Generation
: Generative AI tools accelerate the creation of quizzes, knowledge checks, and comprehensive assessments. Instructional designers leverage these capabilities to build diverse question pools quickly, though human review remains critical to ensure the questions accurately measure the intended learning objectives.

Intelligent Tutoring Systems
: Intelligent Tutoring Systems (ITS) simulate one-on-one human tutoring by providing personalized, step-by-step guidance. They analyze learner responses to identify misunderstandings and deliver targeted hints or resources to improve comprehension (Wong, 2023).

These examples show real momentum, but they also reveal why adoption can stall: each use case introduces governance, quality, and pedagogical tradeoffs that cannot be outsourced to the model. That tension is where most implementation efforts either mature or fail.

### The Pedagogy of the Prompt

Prompting is more than a technical query; it is a pedagogical bridge. In the context of instructional design, a prompt must translate a designer's intent into a format the model can execute accurately. This requires a deep understanding of tokenization (how the AI breaks down text) and context windows (the limit of information the AI can hold at once).

### Context Setting: Beyond Demographics

High-quality instructional output requires a multi-layered context that includes:

* **Target Learner Nuance**: Move beyond grade level to include neurodiversity considerations (e.g., ADHD-friendly formatting), prior knowledge state, and linguistic background.
* **Environmental Constraints**: Define where the learning happens (e.g., high-latency mobile environments vs. synchronous high-bandwidth classrooms).
* **Institutional Guardrails**: Incorporate specific rubric requirements (like Quality Matters) or accessibility standards (WCAG 2.1).

### Prompting as Baseline Inquiry

Most users begin by using prompts as simple questions or "zero-shot" requests (e.g., "Write a learning objective for a course on Python"). While this is a useful starting point for brainstorming, it often results in generic or pedantically weak content. Effective design requires moving toward "few-shot" prompting—providing the AI with 2-3 examples of what a "good" objective looks like before asking it to generate a new one.

#### Prompt Examples

**Example 1: The Basic Zero-Shot Prompt (What Most of Us Start With)**

> "Write three learning objectives for a course on Python programming."

This kind of prompt is fast and useful for ideation, but it usually produces generic output because it does not include learner context, constraints, or assessment intent.

**Example 2: The Context-Rich Objective Generator**

> "Act as a Senior Instructional Designer. I am building a module on 'Asynchronous Programming' for intermediate JavaScript developers. The learners are often working in distracting environments, so content must be concise. Using Merrill's Principles of Instruction, write three learning objectives that focus on application rather than recall. Ensure the tone is professional but encouraging."

**Example 3: The Assessment Rubric Validator**

> "I will provide a draft rubric for a final project on 'Database Design.' Analyze this rubric against the AAC&U Critical Thinking VALUE Rubric. Identify any gaps where the assessment fails to measure high-level synthesis, and suggest two specific criteria to add to bridge those gaps."

## Part 2: Moving to Agents: Systems of Orchestration

While prompts handle tasks, Agents handle workflows. An agent is a system that uses an LLM as its "reasoning engine" but is connected to external tools and memory.

### Orchestrating ADDIE and SAM

In a manual workflow, a designer might prompt the AI separately for the Analysis, Design, and Development phases. An agentic workflow automates this using a ReAct (Reason + Act) loop. The agent can:

* **Analyze**: Use a "Persona Tool" to generate learner profiles based on industry data.
* **Design**: Map those profiles to a SAM-style iterative sprint.
* **Develop**: Automatically generate the first draft of Module 1, then "reason" through a review against the project's initial constraints to ensure consistency.

### Evaluation with Kirkpatrick

Agents can be programmed to use the Kirkpatrick Model as an objective framework for the "Evaluate" phase. Instead of just generating a survey, an agent can be tasked to:

* **Level 1**: Analyze sentiment from "Reaction" data.
* **Level 2**: Cross-reference assessment scores with the initial learning objectives to identify "pedagogical drift."

## Conclusion: Are We There Yet?

Not yet, but we are no longer at zero.

AI is already useful for instructional design when we treat it as a constrained collaborator: strong context, explicit criteria, and human verification. The opportunity is real, but so are the limits. The teams that benefit most will be the ones that operationalize both sides at once, using prompts for precision and agents for orchestration while keeping pedagogy, ethics, and governance non-negotiable.

If the last decade taught us anything, it is that adoption follows disciplined practice more than technical novelty. In that sense, the question is less whether AI is ready in the abstract and more whether our design workflows are ready to use it responsibly.

## Links and References

* Adams, Richard. "[Ofsted Under Fire in Its Own Survey of Teachers' Wellbeing](https://www.theguardian.com/education/2019/jul/22/ofsted-teacher-wellbeing-survey-stress)". The Guardian, July 21, 2019.
* Adobe. "[How Artificial Intelligence Is Transforming the E-Learning Industry?](https://elearning.adobe.com/2021/12/how-artificial-intelligence-is-transforming-the-e-learning-industry/)". Virtual Reality (blog), December 29, 2021.
* Ali, Safinah Ali, Payne, Blakeley H., Williams, Randi, Park, Hae Won and Cynthia Breazeal. "[Constructionism, Ethics, and Creativity: Developing Primary and Middle School Artificial Intelligence Education](https://robots.media.mit.edu/wp-content/uploads/sites/7/2019/08/Constructionism__Ethics__and_Creativity.pdf)". MIT Media Lab, Accessed May 2026.
* Beetlestone, Mark. "[Integrating ChatGPT into Canvas as a Tool to Help Educators](https://community.canvaslms.com/t5/Canvas-Question-Forum/Integrating-ChatGPT-into-Canvas-as-a-tool-to-help-educators/m-p/552168)". Instructure Community (online forum), January 27, 2023.
* Daccord, Tom. "[Making Sense of AI & ChatGPT in Education](https://edtechteacher.org/making-sense-of-ai-chatgpt-in-education/)". The EdTech Teacher Blog, January 20, 2023.
* ELM Learning. "[Adaptive Learning vs. Personalized Learning: A Guide to Both](https://elmlearning.com/blog/personalized-learning-vs-adaptive-learning/)". ELM Learning, February 9, 2022.
* Etrellium. "[Gamification and AI - The Future Is Now](https://www.etrellium.com/ai/where-do-gamification-and-ai-converge/)". Thoughts on Tech and Business (blog). Accessed March 2023.
* Gilmore, Dawn, Anitra Nottingham, and Marcelo Zerwes. "[ChatGPT and Learning Design: What Online Content Creation Opportunities Does It Offer?](https://www.timeshighereducation.com/campus/chatgpt-and-learning-design-what-online-content-creation-opportunities-does-it-offer)". Times Higher Education, February 10, 2023.
* Green, Marcus. "[GenAI Use and Ethics Framework: A Pedagogical Model for Responsible AI Integration in K-12 and Higher Education](https://onlinelearningconsortium.org/olc-insights/2025/11/genai-use-and-ethics-framework/)". Online Learning Consortium, Accessed May 2026.
* Hai, Tran Trieu, Duong Thi Thuy Mai, and Nguyen Van Hanh. "[A Rapid Review of Using AI-Generated Instructional Videos in Higher Education](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1721093/full)". Frontiers in Computer Science, January 5, 2026.
* Karandish, David. "[7 Benefits of AI in Education](https://thejournal.com/articles/2021/06/23/7-benefits-of-ai-in-education.aspx)". THE Journal, June 23, 2021.
* Khandelwal, Mudit. "[AI Based Adaptive Learning](https://www.linkedin.com/pulse/ai-based-adaptive-learning-mudit-khandelwal/)". Pulse (blog), LinkedIn, May 30, 2022.
* Koval, Mari. "[Use Cases of Artificial Intelligence in E-Learning](https://www.analyticsvidhya.com/blog/2023/03/use-cases-of-artificial-intelligence-in-e-learning/)". Analytics Vidhya (blog), March 1, 2023.
* Luo, H., Tang, Y., & Sun, D. "[Assessing the Impact of AI-Driven Adaptive Learning on Student Engagement and Performance](https://dl.acm.org/doi/abs/10.1007/s10639-025-13646-x)". Education and Information Technologies, 2023.
* Margaret, Amelia. "[The Impact of Artificial Intelligence on eLearning](https://elearningindustry.com/the-impact-of-artificial-intelligence-on-elearning)". eLearning Industry, February 4, 2023.
* McKenzie, Lindsay. "[Edtech Companies Jump on the Generative AI Bandwagon](https://edscoop.com/edtech-companies-generative-ai/)". EdScoop, July 31, 2023.
* Media Justice. "[Greenlining Institute: Algorithmic Bias Explained – Q&A with Vinhcent Le](https://mediajustice.org/news/greenlining-institute-algorithmic-bias-explained-qa-with-vinhcent-le/)". Media Justice, Accessed May 2026
* Moskal, Patsy, Don Carter, and Dale Johnson. "[7 Things You Should Know About Adaptive Learning](https://library.educause.edu/resources/2017/1/7-things-you-should-know-about-adaptive-learning)". EDUCAUSE, January 4, 2017.
* O'Connell, A. J. "[Definitions of Adaptive vs. Personalized Learning](https://campustechnology.com/Articles/2016/12/20/The-Blurry-Definitions-of-Adaptive-vs-Personalized-Learning.aspx?Page=2)". Campus Technology, December 20, 2016.
* Office of Educational Technology. "[Artificial Intelligence in Education: Promises and Implications for Teaching and Learning](https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf)". U.S. Department of Education, May, 2023.
* Ouyang, Fan, et al. "[Integration of Artificial Intelligence, Performance Prediction, and Learning Analytics to Improve Student Learning in Online Engineering Course](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-022-00372-4)". International Journal of Educational Technology in Higher Education 20, no. 4 (January 2023).
* Qian, Yufeng, and Ragia Hassan. "[AI-Integrated Instructional Design in Higher Education: A Systematic Exploration of Tools, Roles, and Challenges](https://citejournal.org/volume-25/issue-4-25/general/ai-integrated-instructional-design-in-higher-education-a-systematic-exploration-of-tools-roles-and-challenges/)". Contemporary Issues in Technology and Teacher Education 25, no. 4.
* Rogers, Julie, and Jonker, Alexandra. "[What is data bias?](https://www.ibm.com/think/topics/data-bias)". IBM, Accessed May 2026.
* Rouhiainen, Lasse. "[How AI and Data Could Personalize Higher Education](https://hbr.org/2019/10/how-ai-and-data-could-personalize-higher-education)". Harvard Business Review, October 14, 2019.
* Shaw, Steven D. and Nave, Gideon. "[Thinking—Fast, Slow, and Artificial: How AI is Reshaping Human Reasoning and the Rise of Cognitive Surrender](https://doi.org/10.31234/osf.io/yk25n_v1)". The Wharton School Research Paper, January 11, 2026.
* Shift eLearning. "[How Artificial Intelligence Is Transforming the eLearning Industry](https://web.archive.org/web/20240620184818/https://www.shiftelearning.com/blog/artificial-intelligence-elearning)". eLearning Blog. Accessed March 2023.
* Slade, Tim. "[AI and Instructional Design: What We Got Wrong in 2025 (and What Needs to Change in 2026)](https://www.youtube.com/watch?v=IjOpEIHy0Mc)". YouTube video, 2026.
* Stanford Human-Centered Artificial Intelligence Institute. "[The 2026 AI Index Report](https://hai.stanford.edu/ai-index/2026-ai-index-report)". Stanford, CA, Accessed May 2026.
* Types Digital. "[Teaching With AI: A Revolution in Education or a Recipe for Cheating?](https://medium.com/@types24digital/teaching-with-ai-a-revolution-in-education-or-a-recipe-for-cheating-216c327c1763)". Types Digital (blog), Medium, Accessed May 2026.
* Wong, Carissa. "[What Is an AI Intelligent Tutoring System and Why You Should Use It](https://web.archive.org/web/20250307203523/https://www.noodlefactory.ai/blog/what-is-an-ai-intelligent-tutoring-system-and-why-you-should-use-it)". Intelligent Tutoring System (blog), Noodle Factory. Accessed May 2026.
* Wynants, S., Childers, G., De La Torre Roman, Y. , Budar-Turner, D., & Vasquez, P. "[ETHICAL Principles AI Framework for Higher Education](https://genai.calstate.edu/communities/faculty/ethical-and-responsible-use-ai/ethical-principles-ai-framework-higher-education)". CSU AI Commons, Accessed May 2026.

## Appendix: An Instructional Design Agent Prototype

The following prototype serves as a foundational orchestration agent, designed to operate within reasoning environments like Claude or GitHub CoPilot. It acts as the "system memory" for a project, maintaining high-level design goals and project state across a long-term development lifecycle.

Rather than pack every little possible detail into a single prompt—which would lead to degraded reasoning and loss of context—we created a set of auxiliary skills that the agent can call upon as needed. This modular approach keeps the core agent focused and high-performing.

In this prototype, ADDIE and SAM function as orchestration logic rather than as rigid scripts. ADDIE gives the agent a way to keep Analysis, Design, Development, Implementation support, and Evaluation aligned across a project, while SAM gives it a rhythm for iterative drafting, review, and revision. In other words, the agent does not replace instructional design frameworks; it uses them to decide which skill to invoke next, how to preserve alignment across outputs, and how to move from first draft to improved version without losing the larger pedagogical intent.

```markdown
---
name: senior-instructional-designer-orchestrator
description: "Expert senior instructional designer skilled in learning science, curriculum development, and adult pedagogy. Orchestrates end-to-end design lifecycles using frameworks like ADDIE, SAM, and Merrill’s First Principles. Trigger phrases: instructional design, curriculum development, learning science, andragogy, backward design, formative assessment, learning experience design."
---

# 🎓 Senior Instructional Designer — Orchestration

This agent is a concise orchestration role that coordinates reusable skills for designing comprehensive learning experiences. It specializes in learning science, needs analysis, and multi-mode instructional strategies. Use this agent to produce high-level plans and ensure alignment across objectives, activities, and assessments.

## Core Instructional Design Skills

- [Instructional Analysis](skills/instructional-analysis/SKILL.md#L1)
- [Objectives & Backward Design](skills/objectives-backward-design/SKILL.md#L1)
- [Assessment Design](skills/assessment-design/SKILL.md#L1)
- [Evaluation & Iteration](skills/evaluation-iteration/SKILL.md#L1)

## Delivery Mode Skills

**Critical**: Choose a delivery mode first, then tailor objectives and activities to that mode.

- [Delivery — Synchronous/Classroom](skills/delivery-classroom/SKILL.md#L1) — Instructor-led, live dynamics, group collaboration
- [Delivery — Workshop](skills/delivery-workshop/SKILL.md#L1) — Hands-on labs, guided practice, real-time coaching
- [Delivery — Self-Paced](skills/delivery-self-paced/SKILL.md#L1) — Asynchronous, autonomy-focused, spaced review

Usage: First call a **Delivery Mode** skill to understand constraints. Then invoke content design skills to build objectives, activities, and assessments aligned to that mode. Use this agent to stitch SKILL outputs into a curriculum plan, timeline, and implementation checklist.

## Example prompts

### Delivery Mode Selection
- "I'm designing a 4-hour session on change management for mid-level leaders. Should I use classroom or workshop? What are the design tradeoffs?"
- "Outline the motivation-maintenance strategy for a self-paced online course on financial literacy using `Delivery — Self-Paced`."

### Content Design
- "Run `Delivery — Classroom` + `Objectives & Backward Design` to design a 90-minute session on conflict resolution. Include pacing and engagement checkpoints."
- "Use `Assessment Design` to create a rubric for evaluating project submissions in a leadership capstone workshop."

### Full Curriculum Stitch
- "Create a hybrid 6-week program combining live webinars and self-paced modules for onboarding new managers. Use `Instructional Analysis`, `Objectives & Backward Design`, and both Delivery modes. Output: week-by-week curriculum breakdown."

---

## ⏱️ Learning Experience Design Principles

### The 5 Moments of Need (Gottfredson & Mosher)

| Moment | Learner State | Appropriate Support |
|--------|--------------|---------------------|
| **NEW** | Learning for first time | Formal instruction, structured curriculum |
| **MORE** | Expanding existing knowledge | Advanced courses, deep dives |
| **APPLY** | Trying to use on the job | Job aids, quick references, templates |
| **SOLVE** | Something has gone wrong | Troubleshooting guides, FAQs |
| **CHANGE** | Adapting to new approach | Change management, unlearning support |

### Emotional Design (Keller's ARCS Model)

| Component | Design Strategy |
|-----------|-----------------|
| **Attention** | Novelty, inquiry arousal, real-world problems |
| **Relevance** | Connect to goals, match learner profile, model utility |
| **Confidence** | Clear expectations, early wins, graduated challenge |
| **Satisfaction** | Natural consequences, recognition, positive outcomes |

### Microlearning & Spacing
- Use microlearning for discrete skills and just-in-time support.
- Implement spaced repetition intervals (1 day → 3 days → 1 week) for retention.

---

## 📊 Assessment & Metacognition

### Formative Assessment
- Integrate automated checks with immediate, specific feedback.
- Use low-stakes retrieval practice throughout every learning session.

### Authentic Assessment
- Design assessments with realistic contexts and constraints.
- Evaluate multi-step application over theoretical knowledge recall.

### Metacognitive Development
- Include reflective prompts (e.g., "What was the hardest part of this task?").
- Use self-assessment checkpoints to encourage self-regulated learning.

---

## ♿ Accessibility & Inclusion

- **Engagement**: Provide choice, autonomy, and relevant framing.
- **Representation**: Offer alternatives for visual/auditory information; support vocabulary and syntax.
- **Action & Expression**: Provide multiple media for response and scaffolded practice levels.

---

## 📋 Required Output Structure

1. **Learner Profile & Assumptions**: Context of use and likely knowledge gaps.
2. **Learning Objectives**: Measurable outcomes aligned to Bloom's levels.
3. **Needs Analysis**: The gap between current and desired performance.
4. **Instructional Strategy**: ADDIE/SAM phase and underlying pedagogy (e.g., Merrill).
5. **Instructional Activities**: Problem-centered framing and guided practice.
6. **Assessment Strategy**: Formative and summative alignment.
7. **Accessibility Notes**: UDL and neurodiversity considerations.

---

## ✅ Instructional Design Checklist

- [ ] Objectives, activities, and assessments are aligned (backward design).
- [ ] Merrill's First Principles are satisfied (Problem-centered, Activation, Demonstration).
- [ ] Cognitive load is appropriate; chunking strategies are applied.
- [ ] Expert-to-novice bridging has been verified (no skipped steps/jargon).
- [ ] Formative assessment is integrated throughout the session.
- [ ] UDL principles are applied for diverse learners.
```
