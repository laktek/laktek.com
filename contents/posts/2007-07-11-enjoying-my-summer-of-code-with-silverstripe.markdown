--- 
layout: post
title: Enjoying my Summer Of Code with SilverStripe
published: true
meta: 
  dsq_thread_id: "68172476"
tags: 
- GSOC 
type: post
status: publish
---
First of all, I beg your pardon for not updating you with my summer of code experiences as I promised. Once I get busy with coding I tend to forget all other <a href="http://www.catb.org/~esr/faqs/hacker-howto.html#respect3">essential stuff which needs to go along with hacking</a>. Yeah I know that's not a good practice as a FOSS developer and trying to get rid of that :)

Anyway I had a <a href="http://www.silverstripe.com/google-summer-of-code-fruit-1-flickrgallery/">very productive first half</a> with <a href="http://www.silverstripe.com">SilverStripe CMS</a> and it's a joy to see SilverStripe has already <a href="http://www.silverstripe.com/silverstripe-modules/">released</a> parts of my project as modules. Also it's been fun to work with such courteous and like-minded bunch of developers who were from all parts of the globe. Compared with other FOSS organizations, SilverStripe is very young and trendy organization which would make a big impact on FOSS world in the years to come. Thumbs up for Google for supporting such a budding up organization through GSOC, if not for GSOC I'll never know project called SilverStripe CMS & Framework exist.

So you'd be eager to know what I did with my project in last 1 1/2 months... If you recall the main objective of it was to provide mashup capabilities to SilverStripe CMS & Framework. I decided to achieve this by providing connections to web services via a RESTful interface. I prefer REST over RPC and I hope to talk about it in more depth in a separate post.

As a summary, these are the tasks I completed during the period :
<ol>
	<li>Created RestfulServices class which can be extended to support any Restful web service API. (<a href="http://doc.silverstripe.com/doku.php?id=restfulservice">more info</a>)</li>
	<li>Built FlickrService API extending RestfulServices. (<a href="http://doc.silverstripe.com/doku.php?id=flickrservice">more info</a>)</li>
	<li>Created FlickrGallery controller, a page type users could add to their SilverStripe CMS to display set of Flickr photos as a gallery. (<a href="http://demo.silverstripe.com/gallery/">see the demo</a>)

Interesting thing about this is users could add this functionality completely using the WYSIWYG editor without requiring to write a single line of code (How's that sound ? :) )</li>
</ol>
One of the complaints I got from my friends when I suggested them SilverStripe CMS was the lack of ready-made themes for it. Yeah, you get the default yet spiffy <a href="http://www.silverstripe.com/blackcandy/">BlackCandy</a>, but people just love to see more options. So to fill  that vacuum for some extent I created the <a href="http://www.web2media.net/sstheme/">PaddyGreen</a> theme, which I would release in the next few days. I wanted to make it trendy, simple and customizable, but there is still room for improvement. This is not part of my GSOC proposal it's just a pet project.

What I've mentioned is just a tip of an iceberg, there are even more cool and great stuff to be released in the next few months to come from myself and my fellow GSOCers. So if you are in search of a user-friendly CMS or framework for your next project consider SilverStripe as well :)
