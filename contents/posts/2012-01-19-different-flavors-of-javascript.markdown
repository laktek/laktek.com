--- 
layout: post
title: Different flavors of JavaScript 
published: true
tags: 
- Code 
- JS 
type: post
status: publish
---

If you are programming with JavaScript, knowing about `ES3`, `ES5` & `Harmony` specifications and their usage will be useful. Here's a plain & simple explanation of them for your easy understanding.

### ECMAScript

If we look into the history of JavaScript, it was originated from a side project of [Brendan Eich](http://brendaneich.com) called "Mocha". In 1995, it was shipped with Netscape browser as "LiveScript" and it soon renamed as "JavaScript" (mainly from the influence of Sun Microsystems). Due to the quick popularity of JavaScript, Microsoft also decided to ship it with Internet Explorer in 1996. Microsoft's implementation had slight differences from the original, thus they aptly named it as "JScript".  

As browser wars between Netscape and Microsoft fired up, Netscape soon pushed JavaScript to [Ecma International](http://en.wikipedia.org/wiki/Ecma_International) for standardization. Ecma accepted the proposal and began the standardization under the ECMA-262 standard. As a compromise for all organizations involved in the standardization process, ECMA-262 baptized this scripting language as "ECMAScript". 

Even though we still call it as JavaScript, the technically correct name is *ECMAScript*. 

### ES3

Over the years, Ecma has released different editions of ECMAScript standard. For the ease of use we call these standards as "ESx", where `x` refers to the edition. So the 3rd edition of ECMAScript is known as `ES3`. `ES3` can be considered as the most widely adopted edition of ECMASCript. 

The most outdated browser in mainstream (*aka Disease*) Internet Explorer 6 is compliant with `ES3`. Sadly, other common IE versions(7 & 8) are also only compatible with `ES3`. Early versions of most other browsers also supported `ES3`.  This means all JavaScript features you commonly use are part of `ES3`. Most JavaScript libraries, frameworks, tutorials, best practices and books written in the past are based on these features standardized in `ES3`.

Source-to-source compilers such as [CoffeeScript](http://coffeescript.org), which aims to run *everywhere*, compiles its code to be compatible with `ES3`.

If you are interested in reading the full ECMAScript 3rd edition specification, you can [download it from here](http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262,%203rd%20edition,%20December%201999.pdf).

### ES5

After years of split and conflict of interests ECMA's Technical Committee came to an [agreement in 2008](https://mail.mozilla.org/pipermail/es-discuss/2008-August/006837.html) to follow two paths for the future development of ECMAScript. One as an immediate plan to overcome the issues `ES3` specification (then called as ES3.1). Another with a long term vision to evolve the language for the modern requirements. They also decided to kill ES4 specification, which was under development to support the above plans.

The `ES3.1` edition was finally released as `ES5` in 2009. Some of the notable features in this edition were Native JSON support, better Object creation and controlling options, utility Array functions and the introduction of strict mode to discourage the usage of unsafe and poorly implemented language features. You can read a detailed introduction about [`ES5` features in Opera blog](http://dev.opera.com/articles/view/introducing-ecmascript-5-1/).

Full support for `ES5` in major browsers were introduced from the following versions - Firefox 4, Chrome 7, Internet Explorer 9 and Opera 11.60. Safari 5.1 (and mobile Safari) in iOS5 do support all of `ES5` features except for `Function.bind`. Also, IE9 doesn't support the `strict mode` option. Juriy Zaytsev provides a comprehensive compatibility table of `ES5` features, which I [recommend you to bookmark](http://kangax.github.com/es5-compat-table/).

So is it safe to use `ES5` features in our JavaScript code? Answer to that largely depends on your user base. If majority of your users comes from Internet Explorer 6, 7 & 8, code with `ES5` features will break for them. One way to solve this problem is to use [ES5 shims](https://github.com/kriskowal/es5-shim) for unsupported browsers. You may decide which shims to include depending on the features you use in your code. Also, if your code is already depending on a utility library such as [Underscore.js](http://documentcloud.github.com/underscore), which also provides similar features to `ES5` you may continue to use it. Most utility libraries will use the native implementation if available, before falling back to its own implementation.

If you are writing server-side JavaScript based on [Node.js](http://nodejs.org) you can freely use `ES5` features. Node.js is based on the V8 JavaScript engine, which is fully compatible with `ES5`. Another thing to consider is whether you should write your server-side JavaScript using CoffeeScript. If you are doing so, you are limiting your ability to use native `ES5` features. As I mentioned earlier CoffeeScript compiles only to `ES3` compatible JavaScript and has custom implementations for `ES5` features such as `bind`. However, this is still an [open issue with discussions](http://documentcloud.github.com/underscore), suggesting CoffeeScript may add the option to compile `ES5` compatible code in future.

For the full reference of `ES5`, I recommend using the annotated HTML version done by Michael Smith - [es5.github.com](http://es5.github.com)

### ES.Next (Harmony)

The long-term plan for the ECMAScript in 2008 meeting, was code-named `Harmony`. Committee is still accepting proposals for this edition. Most probably, this will become the `ES6`, but given the past track-record of ECMA-262 `ES.Next` would be more suitable name until a release is made.

Currently planned features for `Harmony` sounds promising. Brendan Eich has shared [some ideas](http://brendaneich.com/2011/01/harmony-of-my-dreams/) for Harmony which seems to make the language more concise and poweful. Also, his [presentation on Proxy Objects](http://jsconf.eu/2010/speaker/be_proxy_objects.html) in Harmony sounds awesome.  

SpiderMonkey and V8 JavaScript engines has already started implementing some of the [Harmony related features](https://bugzilla.mozilla.org/show_bug.cgi?id=Harmony), such as [Proxies](http://code.google.com/p/v8/issues/detail?id=1543&q=label%3AHarmony&colspec=ID%20Type%20Status%20Priority%20Owner%20Summary%20HW%20OS%20Area%20Stars) and [WeakMaps](https://bugzilla.mozilla.org/show_bug.cgi?id=547941). It would be still premature to use these features at the client-side (in Chromium browser you need to explicitly enable Harmony features via a special flag). [Node.js 0.7](http://blog.nodejs.org/2012/01/16/node-v0-7-0-unstable/), will ship with v8 version 3.8 giving you the opportunity to tase some of the Harmony features in server-side.  
