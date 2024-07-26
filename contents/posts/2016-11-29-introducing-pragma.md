---
legacy_slug: /2016/11/29/introducing-pragma
title: Introducing Pragma
published_at: 1480377600000
---

![Image 1: A raccoon, which is Pragma's mascot](/images/mascot.png)

I'm excited to share the details of my latest project - [Pragma](https://www.pragma.build/).

This is an idea that was brewing in my mind for many years. If you were following my work four years ago, you might remember [Punch](https://laktek.github.io/punch/). Pragma is an extension of Punch's vision, but with a completely rethought approach and execution.

![Image 2: Tap and hold to edit a component](/images/pragma-preview-1.gif)

### Static Pages FTW!

I still believe static pages are the faster, secure and most cost-effective way to publish content on the web. Except for few special cases, static pages work well for most personal and business publishing needs.

However, the tools for building and maintaining a static website sucks. Punch, Jekyll and all other fancy named static site generators are built for developers or tech-savvy people who are comfortable with CLIs. A site built using Punch will work well for a small startup where everyone knows how to code. It might actually seem pretty smart and efficient that you can update a site with a single git commit. But you will start to see the shortcomings when things grow. Marketing specialist wants to run a simple A/B test on site's hero text, VP of sales wants to add a script for a new analytics service. They have two choices - chase after an engineer to get this seemingly trivial tasks done or google some obscure npm / gem installation errors for the rest of the day!

### Sous Vide for Web

Pragma alleviates these kind of trivial issues. You just tap and hold a block to change it. Pragma will buffer all your changes and build the pages in background. It works well on mobile too.

So Pragma is similar to those "big name" website builders? (the ones you hear on every single podcast) This is how I see it. Using them is like eating from a fast food chain. Sometimes you need a quick fix, but doing it for long term will make you obesse (check out this [great talk](http://idlewords.com/talks/website_obesity.htm) by Maciej Cegłowski). On the other hand, using Pragma is like buying your own Sous Vide cooker. There will be bit of initial learning and setup, but you will have a repeatable process that can give you outputs of the same quality.

### What's the science behind this?

In my view, practical tasks involve in running a web site falls under 3 main processes.

1.  Design - setting the content strategy, brand and deriving patterns
2.  Content management - creating, editing, pruning, organizing of content
3.  Site ops - analytics & usage tracking, then optimizing & tuning (caching, compressing assets)

In reality, these tasks are kinda interleaved and feeds into each other. So it's hard to see them as separate processes. However, most of the currently available tools are built focusing only on one of the processes. This leads to work silos and co-ordination nightmares. There's always a hand-off mismatch from one tool to another.

Sometimes, we naively think this can be fixed at a programming language level rather than a domain level. That's how we ended up writing every piece we touch in JavaScript. This just adds salt to the wound!

### How Pragma works

I'll provide only a basic overview in this post, saving deep dives for future posts.

Pragma is built on 3 pillars - pages, components and integrations. A page is composed of components and integrations. It's a tree data structure defined in JSON. A typical page would look like this:

```json
{
  "metadata": {
    "cache": 600,
    "favicons": {...}
  },

  "contents": [
    { "type": "header", "contents": [
      { "type": "title", "contents": [
        {"type": "text", "contents": "My Site"}
      ] }
    ] },
  ... ],

  "integrations": [
    "set-headers", "google-analytics", "open-graph", "json-ld", ...
  ]
}
```

A component defines the look and the behaviour of a content-type. For example, a `title `component will contain the HTML, CSS and JS to render its content. I know components are a convoluted term these days. But Pragma's components are totally agnostic to client-side rendering frameworks. So a component is free to use React, Vue or vanilla js to set its behavior on the client.

The most important function of components is to provide a unified language to communicate between designers, developers and copy writers. When someone say `hero-button` it means the same thing to everyone.

Integrations are basically build time functions that have access to the processed pages (think of them as middleware in a server context). It can be used for site ops tasks like adding metadata or tracking analytics.

Pragma will provide a browser-based editor, an API and a CLI to create and manage pages, components and integrations.

![Image 3: You can edit a component in browser](/images/pragma-preview-2.gif)

We will start sending out invites for the early preview version soon. If this is something interesting to you, please [sign up for an early preview](https://www.pragma.build/). Your feedback will help us to verify our hypotheses and do further iterations.

Based on the early preview process, we will plan the public release. My current thinking is to provide a hosted solution and an open source version.
