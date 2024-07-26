---
legacy_slug: /2012/01/27/learning-go-types
layout: post
title: Learning Go - Types
published: true
tags:
- Code
- Go
type: post
status: publish
published_at: 1327622400000
---

One of the main reasons I embrace Golang is its simple and concise type system. It follows the principle of least surprise and as per [Rob Pike](http://en.wikipedia.org/wiki/Rob_Pike) these design choices were largely influenced by the prior experiences.

In this post, I will discuss some of the main concepts which are essential in understanding Golang's type system.

### Pre-declared Types

Golang by default includes several pre-declared [boolean, numeric and string types](http://golang.org/doc/go_spec.html#Boolean_types). These pre-declared types are used to construct other composite types, such as array, struct, pointer, slice, map and channel.

### Named vs Unnamed Type

A type can be represented with an identifier (called _type name_) or from a composition of previously declared types (called _type literal_). In Golang, these two forms are known as **named** and **unnamed** types respectively.

Named types can have their own method sets. As I explained in a [previous post](http://laktek.com/2012/01/05/learning-go), methods are also a form of functions, which you can specify a receiver.

```go
  type Map map[string]string

  //this is valid
  func (m Map) Set(key string, value string){
    m[key] = value
  }

  //this is invalid
  func (m map[string]string) Set(key string, value string){
    m[key] = value
  }
```

You can define a method with named type `Map` as the receiver; but if you try to define a method with unnamed type `map[string]string` as the receiver it's invalid.

An important thing to remember is **pre-declared types are also named types**. So `int` is a named type, but `*int` or `[]int` is not.

### Underlying Type

Every type do have an _underlying type_. Pre-declared types and type literals refers to itself as the underlying type. When declaring a new type, you have to provide an existing type. The new type will have the same underlying type as the existing type.

Let's see an example:

```go
  type Map map[string]string
  type SpecialMap Map
```

Here the underlying type of `map[string]string` is itself, while underlying type of `Map` and `SpecialMap` is `map[string]string`.

Another important thing to note is **the declared type will not inherit any method from the existing type or its underlying type**. However, method set of an interface type and elements of composite type will remain unchanged. Idea here is if you define a new type, you would probably want to define a new method set for it as well.

### Assignability

```go
  type Mystring string
  var str string = "abc"
  var my_str MyString = str //gives a compile error
```

You can't assign `str` to `my_str` in the above case. That's because `str` and `my_str` are of different types. Basically, to assign a value to a variable, value's type should be identical to the variable's type. It is also possible to assign a value to a variable if their underlying types are identical and one of them is an unnamed type.

Let's try to understand this with a more elaborative example:

```go
  package main

  import "fmt"

  type Person map[string]string
  type Job map[string]string

  func keys(m map[string]string) (keys []string) {
    for key, _ := range m {
      keys = append(keys, key)
    }

    return
  }

  func name(p Person) string {
    return p["first_name"] + " " + p["last_name"]
  }

  func main(){
    var person = Person{"first_name": "Rob", "last_name": "Pike"}
    var job = Job{"title": "Commander", "project": "Golang"}

    fmt.Printf("%v\n", name(person))
    fmt.Printf("%v", name(job)) //this gives a compile error

    fmt.Printf("%v\n", keys(person))
    fmt.Printf("%v\n", keys(job))
  }
```

Here both `Person` and `Job` has `map[string]string` as the underlying type. If you try to pass an instance of type `Job`, to `name` function it gives a compile error because it expects an argument of type `Person`. However, you will note that we can pass instances of both `Person` and `Job` types to `keys` function which expects an argument of unamed type `map[string]string`.

If you still find assignability of types confusing; I'd recommend you to read the explanations by Rob Pike in the [following discussion](https://groups.google.com/group/golang-nuts/browse_thread/thread/e036f6cf674485f7/43c1ab29a44f5f82?lnk=gst&q=type+assignment#43c1ab29a44f5f82).

### Type Embedding

Previously, I mentioned when you declare a new type, it will not inherit the method set of the existing type. However, there's a way you can embed a method set of an existing type in a new type. This is possible by using the properties of annonymous field in a `struct` type. When you define a annonymous field inside a `struct`, all its fields and methods will be promoted to the defined struct type.

```go
  package main

  type User struct {
    Id   int
    Name string
  }

  type Employee struct {
    User       //annonymous field
    Title      string
    Department string
  }

  func (u *User) SetName(name string) {
    u.Name = name
  }

  func main(){
    employee := new(Employee)
    employee.SetName("Jack")
  }
```

Here the fields and methods of `User` type get promoted to `Employee`, enabling us to call `SetName` method on an instance of `Employee` type.

### Type Conversions

Basically, you can convert between a named typed and its underlying type. For example:

```go
  type Mystring string

  var my_str Mystring = Mystring("awesome")
  var str string = string(my_str)
```

There are [few rules](http://golang.org/doc/go_spec.html#Conversions) to keep in mind when it comes to type conversions. Apart from conversions involving string types, all other conversions will only modify the type but not the representation of the value.

You can convert a string to a slice of integers or bytes and vice-versa.

```go
  []byte("hellø")

  string([]byte{'h', 'e', 'l', 'l', '\xc3', '\xb8'})
```

More robust and complex run-time type manupilations are possible in Golang using the Interfaces and [Relection Package](http://blog.golang.org/2011/09/laws-of-reflection.html). We'll see more about them in a future post.
