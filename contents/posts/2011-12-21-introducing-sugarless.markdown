---
legacy_slug: /2011/12/21/introducing-sugarless
layout: post
title: Sugarless - A Functional & Context Oriented way to write JavaScript
published: true
tags:
- JS
- Code
type: post
status: publish
published_at: 1324425600000
---

Fundamentally, JavaScript is a functional programming language. It's built with the concepts of higher-order functions, closures and lazy evaluations. It also has objects with protoypal inheritance. Unlike in Object Oriented languages, JavaScript's objects don't have methods. Instead, JavaScript executes functions in context of objects. When you call `this` inside a function it returns the reference to its current context.

Try running following expressions in your browser's console.

```javascript
  var testFunc = function(){ return this; }
  testFunc()

  //returns reference to window object

  var obj = new Object();
  obj.testFunc = testFunc;
  obj.testFunc()

  // returns reference to obj
```

As you can see same function referenced to two different `this` values on the two occasions. Moreover, we can explicitly set the `this` value (or the context) when we invoke a function.

```javascript
  var testFunc = function(){ return this; }
  var obj = new Object();

  testFunc.call(obj);

  // returns reference to obj
```

I think most of us finds JavaScript confusing because we tend to think from a Object Oriented mindset. It's more pragmatic to think JavaScript from functions and contexts. However, lack of expressivity in the language itself limits this line of thought.

### What is Sugarless?

[Sugarless](http://github.com/laktek/SugarlessJS) is a more expressive way to write functional and context-oriented programs in JavaScript.

Imagine a case where you have an input which has to undergo certain operations to produce a meaningful output. We define each operation as a function. The common way to do this in JavaScript would be:

```javascript
  var output = truncate(trim(sanitize(input)), 200)
```

At a glance, it's not very easy to comprehend. It gets further complicated if we try to add more functions or remove a certain function.

If we think in terms of Object Oriented concepts we can try to make this more readable with a fluent interface (ie. method chaining).

```javascript
  var output = input.sanitize()
                    .trim()
                    .truncate(200);

```

In order to do this in JavaScript, we must make sure the functions are available in the input object's prototype chain, object itself is mutable and all functions, apart from the last function returns the input object. Though this can be done, it's doesn't feel very natural or flexible.

Using Sugarless, this is how we can write it in a more readable and flexible manner:

```javascript
  var output = Sugarless(input)(
     sanitize
   , trim
   , truncate, "", 200
  );
```

Sugarless will invoke each function with the `this` value set to input (context) and first argument set to the return value of the previous function. Only thing we need change in functions is to use the `this` value as the input when no argument is passed (you can find the [full example here](https://github.com/laktek/SugarlessJS/blob/master/examples/client/strings.js)).

### What happens under the hood?

It's not hard to understand the logic behind Sugarless. When you call `Sugarless` with an object, you are creating a new context. Then you can define functions (and arguments) to run under this context.

```javascript
  Sugarless(context_object)(
    function(){ }, arg1,.., argN
  , function(){ }
  ...
  ...
  , function(){}
  );
```

In pure JavaScript terms, `Sugarless(obj)` is a function which returns a function. The returned function accepts any number of arguments (first argument should always be a function). Sugarless will invoke the functions passed with `this` value set to the context object(`obj`). Also, if you defined any non-function values after a function they are passed as arguments to the function. However, if the previous function in the chain returns a value, it will override the first argument of the current function.

### Sugarless' Powers

Along with the context and function chaining Sugarless gives you a bunch of nifty features to organize your code better. I'll highlight some of the most interesting ones here. To learn about all features available please refer to the [README](https://github.com/laktek/SugarlessJS/blob/master/README.md).

Sugarless provides a mechanism to do **deferred execution**. By default, all functions in the chain will execute sequentially. However, if you call `sugarless.next()` inside one of the functions, it will halt the chain and return the next function to be executed. If you are making an asynchronous call, you can pass the next function as a callback and resume the chain when you receive the results.

```javascript
    Sugarless(obj)(
       function() { setTimeout(Sugarless(this).next(), 60) }
     , function() { console.log("second function") }
     , function() { console.log("third function") }
    );
```

You can provide optional **before and after callbacks** to a context, which will be invoked before and after the chain respectively. This can be really useful if you want to create wrappers around Sugarless.

```javascript
    Sugarless('{"name": "John"}', {
        before: function(){ return JSON.parse(this); }
      , after:  function(obj){ return JSON.stringify(obj); }
    })(
         function(obj) { obj.profession = "Programmer"; return obj; }
       , function(obj) { obj.favorite_food = "Pizza"; return obj; }
    );
```

Sugarless make sure not to invoke any functions when the context is null or undefined. Instead it simply return a `null` as the result. This behavior is somewhat similar to **Null Object Pattern** you find in Object Oriented programming. Further, you have the option to specify a **fallback context** in the event of a null context.

Here's an example of providing a polyfill for `navigator.geolocation` for the browsers that doesn't implement it (you can see the [full example here](https://github.com/laktek/SugarlessJS/blob/master/examples/client/location.html)).

```javascript
  var customGeolocation = {};

  Sugarless( navigator.geolocation, {
      fallback: customGeolocation
  })(
    function(){}
  , function(){}
  );
```

### Bottom-up Programming

Using Sugarless will encourage you to build your solution by separating behavior into focused and untangled functions. For example, here's how we have defined the initial contexts in the [Todo List example](https://github.com/laktek/SugarlessJS/blob/master/examples/client/todo_list.html):

```javascript
      $("ul#pending_todos")(
        Store.fetch
      , List.add
      );

      $("form#new_entry")(
        onSubmit, [ Form.captureInput, Task.save, Form.reset ]
      );
```

We instruct to fetch tasks from the datastore and populate the pending todos list. For the new entry form, we have defined certain behaviors to invoke when a user hits submit.
Note how each function focus only on doing one small task and how context holds them together perform the bigger task. This approach makes it easier to understand the behaviors and even allows you to refactor a particular behavior without affecting others.

Since these functions takes the context in to consideration, reusability also becomes very easy. For example, later we also wanted to show a list of completed todos apart from the pending todos. It behaves very similar to the pending todos list other than having a strikethrough in its text.

```javascript
    $("#completed_todos")(
        Store.fetch
      , List.add
    );
```

We reused the same `Store.fetch` and `List.add` functions to populate the completed todos list as well. From the context, the functions know which todos to fetch and which list to add those.

For the brevity of this post, I'm not going to explain the full implementation here. I suggest you to check the [source](https://github.com/laktek/SugarlessJS/blob/master/examples/client/todo_list.html), which is pretty much self-explanatory.

### Give it a try...

This is just the initial public release of Sugarless. There can be bugs, ambiguous parts and ton of possible improvements.
So I appreciate all your feedback & contributions to make it better. Best way to start is to write some code with it.

You can install it from NPM by running `npm install sugarless` or you can [grab the source from GitHub](http://github.com/laktek/SugarlessJS). If you want to learn more, [check the examples](https://github.com/laktek/SugarlessJS/tree/master/examples) and also [read the spec](https://github.com/laktek/SugarlessJS/blob/master/spec/sugarlessSpec.js).

Personally, Sugarless gave me a better grip of JavaScript and I hope it will feel the same for you too. However, I don't expect it to be everyone's cup of tea either. Choice of tools largely depends on the personal taste and experience :)

Last but not least, I should thank [Nuwan Sameera](http://twitter.com/nuwansh) for being my sidekick in this project & rest of the [Vesess Team](http://vesess.com) for their invaluable feedback and support.
