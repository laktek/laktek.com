---
layout: post
title: Revisiting JavaScript Objects
published: true
tags:
- Code
- JS
type: post
status: publish
published_at: 1356739200000
---

During the holidays, I spent some time catching up on the developments in ES6 (next version of JavaScript). While going through some of the proposals such as [Minimal Class Definitions](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes), [Proxy API](http://wiki.ecmascript.org/doku.php?id=harmony:direct_proxies) and [Weak Maps](http://wiki.ecmascript.org/doku.php?id=harmony:weak_maps); I noticed most of these enhancements make extensive use of the object manipulation features introduced in ES5 (ie. ECMAScript5 - the current JavaScript standard).

One of the main focuses of ES5, has been to improve the JavaScript's object structure and manipulation. The features it introduced do make lot of sense, especially if you're working with large and complex applications.

We've been little reluctant to adopt ES5 features, especially due to browser compatibility issues. We rarely see production code that make use of these features. However, all modern browsers (ie. IE9, FF4, Opera 12 &amp; Chrome) do have JavaScript engines that implement the ES5 standard. Also, ES5 features can be used in Node.js based projects without any issue. So I think it would be a worthwhile exercise to revisit the ES5 object features and see how they can be used in real-life scenarios.

### Data and Accessor Properties

ES5 introduces two kinds of object properties - data and accessors. A *data property* directly maps a name to a value (eg. integer, string, boolean, array, object or a function). An *accessor property* maps a name to a defined getter and/or setter function.

```javascript
var square = {
	length: 10,
	get area() { return this.length * this.length },
	set area(val) { this.length = Math.sqrt(val) }
}
```

Here we have defined a `square` object, with `length` as a data property and `area` as an accessor property.

```javascript
> square.length
  10
> square.area
  100
> square.area = 400
  400
> square.length
  20
```

When we access the `area` property, its getter will calculate and return the value in terms of the `length` property. Also, when we assign a value to `area`, its setter function will change the `length` property.

### Property Descriptor

ES5 allows you to have more fine-grained control over the properties defined in an object. There's a special attribute collection associated with each property, known as the *property descriptor*.

You can check the attributes associated to a property by calling the `Object.getOwnPropertyDescriptor` method.

```javascript
> Object.getOwnPropertyDescriptor(square, "length")
{
	configurable: true
	enumerable: true
	value: 20
	writable: true
}

> Object.getOwnPropertyDescriptor(square, "area")
{
	configurable: true
	enumerable: true
	get: function area() { return this.length * this.length }
	set: function area(val) { this.length = Math.sqrt(val) }
}
```

As you can see from the above two examples - `value` and `writeable` attributes are only defined for *data property descriptors*, while `get` and/or `set` are defined for *accessor property descriptors*. Both `configurable` and `enumerable` attributes applies to any kind of property descriptor.

The `writable` attribute specify whether a value can be assigned to a property. If `writable` is `false`, property becomes read-only. As the name implies, `configurable` specifies whether the property's attributes are configurable and also whether the property can be deleted from the object (using the `delete` operation). The `enumerable` attribute determines whether the property should be visible in `for..in` loops or `Object.keys` methods.

We can modify these attributes in the *property descriptor* by using the `Object.defineProperty` method.

```javascript
Object.defineProperty(square, "length", {
	value: 10,
	writable: false
});
```

This will make the `length` property in `square` read-only and permanently set to `10`.

```javascript
> square.length
  10
> square.area = 400
  400
> square.length
  10
> square.area
  100
```

### Tamper-proof Objects

On some instances, you need to preserve the objects in its current state during the run-time without any further extensions or modifications to the properties. ES5 provides three levels of controls that you can apply to the objects.

Calling `preventExtensions` method will make the object non-extensible. This means no further properties can be defined for the object.

```javascript
> Object.preventExtensions(square);

> Object.defineProperty(square, "text", { value: "hello" });
  TypeError: Cannot define property:text, object is not extensible.
```

Sealing the object, will prevent both defining of new properties and the deletion of existing properties in the object.

```javascript
> Object.seal(square);

> delete square.length
  false
```

If we go one step further and freeze the object, it will also disallow changing the existing property values in the object. At this point, whole object effectively becomes a constant.

```javascript
> Object.freeze(square);

> square.length = 20
  20
> square.length
  10
```

You can use the methods `Object.isSealed`, `Object.isFrozen` and `Object.isExtensible` to programmatically check the state of an object.

Even though an object is protected, it would still be possible to extend its prototype. Check the following example:

```javascript
var obj = Object.create({}, { onlyProp: { value: true } });
Object.preventExtensions(obj);

var proto = Object.getPrototypeOf(obj);
proto.anotherProp = true;

> obj.anotherProp
  true
```

### Enumerations

Often, we use JavaScript objects as associative arrays or collections. On such instances, we are tempted to use `for...in` loops to enumerate over the properties. However, the loop will step through all enumerable properties available in object's prototypal chain, resulting with undesired outcomes.

To avoid such side effects, [JSLint](http://jslint.com) suggests to manually check whether the given property is defined in the object.

```javascript
for (name in object) { if (object.hasOwnProperty(name)) { .... } }
```

ES5 provides `Object.keys` method, which would return an array of own enumerable properties of an object.

We can use this method to safely iterate over a property list:

```javascript
Object.keys(obj).forEach( function(key) {
	console.log(key);
});
```

Note: [Array.forEach](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach) is also a new feature introduced in ES5

### Inheritance

We know JavaScript provides behavior reuse in terms of [prototypal inheritance](http://laktek.com/2011/02/02/understanding-prototypical-inheritance-in-javascript). However, lack of direct mechanism to create a new object using another object as a prototype, has been one of pet peeves in the language.

The standard way to create a new object is to use a constructor function. This way, the newly created object will inherit the prototype of the constructor function.

```javascript
var Person = function(first_name, last_name) {
	this.first_name = first_name;
	this.last_name = last_name;
}

Person.prototype = {
	say: function(msg) {
		return this.first_name + " says " + msg;
	}
}

var ron = new Person("Ron", "Swanson");
```

If someone calls the constructor function without the `new` operator, it could lead to unwarranted side-effects during the execution. Also, there's no semantical relationship between the constructor function and its prototype, which could cause confusions when trying to comprehend the code.

For those who prefer to have a alternate syntax, ES5 provides the `Object.create` method. It takes a prototype object and a property descriptor as arguments.

Here's an alternate implementation that can be used to create `Person` objects, using the `Object.create` and [module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth).

```javascript
var Person = (function() {

	var proto = {
		say: function(msg) {
			return this.first_name + " says " + msg;
		}
	}

	return {
		init: function(first_name, last_name) {
			return Object.create(proto, {
				first_name: { value: first_name, enumerable: true },
				last_name: { value: last_name, enumerable: true }
			});
		}
	}

})();

var ron = Person.init("Ron", "Swanson");
```

However, compared to constructor functions using `Object.create` could be [considerably slow](http://jsperf.com/object-create-vs-constructor-vs-object-literal). So choose which implementation you want to use depending on the context and requirements.

Even if you use prefer to use constructor functions, `Object.create` will come in handy when you want to have multiple levels of inheritance.

```javascript
var Person = function(first_name, last_name) {
	this.first_name = first_name;
	this.last_name = last_name;
};

Person.prototype = {
	say: function(msg) {
		return this.first_name + " says " + msg;
	}
};

var Employee = function(first_name, last_name) {
	Person.call(this, first_name, last_name);
}

Employee.prototype = Object.create(Person.prototype, {
	department: { value: "", enumerable: true },
	designation:{ value: "", enumerable: true }
});

var ron = new Employee("Ron", "Swanson");
```

We've extended the `Person` prototype to create the prototype of `Employee`.

### Cloning Objects

Finally, let's see how to create a shallow clone of an object using ES5's object methods.

```javascript
var clone = function(obj) {
	// create clone using given object's prototype
	var cloned_obj = Object.create(Object.getPrototypeOf(obj));

	// copy all properties
	var props = Object.getOwnPropertyNames(obj);
	props.forEach(function(prop) {
		var propDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
		Object.defineProperty(cloned_obj, prop, propDescriptor);
	});

	return cloned_obj;
}
```

Here, we retrieve the prototype of the given object and using it to create the clone. Then we traverse all properties defined in the object (including the non-enumerable properties) and copy their property descriptors to the clone.

### Further Reading

If you're interested in learning more about the JavaScript objects and how to manipulate them, I would recommend you to peruse the following resources:

* [Discussion about this post on HackerNews](http://news.ycombinator.com/item?id=4988462)
* [Annotated ECMAScript 5.1](http://es5.github.com/)
* [ECMAScript 5 compatibility table](http://kangax.github.com/es5-compat-table/)
* [MDN reference of Objects](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object)
* [Object properties in JavaScript by Dr. Axel Rauschmayer](http://www.2ality.com/2012/10/javascript-properties.html)
* [Are your mixins ECMAScript 5 compatible?](http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/)
* [JavaScript object creation: Learning to live without "new"](http://www.adobe.com/devnet/html5/articles/javascript-object-creation.html)
* [Writing Fast, Memory-Efficient JavaScript](http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/)
