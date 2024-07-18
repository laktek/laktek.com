--- 
layout: post
title: "Realie Project: Data Structure &amp; Storage"
published: true
meta: 
  dsq_thread_id: "68172809"
  _edit_last: "1"
  _edit_lock: "1265954934"
tags: 
- Code
- Realie
- Ruby
type: post
status: publish
---
Last couple of days, I found some time to work on my individual research project for the degree course. The topic area I selected for my project was on "<a href="http://www.readwriteweb.com/archives/introduction_to_the_real_time_web.php" target="_blank">Real-time Web</a>". Real-time Web is just the opposite of the current way we use the web. Rather than we checking (polling) content providers for updates, content providers will feed (push) us with the updates. This concept is getting rapid adoption and I believe it would be the de-facto behaviour of the web in couple of years.

The application I decided to build was a code editor based with real-time collaboration capabilities. Following the hacking traditions and for the ease of remembrance, this project was code named "Realie" (it was the zillionth time the name was changed and hope it would stick this time).

Rather than developing the project behind closed doors and finally presenting a thesis (which would be utterly boring), I thought of building the project in open, by sharing the code and discussing design decisions with the community. I believe what it really matters is the experience and knowledge I could gather from this, rather than the final grade I would get for this.

So lets start by looking at the initial data structure and storage decisions.

<h3>What is Realie?</h3>

Most of you may have heard or already using <a href="http://www.google.com/wave" target="_blank">Google Wave</a> & <a href="http://www.etherpad.com" target="_blank">Etherpad</a>. Realie also got inspired from those two projects. While, Google Wave & Etherpad are known to be real-time collaborative editors(or canvases) for general public, with Realie we try to cater the niche of hackers & developers. As we know development process is already a collaborative process, which involves lot of real-time communication & decision making. As developers we know this process is not seamless and painstaking. This is the void which Realie tries fill.

Putting it to simple terms, Realie would be like pastie or gist where multiple people could view and edit at the same time. There would be more other jazzy features in the project, but this would be the essence of it. Imagine how such a tool would make your remote pair-programming, code reviewing & brainstorming sessions a breeze?

<h3>Starting from the scratch</h3>

As I was starting the project, Google acquired Etherpad and that action made Etherpad to release their code as open-source. Though, it sounded a perfect opportunity for me to fork their code and get my project done, I decided to start from the scratch. Etherpad is a grown project and they have already made certain design decisions. Adopting from them, wouldn't help me to gain any experiences on the implications of designing a real-time system or to explore better ways of doing things.

One of the first challenges I had to face was on deciding the data storage mechanism I'm going to adopt for this project. My initial idea was to create each editing pad as a physical file in the system and track the changes each user would be doing using Git. This sounded very unrealistic as disk IO would be very slow and executing git commands via shell would be even more slower!

Relational databases as storage medium doesn't seem to be a good for the task, since we should be doing massive writes and continuous querying. The best option in this scenario was to use a key-value based storage.

<h3>Choosing Redis</h3>

I got convinced to use <a href="http://code.google.com/p/redis/" target="_blank">Redis</a> as the data store, after <a href="http://simonwillison.net/2009/Oct/22/redis/" target="_blank">hearing lot of good about it</a> and further seeing some <a href="http://colinhowe.wordpress.com/2009/04/27/redis-vs-mysql/" target="_blank">impressive</a> <a href="http://www.ruturaj.net/redis-memcached-tokyo-tyrant-mysql-comparison" target="_blank">benchmarks</a>.

Redis is just beyond a normal key-value store, we could have lists, sets or sorted-sets as data structures in Redis and it's possible to do operations like sorting, taking difference, intersections and unions of the data. Also, one of the most interesting features I saw in Redis was it's persistence options. You can either use it as only a in-memory storage (which is very fast), or either write the data to disk periodically or even write data to disk only on a change (<a href="http://code.google.com/p/redis/wiki/AppendOnlyFileHowto" target="_blank">Append-only file</a>)

<h3>Data Structure</h3>

The atomic data unit of Realie would be a `Line`. Each pad is composed of bunch of lines. A line would be also equivalent to a single edit a user make on a file (pad). When we are storing the lines, we will need to store the following attributes along with it - user, pad, content, position (line number in the file) and timestamp.

In Redis, we can only store data values as strings. For this, each line will be serialized to JSON before being stored in the data-store. JSON serialization also makes it possible to consume & manipulate line contents in client or server easily.

Since we need to keep references to a line in several places in the data-store, a unique SHA-1 hash based on the contents of the line is calculated and it's used as the key for that line.

As I mentioned earlier, a Pad made as a collection of line. It's basically similar to any source files with lines of codes. Beyond that each pad will store the list of users who are working on that pad. Users will have the option to join a pad or leave a pad as they wish.

For a pad, there are two basic views. One is snapshot view, which is the current state of the pad after applying the most recent changes made by the users. The interesting view would be the timeline view - which would have the changes in order of users made. This view can be used to generate the historical versions of the pad (at a given time or checkpoint) or even to create a playback to see how the pad was changed over time.

<h3>Source Code</h3>

You can checkout the code from following GitHub repository - <a href="http://github.com/laktek/Realie">http://github.com/laktek/Realie</a>. Please note, currently the project source code only contains models & specs for above data structures and it could be changed, as you read.
