--- 
layout: post
title: jQuery isBlank()
published: true
meta: 
  dsq_thread_id: "219743458"
  _edit_lock: "1294537388"
  _edit_last: "1"
tags: 
- Code
- JS 
type: post
status: publish
---
One of my favorite syntactic sugar methods available in Rails is the <em>Object.blank?</em>, which evaluates to true if the given object is false, empty, or a whitespace string. It makes your conditional expressions more readable; avoiding the use of boolean operators.

It would be cool if we can have the same convenience when writing client-side code with JavaScript. Unfortunately, jQuery Core doesn't have such a utility function. Closest you get is with the <em><a href="http://api.jquery.com/jQuery.isEmptyObject/">jQuery.isEmptyObject</a></em>. It would return true for null, undefined or empty objects and empty arrays; but you can't match whitespace strings with it (which are of course not empty objects).

So, I wrote this small jQuery plugin to check whether the given object is blank:

```javascript
(function($){
  $.isBlank = function(obj){
    return(!obj || $.trim(obj) === "");
  };
})(jQuery);

$.isBlank(" ") //true
$.isBlank("") //true
$.isBlank("\n") //true
$.isBlank("a") //false

$.isBlank(null) //true
$.isBlank(undefined) //true
$.isBlank(false) //true
$.isBlank([]) //true
```

As shown in the above examples, it would identify any object that evaluates to <em>false</em> (null, undefined, false, []) or a whitespace string as blank.

<strong>Update:</strong> <a href="https://gist.github.com/jtarchie">jtarchie</a> commented <a href="https://gist.github.com/758269">on this gist</a> suggesting a alternative method, which would even match the empty objects.
