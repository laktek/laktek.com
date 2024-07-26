---
legacy_slug: /2012/11/26/a-fast-intuitive-blogging-tool-based-on-punch
layout: post
title: Punch based Boilerplate to Power Your Blog
published: true
tags:
- Punch
- Code
type: post
status: publish
published_at: 1353888000000
---

When I [first created Punch](http://www.laktek.com/2012/04/19/punch-a-fun-and-easy-way-to-build-modern-websites), I didn't intend it to be used as a blogging tool. This blog was running on Jekyll during that time and I was content with the setup. However, as I was switching back and forth between Punch based projects and this Jekyll based blog, it became apparent how Jekyll's workflow misses the simplicity and intuitiveness I have in Punch. So I wanted a Punch based extension for blogging.

I wrote a special [blog specific content handler](https://github.com/laktek/punch-blog-content-handler) which can be added to any Punch based site. It also preserves lot of Jekyll's conventions such as the post structure and permalinks. This makes transition of a blog from Jekyll to Punch really smooth.

Last week, I switched [this blog](http://laktek.com) from Jekyll to a Punch based setup. I'm happy how it turned out. Workflow of creating, previewing and publishing a post is now much faster and intuitive. You can check the [source code](https://github.com/laktek/laktek.com) of the project to get an idea how it is structured.

Since lot of you were [asking about the possibility](https://github.com/laktek/punch/issues/23) of using Punch to power a blog, I thought it would be useful to share my workflow with you. So I decided to release a [boilerplate](https://github.com/laktek/punch-blog) based on my setup, which you can use to create your own blog.

<figure>
<img src="/images/punch-blog-screenshot.png" alt="Intro Sscreen" class="portrait"/><br/>
<em>Screenshot of Punch Blog Boilerplate</em>
</figure>


Here are some of the cool features available in this boilerplate:

* Preview posts, as you write them.
* Easily publish to Amazon S3.
* Pretty URLs for permalinks (no .html, configurable).
* Responsive, customizable theme based on [HTML5Boilerplate](html5boilerplate.com) & [320andup framework](https://github.com/malarkey/320andup/).
* Load fonts from multiple sources with [WebFonts Loader](https://github.com/typekit/webfontloader).
* Easily configure Google Analytics, Tweet button & Disqus comments.
* Highlighting the current page link.
* Post archives by tags.
* Post archives by year, month or date.
* Write posts using GitHub flavored Markdown.
* Client-side code highlighting with Prism.js
* Published/draft states.
* Automatically minifies and bundles JavaScript/CSS.
* RSS feed
* Sitemap.xml

Also, you can use any other features available in Punch.

* Manage other pages with Punch's default content handler.
* Extend the behavior by writing your own helpers.

You can [download the boilerplate](https://github.com/laktek/punch-blog) from GitHub. After downloading it, follow the setup instructions specified in the README. It's very easy to customize and extend.

Feel free, to open a ticket in [GitHub issues](https://github.com/laktek/punch-blog/issues) if you run into any bugs.
