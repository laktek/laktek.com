--- 
layout: post
title: Punch - A Fun and Easy Way to Build Modern Websites 
published: true
tags: 
- Code 
- JS 
- Punch
type: post
status: publish
---

Few months ago, [I switched this blog](http://laktek.com/2011/11/17/why-and-how-i-revamped-my-blog) from Wordpress to Jekyll. I love how Jekyll allows me to prepare everything locally and simply publish when it's ready. There's no server-side logic involved, which means I can host the whole blog in a S3 bucket. Also, there's no more worries on mundane issues like security, performance or database corruptions.

I wanted to have this freedom and control in any site that I would create and manage. Actually, most websites can be thought as static sites. They may contain few bits and pieces that needs to be rendered dynamically. The rise of modern browsers means we can pass this concern to the client-side. 

However, websites have different requirements from a blog. It contains different pages carrying unique presentation along with few reusable blocks (for example, take a look at [different](http://37signals.com/about) [pages](http://37signals.com/speaks) in [37Signals site](http://37signals.com) ). A page will not contain just a title and block of text, but composed of different types of content such as lists, images, videos, slides and maps. Also, a modern website often needs to be A/B tested and translated in to other languages. Even though, we use can use blog engines like Jekyll (or Wordpress) I felt there's still a void for a tool tailored to create and manage websites.

That's why I created [Punch](http://laktek.github.com/punch).

### What is Punch?

Aim of Punch is to help anyone to build (and maintain) modern websites using only HTML, CSS and JavaScript. Punch is largely inspired from Jekyll, but it's not a blog engine. It's intuitive to use and easy to extend.

Punch is written with [Node.js](http://nodejs.org) and will work with your local file system. Currently, Punch renders template files written in [Mustache](http://mustache.github.com/). It expects content to be available in JSON format. Punch can also parse content in [Markdown](daringfireball.net/projects/markdown/) format.

To generate a site, templates and contents should be available in two directories. For each Mustache template found in the `templates` directory, Punch will look for relevant content in the `contents` directory. Contents should be presented in a JSON file having the same name as the template. Alternatively, you can create a directory with the same name as template to store multiple JSON and Markdown files. Punch will save the rendered file in the output directory. Any other files(HTML, images, JS, CSS, etc.) and directories under `templates` will be copied to the output directory without any modification.

### How to Use

Here's a quick screencast on how to use Punch.

<iframe src="http://player.vimeo.com/video/40645795?title=0&amp;byline=0&amp;portrait=0" width="704" height="396" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

For more details on installation and usage, please refer the [README](https://github.com/laktek/punch/blob/master/README.md) and the [User Guide](http://laktek.github.com/punch/user_guide.html). 

### Easy Client-side Rendering

As I mentioned earlier, we can render any dynamic blocks in a site on the client-side. Since Punch is written in JavaScript, we can easily use its renderer on client-side as well. You can see this feature is used in the [Punch's homepage](http://laktek.github.com/punch) to render the "GitHub Watchers" block.

To use the renderer, you must include [Mustache.js](https://github.com/janl/mustache.js/) and Punch's Mustache renderer in the HTML page.

```markup
  <script type="text/javascript" src="assets/mustache.js"></script>
  <script type="text/javascript" src="node_modules/punch/lib/renderers/mustache.js"></script>
```

Then you have to initate a new instance of `MustacheRenderer` and provide the template, content and any partials you need to render. Since Punch's renderer works asynchronously it can be used reliably in contexts which involves AJAX content fetching. You can see below, how I pass the JSON response from the GitHub API and template fragment to the renderer to render the GitHub Watchers block. We must also provide a callback function to execute after rendering is done.

```javascript
  // Load and Render GitHub followers
  (function(){
    if($("#github_followers").length > 0){
      var renderer = new MustacheRenderer();

      renderer.afterRender = function(output){
        $("#github_followers").html(output);
      };

      renderer.setTemplate('{{#followers}} \
                            <a href="http://github.com/{{login}}" rel="nofollow"><img size="16" src="{{avatar_url}}" title="{{login}}" alt="{{login}}"/></a> \
                            {{/followers}} \
                          ');
      renderer.setPartials({});

      $.getJSON("https://api.github.com/repos/laktek/punch/watchers", function(data){
        renderer.setContent({"followers": data});
      });
    }
  })();
```

### Start Playing! 

I have been already using Punch to create few personal sites and just finished porting [CurdBee's public site](http://curdbee.com) to Punch. Every time I used Punch it has been a pleasant experience and I feel I have the freedom and control to create sites the way I want. I hope most of you will start to feel the same with Punch.  Also, I have plans to support features such as browser-based content editing and easy publishing options, which could make Punch more awesome. 

Go [install it](http://laktek.github.com/punch), build nice sites, spread the word and [send me pull requests!](http://github.com/laktek/punch)!
