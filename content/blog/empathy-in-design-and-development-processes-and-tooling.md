---
title: "Empathy in Design and Development: Processes and Tooling"
date: "2017-10-11"
---

The final empathy area I want to discuss is process and tooling. Who are we doing this for and what tools we're using to develop

### Who?

There are three groups of people we should empathize with: Fellow team members, External developers who use our code and the end users of our product.

Our fellow team members are typically the smallest group (some times it's just us), but they are most affected by the code we write. Because we share the same context it's easier for us to write code that they can work with easily. If we miss the mark here they will most definitely grill us with feedback and suggestions for improvement. If it's just us we can certainly make the changes to improve the project.

External Developers build on top of the code and APIs we create. The typical example is a Javascript framework we create and they consume. We shouldn't assume that they know as much about our framework as we do. Instead of being having direct access to the Framework's developers for questions and feedback, this group often has our code and its supporting documentation to solve issues with our code.

The final group affected by our code is our end users. These are the people using applications that developers (internal or external) create. This is usually the largest group of people our code will affect, and they probably not developers and doesn't share many contexts with us. While we may never interact directly with end users, we need to consider how our code can help the integration of features, including – but not limited to – full accessibility and perceived performance.

So how do we walk in the shoes of each of these groups? I believe that the first part of the answer is communication both internally within the team and with external developers. How we document the code we write (both inline comments in the code and documentation outside the code itself) and the interfaces we provide to our libraries and APIs should be easy to understand and well documented without having to be a Javascript expert.

### Tool chains and tools

Another way to make things easier for developers and, eventually, end users is to provide good tooling for the tools you create.

One thing I've always loved about tools like NPM, Yeoman, Polymer CLI, Imagemin and other command line tools is that they are very clear in what they do and what they want the user to do to configure the project using the tool. They also give you ways to edit or overwrite the configuration files created in the CLI so you can change the way the tool behaves when it comes to building the application.

Make it as easy as possible for users who are using your tools. Provide documentation and remember that the user of your project may be you in six months and may not remember how you implemented it.
