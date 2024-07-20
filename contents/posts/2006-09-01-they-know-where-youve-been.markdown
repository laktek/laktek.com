---
layout: post
title: They know where you've been......
published: true
meta:
  dsq_thread_id: "68172357"
tags:
- Code
- Web
type: post
status: publish
published_at: 1157068800000
---
I stumbled on this critical exploit (or rather smart technique) while I was visiting "<a href="http://www.schillmania.com/random/humour/web20awareness/">How Web2.0 - Aware are you ??</a>" They calculated a percentage based on the sites I have visited out of the 42 sites that were on their list. So how did they knew I visited these site ? Yeah they sniff my browser history !!

Actually this is a one lame example for practical usage of this new way of trackking users browser habits, which came into the play few days ago with <a href="http://jeremiahgrossman.blogspot.com/2006/08/i-know-where-youve-been.html">Jeremiah Grossman's</a> blog. However this<a href="http://forums.mozillazine.org/viewtopic.php?t=300080"> bug is tracked in Mozilla</a> before 4 years ago and kept there without getting caught to someone's eyes.

So how do they do it ? This hack is a combination of CSS with JavaScript. Remember there is CSS pseudoclass called a:visited, which makes visited links appear in a different colour (or style) ?  They use JavaScript to walk through set of hyperlinks and check whether the each link's style is matched with the a:visited's style. So making a large list of links which is hidden from user's screen is possible with this.
Using this technique, one could check whether you've come to their site after visiting their potential competitors and use that to provide better surfing experience. Some sources say this technique is already used by many e-commerce sites. But what if it's gone to the evil hands ? Online Blackmailing ??

So how could you get over this ? There are several ways One easyway is to set history remembering in the browser to 0 days. Also you could disable JavaScript in the browser so it will stop the execution of such script. Meanwhile I found two <a href="http://crypto.stanford.edu/sameorigin/">firefox extensions</a> that could be used to fix this issue.

P.S. - It seems like Opera browser doesn't get affected by this exploit.
