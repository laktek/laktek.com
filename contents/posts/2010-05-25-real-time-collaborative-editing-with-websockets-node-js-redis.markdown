--- 
layout: post
title: Real-time Collaborative Editing with Web Sockets, Node.js &amp; Redis
published: true
meta: 
  dsq_thread_id: ""
  _edit_last: "1"
  _edit_lock: "1274832567"
tags: 
- Code
- FOSS
- JS
- Realie
type: post
status: publish
---
Few months ago, I mentioned I'm developing a real-time collaborative code editor (codenamed as Realie) for my individual research project in the university. Since then I did couple of posts on the <a href="http://www.web2media.net/laktek/2010/02/11/realie-project-data-structure-storage/">design decisions</a> and <a href="http://www.web2media.net/laktek/2010/02/16/building-real-time-web-apps-with-rails3/">on technologies</a> I experimented for the project. After some excessive hacking, today I've got something tangible to share with you.

<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0' width='560' height='345'><param name='movie' value='http://screenr.com/Content/assets/screenr_1116090935.swf' /><param name='flashvars' value='i=73493' /><param name='allowFullScreen' value='true' /><embed src='http://screenr.com/Content/assets/screenr_1116090935.swf' flashvars='i=73493' allowFullScreen='true' width='560' height='345' pluginspage='http://www.macromedia.com/go/getflashplayer'></embed></object>

Currently, I have implemented the essentials for real-time collaboration including ability watch who else is editing the file, view others edits, chat with the other collaborators and replay how the edits were done. You may think this is more or less similar to what <a href="http://etherpad.com" target="_blank">Etherpad</a> had - yes, it is! However, this is only the first part of the project and the final goal would be to extend this to a collaborative code editor (with syntax highlighting, SCM integration).

<h3>Web Sockets</h3>

The major difference of Realie from other Real-time collaborative editors (i.e. Etherpad, Google Docs & Wave) is it uses web sockets for communication between client and server. Web Sockets perfectly suit for cases like this, where we need to have asynchronous, full-duplex connections. Compared to alternatives such as long-polling or comet, web sockets are really efficient and reliable.

In traditional HTTP messages, every message needs to be sent with HTTP headers. With web sockets, once a handshake is done between client and server, messages can be sent back and forth with a minimal overhead. This greatly reduces the bandwidth usage, thus improves the performance. Since there is an open connection, server can reliably send updates to client as soon as they become available (no client polling is required). All this makes the app truly real-time.

As of now, only browser to implement web sockets is Google Chrome. However, I hope other browsers would soon catch up and Mozilla has already shown <a href="http://hacks.mozilla.org/2010/04/websockets-in-firefox/" target="_blank">hints for support</a>. There are also <a href="http://github.com/gimite/web-socket-js">Flash based workarounds</a> for other browsers. For now, I decided to stick with the standard web socket API.

<h3>Taking Diffs and Applying Patches</h3>

In case if you wonder, this is how the real-time collaboration is done:
<ol>
	<li> when one user makes a change; a diff will be created for his change and sent to server.</li>
	<li> Then the server posts this diff to other connected collaborators of the pad.</li>
	<li> When a user receives a diff, his content will be patched with the update.</li>
</ol>

So both taking diffs and applying patches gets executed on the client side. Handling these two actions on browser was made trivial thanks to this <a href="http://code.google.com/p/google-diff-match-patch/">comprehensive library</a> written by Neil Fraser.

However, on some occasions these two actions needs to be executed concurrently. We know by default client-side scripts get executed in a single thread. This makes execution synchronous and slow. As a solution to this I tried using the <a href="http://www.whatwg.org/specs/web-workers/current-work/" target="_blank">Web Workers API</a> in HTML5 (this is implemented in WebKit & Mozilla). Separate worker scripts were used for taking diffs and applying patches. The jobs were passed on to this worker scripts from the main script and the results were passed back to main script after execution was complete. Not only this made the things fast, but also more organized.

<h3>Node.js for Backend Servers</h3>

Initially, I started off the server implementation in Ruby (and Rails). Ruby happend to be my de-facto choice as it was my favorite language and I had enough competency with it. However, soon I was started feeling Ruby was not the ideal match for such asynchronous application. With EventMachine it was possible to take the things to a certain extent. Yet, most of the Ruby libraries were written in a synchronous manner (including Rails), which didn't help the cause. As an alternative, I started to play with <a href="http://nodejs.org">Node.js</a> and soon felt `this is the tool for the job`. It brings the JavaScript's familiar event-driven model to server, making things very flexible. On the other hand, Google's V8 JavaScript engine turned out to be really fast. I decided to ditch the Ruby based implementation and  fully use Node.js for the backend system.

Backend is consist of two parts. One for serving normal HTTP requests and other for web socket requests. For serving HTTP requests, I used Node.js based web framework called <a href="http://expressjs.com" target="_blank">Express</a>. It followed the same ideology as Sinatra, so it was very easy to adapt.

Web socket server was implemented based on the recently written <a href="http://github.com/miksago/node-websocket-server" target="_blank">web socket server module for Node.js</a> by Micheil Smith. If you are interested to learn more about Node.js' web socket server implementation please see my <a href="http://www.web2media.net/laktek/2010/05/04/implementing-web-socket-servers-with-node-js/">earlier post</a>.

<h3>Message delivery with Redis Pub/Sub</h3>

On each pad, there are different types of messages that users send on different events. These messages needs to be propagated correctly to other users.

Mainly following messages needs to be sent:
<ul>
	<li>When a user joins a pad</li>
	<li>When a user leaves a pad</li>
	<li>When a user sends a diff</li>
	<li>When a user sends a chat message</li>
</ul>

For handling the message delivery, I used Redis' newly introduced <a href="http://code.google.com/p/redis/wiki/PublishSubscribe" target="_blank">pub/sub implementation</a>. Every time a user is connected (i.e. visits a pad) there would be two redis client instances initiated for him. One client is used for publishing his messages, while other will be used to listen to incoming messages from subscribed channels.

<h3>Redis as a persistent store</h3>

Not only for message handling, I also use Redis as the persistent data store of the application. As a key-value store Redis can provide fast in-memory data access. Also, it will write data to disk on a given interval (also, there is a much safer Append only mode, which will write every change to disk). This mechanism is invaluable for this sort of application where both fast access and integrity of the data matters.

Another advantage of using Redis is the support for different data types. In Realie, the snapshots are stored as strings. The diffs, chat messages and users for a pad are stored as lists.

There is a well written <a href="http://github.com/fictorial/redis-node-client" target="_blank">redis client for Node.js</a> which makes the above tasks really simple.

<h3>Try it out!</h3>

I'm still in the process of setting up an online demo of the app. Meanwhile, you can checkout the code and try to run the app locally.

Here is the link to GitHub page of the project - [http://github.com/laktek/realie](http://github.com/laktek/realie)

Please raise your ideas, suggestions and questions in the comments below. Also, let me know if you are interested to contribute to this project (this project is open source).
