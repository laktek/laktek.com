---
layout: post
title: SPDY for Rest of Us
published: true
tags:
- Code
type: post
status: publish
published_at: 1341878400000
---

There had been lot of buzz around SPDY lately, which is a brand new protocol introduced by Google to make the web faster. Most [major](http://hacks.mozilla.org/2012/02/spdy-brings-responsive-and-scalable-transport-to-firefox-11/) [browsers](http://dev.opera.com/articles/view/opera-spdy-build/) and [web servers](http://mailman.nginx.org/pipermail/nginx-devel/2012-June/002343.html) have begun to make releases with SPDY support. So I felt it's worthwhile to explore more about SPDY and how it matters to us as web developers.

### What is SPDY?

The concept of world-wide web was developed on top of the HTTP protocol. It's an application layer protocol that uses TCP as the transport layer (if this layered concept confuses you, read about the [OSI model](http://en.wikipedia.org/wiki/OSI_model) ). HTTP is stateless; which means for each request, client has to create a new connection with the server. Though it initially helped to keep things simple, it causes issues with current demands of the web.

SPDY is designed to address these shortcomings in the HTTP protocol. It uses a single connection for all request/response cycles between the client and server.

Core of SPDY is the framing layer which manages the connection between two end-points and the transferring of data. There can be multiple data streams between the two end-points. On top of the framing layer, SPDY implements the HTTP request/response semantics. This gives us the possibility to use SPDY to serve any existing web sites with little or no modification.

### What are the benefits of using SPDY?

* Since there's **no connection overhead** for each request, response latency would be low.

* Apart from the content body, SPDY also **compresses the request/response headers**. This will be useful on mobile and other slow connections, where every byte would count.

* The way SPDY is designed mandates to use SSL for all communications between client and server, which means the sites would be **more secure**.

* Rather than waiting till client initiate a request, server can push data to client with SPDY. This will help the sites to do **smart prefetching** of resources.

### Is it production ready?

Many Google's apps and [Twitter](https://twitter.com/raffi/status/177616491204714497/photo/1) already uses SPDY to serve their content. Amazon Silk browser is also [known to use SPDY](http://arstechnica.com/gadgets/2011/09/amazons-silk-web-browser-adds-new-twist-to-old-idea/) powered proxy.

<figure>
<img src="/images/chrome_spdy_inspector.png" alt="SPDY sessions in Chrome" class="portrait"/>
</figure>

Visit the following URL in Chrome, to see which sites are currently using SPDY.

```
	chrome://net-internals/#spdy
```

### How can I add SPDY support for my site?

Easiest way to add SPDY support is by enabling [mod_spdy](http://code.google.com/p/mod-spdy/) for Apache. Mod_spdy alters Apache's default request/response cycle via hooks and add SPDY handling.

Speed gains by switching to SPDY may vary depending on the existing configurations of your site. If you are using HTTP performance optimizations such as [wildcard asset hosts](http://api.rubyonrails.org/classes/ActionView/Helpers/AssetTagHelper.html) (ie. assets%d.example.com), that could cause SPDY to create multiple connections with the same end-point, thus reduce the efficiency. Some browsers like Chrome handles this smartly by [pooling the connections](https://groups.google.com/forum/#!msg/spdy-dev/UW0_X2GaMSQ/6sx-_So4aikJ). Also, CDNs such as Amazon Cloudfront still [doesn't support SPDY](https://forums.aws.amazon.com/message.jspa?messageID=346181), so those resources needs to be loaded using HTTP connections.

You can use a tool like [Chromium Page Benchmarker](http://www.chromium.org/developers/design-documents/extensions/how-the-extension-system-works/chrome-benchmarking-extension), to check how your site performs with and without SPDY under different configurations.

<figure>
<img src="/images/page_benchmarker.png" alt="Screenshot of Page Benchmarker" class="portrait"/>
</figure>

### Do I need to have a SSL certificate?

In the initial connection, `mod_spdy` uses SSL handshake and Next Protocol Negotiation (NPN) to notify SPDY availability to the client. Also, to work across existing HTTP proxies SPDY requires data streams to be tunneled through SSL. This means currently you will need to have a valid SSL certificate for your site to support SPDY.

However, it is possible to test SPDY locally without SSL. For this, you can run Chrome with the flag `--use-spdy=no-ssl` and you may use a SPDY server implementation that works without SSL.

### Does SPDY help in building real-time web apps?

It's worth noting that SPDY doesn't provide any special benefits for the use of [WebSockets](http://websocket.org/). Though, they might look similar in the higher level descriptions, they are totally independent protocols. They are created for different purposes and even the internal framing algorithms of the two are different.

On the other hand, SPDY's inherently asynchronous streams will help in implementing features such as [Server-Sent Events](http://dev.w3.org/html5/eventsource/).

### SPDY is not a silver bullet!

SPDY will continue to improve as a more stable protocol and with the time it will succeed the HTTP protocol. Unless you run a heavyweight site, there won't be any immediate effect by supporting SPDY to your conversions or cost savings.

So it's always better to start with the [general page optimization techniques](https://developers.google.com/speed/pagespeed/) and then consider SPDY if you still want to cut down those extra milliseconds.

### Further Reading:

* [SPDY White paper](http://www.chromium.org/spdy/spdy-whitepaper)
* [SPDY Protocol Spec (draft 3)](http://www.chromium.org/spdy/spdy-protocol/spdy-protocol-draft3)
* [Life beyond HTTP 1.1: Google's SPDY by Ilya Grigorik](http://www.igvita.com/2011/04/07/life-beyond-http-11-googles-spdy/)
* [SPDY: It's Here! by Roberto Peon (Google I/O talk)](https://developers.google.com/events/io/sessions/gooio2012/1201/)
