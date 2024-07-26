---
title: What I learned building Page.REST
published_at: 1505260800000
---

Last week, I released [Page.REST](https://page.rest/) - an API to extract content from any web page as JSON. It got 10 paid users within the first 24 hours, and it was just an idea I scribbled on paper 7 days ago.

Here's why I built it and what I learned from it.

I left Atlassian a year ago to bootstrap Pragma Labs. We've been focusing on building a [modern CMS](https://pragma.build/) for web teams. While we had some early adopters, traction hasn't been great. We haven't found the right the product-market fit. The feeling of being distant from customers created an inertia to ship ("we need this one more thing").

I started to feel we need to shake up our mindset. We need to taste what's it like to have people paying us. I challenged myself to get a paid customer within the next 48 hours.

> For a batsman, a decent score - whether it be at club or first-class level - prior to an international series is crucial."
>
> Ian Chappell [#](http://www.espncricinfo.com/story/_/id/20553818/ian-chappell-why-australia-lost-mirpur)

During my time at Atlassian, there was a quarterly event called ShipIt - you drop whatever you're currently working on to ship an idea within 24 hours. I decided to try my version of ShipIt. Build something in 24 hours - then get someone to pay for it in next 24 hours.

![Image 1](/images/pagerest-idea-scribble.jpg)

### Find a Minimum Sellable Product

The challenge was to find an idea I can build in 24 hours that'd be enticing for someone to pay at first strike. I thought making a Slack or Trello integration would be a good bet. I knew a few people who had successes from them. However, browsing those marketplaces didn't instill much confidence. There were already a lot of integrations, and I didn't stumble on a good niche.

Then I reversed my thinking. If there are a lot of people building these bots, is there anything I can sell to them? I noticed most of these integrations rely on an existing web site as a data source. Public transport timetables, today's weather, package tracking, menus from local restaurants, dad jokes - all these were built on some existing web site, and most of these niche web sites didn't have public APIs.

My hypothesis was integration developers waste time reinventing the wheel on extracting content from a site. A solution to save time on this would trigger them to pay.

### Think like a consumer

If I followed my usual developer instincts I would have written an API to solve the problem, open source it on GitHub and put a Patreon page to accept donations. I would hope people to donate. Give up hopes after a week and move on to something else. Then in the future, when issues start to pile up I'd go to Twitter to rant about why open source model doesn't work.

Instead, I wanted to put myself in consumer's shoes. If I were the consumer what would I need?

*   I want to use this through an API.
*   I prefer to avoid the troubles of setting up and maintaining it myself.
*   Give me a playground to quickly test if the API works for my use case.
*   I don't want to do complicated authentication dance to access the API. Give me an access token I can include in API request.
*   Give me some expectation on uptime & availability (will this vanish tomorrow?)
*   It'd be good to have a code sample I can copy and modify
*   Is there a way to contact the developer and are they responsive?

Personally, I would've paid for such a service. I started to believe there should be at least few others out there who'd think like me.

### Avoid Rabbit Holes

When I started working on it, I thought I could use [Puppeteer](https://github.com/GoogleChrome/puppeteer), a library to control headless instance of Chrome. But I soon found out headless Chrome didn't work out of the box in cloud functions (Google Cloud Functions or AWS Lambda). I wanted to stick with cloud functions, so I don't have to setup infrastructure or worry about scaling & availability.

Instead of wasting time on trying to get Puppeteer to work, I decided to find an alternative solution. I decided [jsdom](https://github.com/tmpvar/jsdom) would be good enough for my need. It will not work for sites that use client-side rendering (a la React), but I decided not to worry about it until people complain (which is what I'm doing now since I got people willing to pay for it).

### Don't overthink pricing

After building the API, next challenge was figuring out how I should charge for it. If I can get people to pull out their credit cards after going through the landing page and playing with examples (that's like max 5-10 minute attention span), then this experiment would be a success.

Having a simple pricing model would make that decision easy. I chose to charge a one time fee in exchange for an access token (which has a generous validity period and a daily limit).

### Use early customers to find direction

As an early-stage idea, it was important to figure out how I can evolve it further and understand where the opportunities exist. Does my original hypothesis still hold?

One of the great things about having early customers is they can help you with figuring out this direction. I added [OpenGraph support](https://www.page.rest/#open-graph) after few early customers requested it. Also, I picked to work on parsing client-side rendered content next as it came up multiple times in feedback.

Also, I started to uncover some interesting niches from early customers. For example, I didn't know it'd be useful for academic research projects. I started using these insights to fine tune how I can reach more customers.

### Try multiple channels to get the word out

In the past, when I do such a side project I would just share it on some mainstream channels like Twitter and Hacker News. If I were lucky, it might get picked up by some influencer and get some viral traction.

However, this time I tried to experiment a bit with the distribution strategy. I plan this to be a continuous exercise which I would iterate based on learnings (currently I set aside 1 hour a day for Page.REST's distribution experiments).

Rather than going public first, I started promoting it on niche Slack and Facebook groups first. As I got positive signals, I moved to bigger channels like Hacker News and Reddit. Luckily it got picked up by HN audience and reached #10 on the homepage.

![Image 2: Page.REST at #10 on HN](/images/pagerest-hn.png)

In Reddit, it got some traction from [/r/sideproject](https://reddit.com/r/sideproject).

![Image 3: Page.REST as the top post on /r/sideproject](/images/pagerest-reddit.png)

My current focus is to find strategies to keep the stream flowing after the deluge.
