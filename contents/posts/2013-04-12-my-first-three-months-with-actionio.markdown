---
layout: post
title: My First Three Months with Nitrous.IO
published: true
tags:
- Muse
type: post
status: publish
published_at: 1365724800000
---

Last 3 months has been the most exciting and yet challenging period of my life. I migrated from Sri Lanka to Singapore to join with an early-stage startup called [Action.IO](https://action.io).

I first heard about Action.IO from [HackerNews](http://news.ycombinator.com), somewhere around last July. It got my immediate respect as an engineering startup emerging from Asia. Also, it was solving a real problem. I felt it could change the way we code, if executed well.

I got to meet [Arun and Pete](https://www.action.io/team), while I was in Singapore for [JSCamp.Asia](http://www.laktek.com/2012/12/04/jscamp-asia/). We had a casual chat over a breakfast, that spanned across [Asian folk stories](http://en.wikipedia.org/wiki/Ramayana) to [OT engines](http://en.wikipedia.org/wiki/Operational_transformation). After I moved back to Sri Lanka, we had some lengthy email conversations. As a result of it, I decided to move to Singapore to join with the Action.IO team.

Personally, I'm a big fan of resources and tools that make life easy for developers. It's those great contributions from others, that makes it possible for us to come up with more awesome creations. I always try to [contribute back](https://github.com/laktek) to this culture in little ways I can. I saw working with Action.IO, could give me the opportunity to do that in a broader and more focused manner.

###  Operates like an open source project

After first-day at work with Action.IO team I said to myself - "Wow! These guys are super smart!".

It was intimidating to work with such a smart and productive team. But during the next couple of weeks, I realized it's the process and the environment that creates the difference.

At Action.IO, nobody will tell you what to do and how you should do it. You have to manage yourself. Company's goals and current position is briefed weekly during a stand-up. Also, you will be given access to support channels, application logs and stats from the first-day itself. Based on these inputs, you will get an idea of what needs to be done and how important it is. When you stumble upon a feature idea or a bug, you create a story for that in Pivotal Tracker. It could be either be you or someone else in the team that gets it done.

At the start of each work day, you will glance through the pending tasks in the tracker and assign a task for you to work on. If a task could span more than a day, you should simplify it by breaking it into sub-tasks. This allows you to actually deliver something at the end of every day and have a good sleep.

### Pull-requests & Code reviews

For every task you work on, you should create a feature branch. Nobody commits directly to master (well, I did once). When you complete the task, you send a pull-request to merge your feature branch to master (We use GitHub private repos).

At this point, rest of the team will review your pull request and offer tips for improvement or discuss implications of the suggested implementation. Personally, these code reviews helped me to unlearn lot of bad practices and think thorough before arriving at a solution. These code reviews are highly subjective, so it's important not to entangle your ego with the code you wrote.

Also, at Action.IO there's a strong emphasize on test-driven development, documentation and managing a clean commit history. As a newcomer, these practices allowed me to get a better understanding of the previous decision making and acclimate with the code-base.

### Dogfooding

We use Action.IO to build Action.IO. This makes induction relatively frictionless. On the first day, I was given access to a dev box in the cloud, which was already configured with the tool chain. All I needed to do was move in my dotfiles and configure the SSH tunneling on my local machine. Such a bliss.

Action.IO's stack is built on top of many other Open Source tools and libraries. Philosophy here is to use the right tools to get things done faster. We've contributed back with improvements to many projects we use and also have [open-sourced](https://github.com/action-io) several components used in our stack.

### An office with "library rules"

Though, I had read about this on [37Signals blog](http://37signals.com/svn/posts/3357-an-office-with-ldquolibrary-rulesrdquo), I never thought this is something possible until coming to Action.IO office.

There's no cross-chats or disturbances during work periods. All communication happens through [HipChat](http://hipchat.com) (earlier we used Campfire), so if you don't want to get distracted you can turn off the notifications. We've hooks configured that notifies activities in Pivotal Tracker and GitHub to the room. This keeps everyone in the loop of what others are working on.

On most days, whole team goes out for lunch together (best thing about being in Singapore is the food!). These team lunches do get really noisy, with interesting arguments or just making fun of each other :)

Though there's so much activity in HipChat during the week, it goes insanely silent during the weekend. If you happen to login accidentally, you will find yourself alone in the room. Instead you're encouraged to step away from the screen and seek other hobbies/interests during the weekend.

### Connecting with other developers

What I love most about Action.IO is getting to connect with lot of other developers. As I said earlier, everyone in the team has access to support channels and everyone do support. Insights you gain from these chats are invaluable. You will learn different contexts, workflows and approaches used by others. And it's [flattering](http://twitter.com/tobi/status/316730719453986816) [to](http://twitter.com/soffes/status/301928923602747393) [hear](http://twitter.com/jonnymustcreate/status/322275903130435584) how others make use of it to do interesting stuff.

At Action.IO, I feel I'm improving myself as a developer, while helping others to improve themselves.

**PS:** Action.IO is always on the look for more passiontate people to join the team. If you're yearning for a challenge, you should [get in touch](http://action.io/jobs).

**Update (17 April 2013)**: Company was [rebranded to Nitrous.IO](http://techcrunch.com/2013/04/16/nitrous-io-seed-funding/) since this post.
