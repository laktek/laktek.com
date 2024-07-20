---
layout: post
title: Basic Patterns for Everyday Programming
published: true
tags:
- Code
- Ruby
- JS
type: post
status: publish
published_at: 1322006400000
---

For most of you the patterns mentioned below should be nothing new. These are very basic stuff we slap into our code everyday and at times feels they are actually code smells than smart patterns. However, I've been doing some code reviewing lately and came across many code that lacks even these basic traits. So I thought of writing them down as a help for novice developers who would want to get a better grasp at these.

These patterns are commonly applicable in most general purpose programming languages, with slight syntactical changes. I use Ruby and JavaScript for the examples in this post.

<h3>Verify object's availability before calling its methods or properties</h3>

In ideal world we expect every call to an object will return that object, but in real world either object or null is returned. If we try to invoke a method without knowing it could be a null object, exceptions will be raised and at worse unexpected results would be returned.

The simple way around for this is to verify object's availability before calling its methods or properties. We connect the object and its method (or property) call with a logical AND operator (&&), so the method is only invoked if the object is truthy (not null). This technique is commonly known as 'andand'.

Here's a real-life example in JavaScript, where we use the native JSON object to parse a string:

```javascript
  var parsed_content = window.JSON && window.JSON.parse("{}");
```

If the native JSON object is not present in the window context <em>parsed_content</em> will be set to <del>null</del> undefined.

Some languages has built-in shorthand methods for this pattern. If you are using <del>Ruby 1.9</del> Ruby on Rails (2.3+) framework, <em>Object.try</em> serves for the same purpose. Which means:

```ruby
  @person && @person.name
```

can be written as:

```ruby
  @person.try(:name)
```

<h3>Set a default value with assignments</h3>

When we want to assign a value for a variable, the value returned could actually be null or undefined. On such a instances it's better to assign a default value. This minimizes the surprises later in the code and simplifies the conditional logic involving that variable.

To assign a default value in a single assignment statement, we can use logical OR operator (||), which assigns the latter value if former is falsy.

Here's a simple example in Ruby:

```ruby
  @role = @person.role || "guest"
```

**Gotcha:** Be aware of the contexts where your variable could take a boolean value. Default value will be returned even when expected value is legitimately false.

<h3>Checking whether a variable equals to any of the given values</h3>

Imagine an instance where you have to perform an action if the <em>current_day</em> is either Monday, Wednesday or Friday. How would you check that condition?

I've seen many write this as:

```ruby
  if(current_day == "Monday" || current_day == "Wednesday" || current_day == "Friday")
    # perform action
  end
```

It does the job, but as you see it's verbose. What happens if we have to mix another condition with this in future (eg. also check whether the calendar date is above 20)?

A better way to do this is collecting the given values to an Array and checking against it. Here's the modified code:

```ruby
  if(["Monday", "Wednesday", "Friday"].include?(current_day))
    # perform action
  end
```

Same example can be written in JavaScript like this:

```javascript
  if(["Monday", "Wednesday", "Friday"].indexOf(current_day) >= 0){
    // perform action
  }
```

<h3>Extract complex or repeated logic into functions</h3>

When you have long, complex logic in condition or assignment statements, extract them into functions. It improves the code clarity and also makes refactoring lot easier.

Here's a slightly modified version of previous example:

```ruby
  if(["Monday", "Wednesday", "Friday"].include?(current_day) && (current_date > 20))
    # perform action
  end
```

We can extract this logic into a function and call it like this:

```ruby
  def discount_day?
    ["Monday", "Wednesday", "Friday"].include?(current_day) && (current_date > 20)
  end

  ...

  if(discount_day?)
    # perform action
  end
```

This refactoring allows others to read the code in context to the domain, without having to comprehend the internal logic.

Doing similar refactoring should be possible in every language.

<h3>Memoize the results of repeated function calls</h3>

Another advantage of extracting logic into functions is you can <a href="http://en.wikipedia.org/wiki/Memoization">memoize</a> the result of calculation, if it's going to be called repeatedly.

Here's how simple memoization works in Ruby.

```ruby
  def discount_day?
    @discount_day ||= (["Monday", "Wednesday", "Friday"].include?(current_day) && (current_date > 20))
  end
```

Let's try to understand what happens here. At the first call, <em>@discount_day</em> instance variable is undefined; hence the assignment block is evaluated and its result is assigned to <em>@discount_day</em>. But on the next call, since the <em>@discount_day</em> is already holds a value its value is returned without evaluating the assignment block.

Let's see how to do similar in JavaScript:

```javascript
  var discount_day;
  function discount_day(){
    if(typeof discount_day === "undefined"){
      discount_day = (["Monday", "Wednesday", "Friday"].indexOf(current_day) >= 0 && (current_date > 20))
    }
    return discount_day
  }
```

Each language may have their own way doing memoization, refer to your language and take the advantage of it.
