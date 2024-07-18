--- 
layout: post
title: A Few cURL Tips for Daily Use 
published: true
tags: 
- Code 
type: post
status: publish
---

Though I knew cURL as a powerful tool; so far I never made an attempt to get familiar with it. Most of the time, I would just wade through its man pages to find a way get my stuff done. Recently I found myself make use of it for many of my daily tasks. By those excess usage, couple of recurring patterns emerged.

If you are already familiar with cURL, you may not find anything interesting or new here (but feel free to point out any improvements or other useful tips in comments).

### Resume failed downloads

cURL has this handy option (`-C` or `--continue-at`) to set a transfer offset, which helps to resume failed downloads. On most cases, setting the offset as a single dash, will let cURL to decide how to resume the download.

```bash
  curl -C - -L -O http://download.microsoft.com/download/B/7/2/B72085AE-0F04-4C6F-9182-BF1EE90F5273/Windows_7_IE9.part03.rar
```

It's a shame that I came to know about this very recently. I would now be cursing lot less at my ISP.

### Fetch request body from a file

Nowadays, most web service APIs demand request bodies to be formatted as JSON. Manually entering a JSON formatted string in command-line is not a very convenient option. Better way to do it would be to prepare the request body in a file and provide it to cURL.

Here's an example of creating a gist, providing the payload from a JSON file. 

```bash
  curl -d @input.json https://api.github.com/gists
```

Start the data parameter with a `@` to tell cURL, it should fetch the file in given path.

### Mimic AJAX requests

Sometimes I need create endpoints in web apps, that produces alternate responses when accessed via AJAX (eg. not rendering the layout). Testing them directly in browser is not much viable as it require bootstrapping code. Instead, we can mimic AJAX requests from cURL by providing `X-Requested-With` header.

```bash
  curl -H "X-Requested-With: XMLHttpRequest" https://example.com/path
```

### Store and Use Cookies

Another similar need is to test the behavior of cookies. Especially, when you want to alter a response depending on a cookie value.

You can use cURL to download the response cookies to a file and then use them on the subsequent requests. You can inspect the cookie file and even alter it to test the desired behavior.

```bash
  curl -L -c cookies.txt http://example.com 
  curl -L -b cookies.txt http://example.com
```

### View a web page as GoogleBot

When I was running this blog with Wordpress, Google marked it as a site infected with malware. Panicked, I visited the site and checked the source. I couldn't see anything suspicious. Later I discovered, the malware is only injected to the site only when it is accessed by the GoogleBot. So how do you see a site's output as GoogleBot?

cURL's option (`-A` or `--user-agent`) to change the user-agent of a request comes handy on such instances. Here's how you can impersonate GoogleBot:

```bash
  curl -L -A "Googlebot/2.1 (+http://www.google.com/bot.html)" http://example.com
```

### Peep into others' infrastructure

This is not exactly a cURL feature, but comes in handy when I want to find out what others' use to power their apps/sites.

```bash
  curl -s -L -I http://laktek.com | grep Server
```

Yes, now you know [this blog runs on AmazonS3](http://laktek.com/2011/11/17/why-and-how-i-revamped-my-blog) :).
