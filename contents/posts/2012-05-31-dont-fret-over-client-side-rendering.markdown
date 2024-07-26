---
legacy_slug: /2012/05/31/dont-fret-over-client-side-rendering
layout: post
title: Don't Fret Over Client-Side Rendering
published: true
tags:
- JS
- Code
type: post
status: publish
published_at: 1338422400000
---

Twitter is [ditching client-side rendering and moving back to server-side](http://engineering.twitter.com/2012/05/improving-performance-on-twittercom.html). Does this mean client-side rendering is bad? Should we also move back to server-side? Well, it's insane to have <abbr title="fear, uncertainty and doubt">FUD</abbr> on client-side rendering just because it didn't work for Twitter (remember [*Rails can't scale*](http://techcrunch.com/2008/05/01/twitter-said-to-be-abandoning-ruby-on-rails/)?). Rather, make it a lesson on how to use client-side rendering sensibly.

> "In our fully client-side architecture, you don’t see anything until our JavaScript is downloaded and executed." <br/>
- <cite><a href="http://engineering.twitter.com/2012/05/improving-performance-on-twittercom.html">Twitter Engineering Blog</a></cite>

In an essence, this was the problem. When serving a web request, it's important to get the most essential information quickly before users' eyes. Best way to achieve this would be to identify and render the essential blocks in the server itself. You can then delegate the rest to be rendered on the client.

We take this approach for [CurdBee](http://curdbee.com). Screenshot below shows how CurdBee's Home screen is displayed on a slow connection or when JavaScript is disabled.

<figure>
<a href="http://demo.curdbee.com" target="_blank"><img src="/images/cb_home_screen.png" alt="screenshot of CurcBee home screen" class="portrait"/></a>
</figure>

On most instances, users come to Home screen only to proceed to another action such as create invoice or add time entry. By rendering navigation blocks on server, we allow them to do this action immediately. Since remaining blocks are also rendered progressively, users can start interacting without having to wait till everything is loaded.

We use a very simple client-side rendering logic. Templates and data(JSON) are fetched and rendered, only when they are actually needed on screen. There's no eager loading involved. This helps us to keep the bootstrapping JavaScript code to minimal, which loads and parses faster. Also, rendering happens asynchronously allowing us to progressively render the blocks. We use appropriate caching for the templates and data to make the responses fast.

So if used properly, client-side rendering can actually improve the overall user experience. Rather than trying to do everything in server-side or client-side, figure out how you can have the best in the both worlds.
