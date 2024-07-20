---
layout: post
title: Why and How I Revamped My Blog
published: true
tags:
- Code
- Life
type: post
status: publish
published_at: 1321488000000
---

**Update:** I've migrated this blog from Jekyll to Punch. Here's the detailed [blog post](http://www.laktek.com/2012/11/26/a-fast-intuitive-blogging-tool-based-on-punch).

If you are a regular visitor of my blog you will notice this has undergone a significant revamp (if you are new here, this looked similar to any other Wordpress blog). Actually, I've been working on this revamp for quite a some time and must say I'm really satisfied with the final outcome.

There were several main intentions behind this revamp. First one was to make it pleasurable to read on mobile. I tend to read a lot in mobile, but 99% of the sites I visit render as crap on mobile. Thanks to Readability bookmarklet or Instapaper I get to read them on mobile, but with limitations. With these services you loose the the engagement with the original site. Also, mobile readers tend to drop important bit of information such as code blocks, images and tables in the process of scraping. I wanted to make sure at least my blog can be read on mobile without using any additional steps or tools.

When I originally started this blog 5 years ago, it was powered by Wordpress and hosted on Dreamhost. This was pretty much the preferred setup during that time, but over the years it became too troublesome to maintain. Wordpress became constant target of attackers and there were important security releases almost every day. If you miss one, you are busted! Once I nearly got removed from the Google index thanks to such an attack. In Wordpress, even a simple template customization means you are diving in a pool of spaghetti soup. Apart from that, shared hosts like Dreamhost have become slow, inconvenient and simply worthless for what you pay. This setup was driving me crazy and wanted to get rid of it.

### Mobile First Design

Having worked a lot in backend and client-side scripting, this was my first attempt in designing an entire site with HTML5 and CSS3. Actually, thanks to the modern browser support frontend designing has become more interesting and fun. I actually managed to mock this layout entirely in HTML without even touching an image editor. Beauty of HTML mocks is they are interactive and you will always know how it will render in the browser.
<img src="/images/posts/blog_iphone_screenshot.png" title="How the new blog UI renders in iphone 3gs"/>

Since I want to make this optimized for mobiles, I started with a mobile first design. The process was immensely simplified thanks to ['HTML5 Boilerplate'](http://html5boilerplate.com/) and ['320 and Up'](http://stuffandnonsense.co.uk/projects/320andup/) responsive stylesheets. Mobile first design expects you to identify the most important elements of the UI and then extend them for the larger screens.

I used the _Voltaire_ as the typeface for main title and hand-drawn _Shadows Into Light_ was used as the typeface for sub title. Both of these fonts were freely available and was embedded using [Google Fonts](http://www.google.com/webfonts). Header background was spiced up with a CSS3 gradient (generated from [here](http://www.colorzilla.com/gradient-editor/)).

All icons used in this design are in SVG format. Advantage of using SVGs is they can be scaled according to the viewport. I found this really cool, especially when dealing with multiple resolutions. To get SVGs work across all browsers I load them via [RaphaelJS](http://raphaeljs.com). All icons used here are from [The Noun Project](http://thenounproject.com) collection and [Raphel icons](http://raphaeljs.com/icons/).

All posts in this blog follows the [semantical guideline provided by Readability](http://www.readability.com/publishers/guidelines/). It is based on the HTML5 elements and [hNews microformat](http://microformats.org/wiki/hnews).
<figure>
  <img src="/images/posts/blog_large_screen_screenshot.png" title="How the new blog UI renders in large screens"/>
  <figcaption>Homepage spreads to 3-columns in large screens</figcaption>
</figure>

### Powered by Jekyll

I prefer to use Vim for all my writing (from code to emails). I love how it let me keep the focus without getting into the flow. Also, I feel comfortable using Markdown for formatting than a WYSIWYG editor. Earlier, I used to draft my posts this way and paste them in Wordpress; but it would have been awesome if I could publish them directly from the command-line. [Jekyll](http://github.com/mojombo/jekyll), a static site generator by Tom Preston-Werner does exactly that.

Since Jekyll is based on Ruby and uses Liquid templating system, customizing and extending is also very easy. However, I didn't need to do much customizations to convert my existing Wordpress blog to Jekyll.

### Hosted in Amazon S3

As I mentioned before, I was fed up with dealing with shared hosts, yet I couldn't make up my mind to go for a VPS just to host a blog. With Jekyll, there's no server-side logic involved. The site is generated locally and what I needed was a place to host the HTML files and other static resources. Amazon S3 fits for this purpose beautifully. Converting any S3 bucket to serve a website is easy as ticking a box in AWS console (you can read more details on [AWS blog](http://aws.typepad.com/aws/2011/02/host-your-static-website-on-amazon-s3.html)).

I had to map the domain [laktek.com](http://laktek.com) to S3 endpoint with a CNAME record. One downside of this is you will loose the ability to maintain email addresses from this domain (a better way would have been to use a subdomain for the blog, but I had all my link juice from this domain).

Currently, I use the [Jekyll-S3](https://github.com/versapay/jekyll-s3) gem to push the generated site to the S3 bucket. Stil it doesn't have a mechanism to push only the updated files, but I'm hoping to have a better syncing strategy in future.

### Handling Dynamic Pages

In Wordpress there are dynamic index pages by dates (/2011/10) or tags (/tag/code). To have this behavior in Jekyll it seemed I need to generate static pages for each date or tag. I didn't like this idea, as it could make the building and deploying process even slower with all the additional pages. I was able to come up with a small hack to handle the dynamic pages.

In Amazon S3, you can specify an error page to display when it cannot find the given resource. I'm using the [archive page](http://laktek.com/archive) as the error endpoint, which renders a list of all the posts. Then with the help of a simple JS script, I filter the page to match the requested URL.

To get a better idea of what's happening here, try visiting following pages - <http://laktek.com/2009> or <http://laktek.com/tag/code>.

### Managing it from the Cloud

Most of the time, I do work and publish my blog posts from my local machine. But that doesn't mean I can use only the local machine to build my blog. I have a setup, which enables me to build it from any machine.

I keep the templates and generator in a [git repository](https://github.com/laktek/LakTEK-blog) and push the changes to GiHub (Yes, you can reuse the source, but don't just rip the site entirely). All the posts and sensitive configuration details are stored in Dropbox. If I can access these resources I can build my blog from any machine. In future, I'm planning to offload the entire build process to cloud by hiring Amazon EC2 Spot instances.

Also, I should mention about [Nocs](http://itunes.apple.com/us/app/id396073482?mt=8), a free iPhone app which I use to edit the posts in Dropbox with Markdown syntax. This is really convenient way to do quick edits to posts and jot down new ideas for future posts.
