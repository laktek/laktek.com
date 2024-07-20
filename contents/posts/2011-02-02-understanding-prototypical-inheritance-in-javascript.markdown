---
layout: post
title: Understanding Prototypal Inheritance in JavaScript
published: true
meta:
  dsq_thread_id: "220824299"
  _edit_lock: "1296865221"
  _edit_last: "1"
  _wp_old_slug: understanding-rototypical-inheritance-in-javascript
tags:
- Code
- JS
type: post
status: publish
published_at: 1296604800000
---
Behavior reuse is one of the key aspects of Object Oriented programming. Many mainstream Object Oriented languages, achieves behavior reuse by using <a href="http://en.wikipedia.org/wiki/Class-based_programming">class based inheritance</a>. In class based inheritance, a class defines how objects stemming from it should behave.

However, not all languages use class based inheritance to achieve behavior reuse. The best possible example is JavaScript. It doesn't have a concept of classes. Many developers often get confused about JavaScript's object oriented capabilities due to this fact. But in reality, JavaScript is a more expressive and flexible Object Oriented language compared to some of the mainstream languages.

If JavaScript doesn't have class based inheritance, how does it reuse the behavior? For that it follows the technique called <strong>Prototypal Inheritance</strong>. 

In prototypal inheritance, an object is used to define the behavior of another object. Let's try to understand this with a simple example:

```javascript
    var father = {
     first_name: "James", 
     last_name: "Potter",
     hair_color: "black",
     is_good_at_quidditch: true,

     name: function(){
      return this.first_name + " " + this.last_name
     }
    }

    var son = {
     first_name: "Harry" 
    }
    son.__proto__ = father;

    father.name()
    >> James Potter

    son.name()
    >> Harry Potter

    son.hair_color
    >> black

    son.is_good_at_quidditch
    >> true
```

Here the 'father' object acts as the prototype for 'son'. Hence, 'son' inherits all properties defined for 'father' (Note the <em>__proto__</em> property of 'son' object was explicitly overridden to set 'father' as the prototype). 

Even though it was used as a prototype, 'father' object can be still manipulated as a regular object. This is the main difference of a prototype from a class.

<h3>Object Hierarchy</h3>

The process of object responding to a property call in JavaScript is fairly straight-forward. It will first check whether it defines the property on its own; if not it will delegate the property call to its prototype object. This chain will continue to the top of object hierarchy until the property is found.

Talking about the object hierarchy, all objects in JavaScript are descended from generic Object. The generic Object prototype is the default prototype set on all objects at the instantiation, unless a custom prototype object is defined. 

So any given inheritance hierarchy in JavaScript is chain of objects with the generic Object prototype at the root. 

<h3>Creating New Objects</h3>

Though JavaScript doesn't have classes, you can define a constructor function and call it with the <em>new</em> keyword to instantiate a new object. As I mentioned before, when the new object is created it uses the generic Object prototype as its prototype. 

Let's take an example of creating basic shape objects. The constructor takes the number of sides and vertices as the arguments.

```javascript
var Shape = function(sides, vertices){
  this.sides = sides; 
  this.vertices = vertices; 
}
var triangle = new Shape(3, 3);
```

What if we want to create different types of triangles? Yes, we can use our basic shape object as the prototype for all our triangle objects.

```javascript
var Triangle = function(angles, side_lengths){
  this.angles = angles || [60, 60, 60]; 
  this.side_lengths = side_lengths || [5, 5, 5]; 
}
Triangle.prototype = new Shape(3, 3);

var isosceles_triangle  = new Triangle([70, 70, 40], [5, 5, 10]);
var scalene_triangle  = new Triangle([70, 60, 50], [5, 10, 13]);

isosceles_triangle.sides
>> 3

isoceles_triangle.vertices
>> 3

scalene_triangle.sides
>> 3

scalene_triangle.vertices
>> 3

```

Basically, when you call a constructor function with the new keyword; it will set the <em>__proto__</em> property of the newly created object to the object defined in <em>prototype</em> property of the constructor function.

<h3>Modifying Prototype Object at Runtime</h3>

All Objects in JavaScript can be modified during the runtime. Since prototype objects are also regular objects, we can modify them too. However, when you modify a prototype object its changes are reflected to all its descended objects too.  

```javascript
  Triangle.prototype.area = function(base, height){
    return(1/2 * base * height);
  }

  isosceles_triangle.area(10, 4); 
  >> 20
```

What's most interesting is we can use this way to extend the built-in objects in JavaScript. For example, you can extend String object's prototype to add a <em>capitalize</em> method.

```javascript
    String.prototype.capitalize = function(){
      return this.charAt(0).toUpperCase() + this.slice(1);
    };

    "john".capitalize();
    >> John
```

<h3>Further Reading</h3>

If you like to learn more about JavaScript's object model and prototypal inheritance, you would find following articles/posts useful.

<ul>
<li><a href="https://developer.mozilla.org/en/JavaScript/Guide/Details_of_the_Object_Model">Details of the object model (MDC Doc Center)</a></li>
<li><a href="https://developer.mozilla.org/en/JavaScript/Guide/Inheritance_Revisited">Inheritance revisited (MDC Doc Center)</a></li>
<li><a href="http://www.crockford.com/javascript/inheritance.html">Classical Inheritance in JavaScript (by Douglas Crockford)</a></li>
<li><a href="http://javascript.crockford.com/prototypal.html">Prototypal Inheritance in JavaScript (by Douglas Crockford)</a></li>
<li><a href="http://ejohn.org/blog/simple-class-instantiation/#postcomment">Simple “Class” Instantiation (by John Resig)</a></li>
