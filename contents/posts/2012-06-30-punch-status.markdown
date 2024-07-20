---
layout: post
title: Punch Status - Instant Previews, Easy Publishing & More
published: true
tags:
- Punch
- Code
type: post
status: publish
published_at: 1341014400000
---

It's been 2 months since I [originally released Punch](http://laktek.com/2012/04/19/punch-a-fun-and-easy-way-to-build-modern-websites/). I was encouraged from the initial feedback it received and ben commiting most of my free time to improve it further. In the past two months, Punch made lot of progress and there were several nice features added to the project.

Punch focus on making a simple and better workflow to **create, preview and publish** websites. This new quick screencast will help you to get a better understanding on Punch's workflow:

<p class="skip-homepage">
<iframe src="http://player.vimeo.com/video/44990180?color=e13738" width="704" height="396" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
</p>

Here are some of the important features that were introduced recently.

### Instant Previews

Punch now ships with a built-in development server. This will re-generate the site before each page request, making it possible to preview changes in the browser instantly.

To start the server, run the following command in your site's directory:

```bash
	punch s
```

This will start a server listening to port 9009. If you want, you can provide an alternate port when starting the server.

```bash
	punch s 3000
```

### Easy Publishing

A site created with Punch is just a collection of static files. You can publish it by just copying the files to a web host. Now, Punch makes publishing process even more simple for you. All you need to do is run a single command (`punch p`) to publish your site. Punch can handle publishing to [Amazon S3](http://aws.typepad.com/aws/2011/02/host-your-static-website-on-amazon-s3.html) or any remote server that supports SFTP protocol.

To learn more details about publishing, check this [wiki article](https://github.com/laktek/punch/wiki/Publish-the-site).

### New Homepage & Boilerplate

Punch now boasts a [beautiful homepage](http://laktek.github.com/punch/), thanks to the great work done by [Collin Olan](https://github.com/collino). I hope the new homepage will add a positive vibe to the project.

Also, Collin created [Backfist](https://github.com/collino/backfist), a boilerplate to create sites with Punch. It's a good base for you to get started and learn the conventions of Punch.

### Guide Wiki

One of the common problems among most open source projects is outdated and scattered documentation (in blog posts, issue tickets, README, Wiki and even word of mouth). I thought it would be better if we set a convention early to avoid this happening to Punch.

So I created [Punch wiki](https://github.com/laktek/punch/wiki), which will serve as the official guide for the project.

### Future

I'm really happy the way project progrssed in its first two months. I've plans to make this even more awesome in the days to come. First step would be to get more people to try Punch and convince them to make it part of their toolbox.

So if you are already using Punch, spread the good about it to others. If you see any [issues and improvements](https://github.com/laktek/punch/issues), please feel free to report and help to get them fixed.

Remember, behind every successful open-source project is a great community!
