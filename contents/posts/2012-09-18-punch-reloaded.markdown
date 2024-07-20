---
layout: post
title: Punch Reloaded
published: true
tags:
- Punch
- Code
type: post
status: publish
published_at: 1347926400000
---

Punch [started out](http://laktek.com/2012/04/19/punch-a-fun-and-easy-way-to-build-modern-websites) as a simple static site generator, which I wrote to use in my own work. After releasing to the public, it attracted bunch of passionate early adopters, who provided some valuable feedback on how to improve it. Their feedback gave me a better perspective of what people really expect from a modern-day web publishing tool.

So in last July, I took two weeks off from my day job, to create the initial prototype for a new Punch. Then for the next two months, I spent most of my early mornings and late nights turning this concept into a reality.

Today, I present you [Punch Reloaded](https://github.com/laktek/punch), which I deem as a **modern web publishing framework**.

### Everything is modular

Problem with the web development is everything change so fast. Devices change. Browsers change. Best Practices change. The tools we use, need to change as well.

However, this rapid pace of change is not just peculiar to web development. It's been a characteristic of the computing field from its inception. If there was a system, which understood and embraced this concept of rapid change, that was Unix. Unix's followed a modular design, which allowed it to evolve with the time and needs.

Punch was inspired a lot from this Unix philosophy. The framework is composed of small self-contained modules, that's been written to do only one particular task. You can take apart everything and put together the way you want. You can easily extend the default stack to support any template engine, parser or pre-compiler you want. You can define the way you want to handle the content and layouts. You can even embed Punch within a large application.

To learn more about the possibilities, refer the sections under _Customizing Punch_ in the [Punch Guide](https://github.com/laktek/punch/wiki).

### Power your site with any JSON backend

By default, Punch fetches content from JSON files stored in the local file system. However, with the new modular design, you can use any backend that supports JSON, to power your Punch sites. It could be a relational database such as [Postgre](http://www.postgresql.org/), a document store such as [Mongo](http://www.mongodb.org/), a third-party web service or even new backend service like [Firebase](http://www.firebase.com/).

Check out this [example app](https://github.com/laktek/favtweets), which uses the Twitter API as its backend. I plan to release plugins for several popular backends in the near future. If you are interested in writing your own content handler, [please check this article](https://github.com/laktek/punch/wiki/Writing-a-Custom-Content-Handler).

### Flexible, inheritable layouts

With most Content Management Systems you are stuck with a single layout for all pages in a site. But Punch makes it easy to use different layouts for different sections and pages in the site. Unlike in other frameworks, you need not to explicitly define the layout you want to use. Punch will intuitively fetch the matching layout for a page, based on the name and hierarchy.

Read [this article](https://github.com/laktek/punch/wiki/Templates), to learn more about the organization of layouts.

### Spice up the templates with helpers

Punch offers [built-in helpers](https://github.com/laktek/punch/wiki/Helpers) for common text, list and date/time operations. They are defined in a way that can be used with any template language.

What's more interesting would be the option to define your own custom helpers. Custom helpers do have the access to request context and can be used to enhance both response header (eg. Setting cookies) and the body. You can learn more details about writing custom helpers [from this article](https://github.com/laktek/punch/wiki/Writing-Custom-Helpers).

### Minify and bundle assets

In these days of mobile web, performance is a key factor for kind of web site. Minifing and bundling of JS/CSS assets are regarded as common best practices to increase the performance of a site. Apart from web app frameworks like Rails, most other site management workflows doesn't adopt such practices.

However, Punch offers a smart [workflow to minify and bundle](https://github.com/laktek/punch/wiki/Asset-Bundles) assets. So you can manage the front-end code, without giving up on the clarity or performance.

### CoffeeScript and LESS out of the box

With Punch, you can write [CoffeeScript](http://coffeescript.org/) and [LESS](http://lesscss.org/) as you would write regular JavaScript and CSS. Make the changes in the editor and just reload the browser to see the changes. Punch will do the compiling for you.

Check this screencast, to understand how smooth the flow is:

<p>
<iframe src="http://www.screenr.com/embed/5rJ8" width="650" height="396" frameborder="0"></iframe>
</p>

### Easy to get started!

Punch now comes with a default site structure and a hands-on tutorial to help you get started. Once you get acquainted, you can even use your own [boilerplates](https://github.com/laktek/punch/wiki/Creating-a-New-Site) to create new a site.

I have also rewritten the [Punch Guide](https://github.com/laktek/punch/wiki), to help you to peruse all the new features.

### Make it your own...

As I said before, you can extend Punch's default stack by writing plugins. It's possible to write wrappers to use any backend, template engine, parser, pre-compiler and minifier with Punch. Basically, you can use Punch as a glue code, to build your own framework.

[Reading the source](https://github.com/laktek/punch) is probably the best way to understand what happens [under the hood](https://github.com/laktek/punch/wiki/What-Happens-Under-the-Hood). Also, you can [refer the specs](https://github.com/laktek/punch/tree/master/spec) to get a better idea on the actual behavior.

Go, [Give it a try](https://github.com/laktek/punch) and create some kickass sites!
