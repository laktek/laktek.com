--- 
layout: post
title: Learning Go - Interfaces & Reflections 
published: true
tags: 
- Code 
- Go 
type: post
status: publish
---

In the [post about Go Types](http://laktek.com/2012/01/27/learning-go-types/), I briefly mentioned that Go provides a way to do run-time type inference using interfaces and reflection package. In this post, we are going to explore these concepts in depth.

### What is an Interface?

Imagine you stop a random cab expecting to go from A to B. You wouldn't care much about the nationality of the driver, how long he's been in this profession, to whom he voted in the last election or even whether he is a robot; as long as he can take you from A to B.  

This is how the interfaces works in Go. Instead of expecting for a value of particular type, you are willing to accept a value from any type that implements the methods you want.

We can represent our Cab Driver analogy in Go like this (assuming there are human and robot cab drivers):

```go

  type Human struct {
  }
  
  func (p *Human) Drive(from Location, to Location){
    //implements the drive method
  }

  type Robot struct {
  }
  
  func (p *Robot) Drive(from Location, to Location){
    //implements the drive method
  }

  type Driver interface {
    Drive(from Location, to Location) 
  }

  func TakeRide(from Location, to Location, driver Driver){
    driver.Drive(from, to)
  }

  func main(){
    var A Location
    var B Location

    var random_human_driver *Human = new(Human)
    var random_robot_driver *Robot = new(Robot)

    //...

    TakeRide(A, B, random_human_driver)
    TakeRide(A, B, random_robot_driver)
  }

```

Here we defined a type called `Driver` which is an `interface` type. An interface type contains a set of methods. Type supporting the interface, should fully implement this method set. 

In this instance, pointer types of both `Human` and `Robot` (`*Human` and `*Robot`)  implements the `Drive` method. Hence, they satisfies the `Driver` interface. So when calling the `TakeRide` function, which expects a `Driver` interface as an argument, we can pass a pointer to either `Human` or `Robot` types.

You can assign any value to an interface, if its type implements all methods defined by the interface. This loose coupling allows us to implement new types to support existing interfaces, as well as create new interfaces to work with existing types.

I recommend you to read the section on [Interfaces in Effective Go](http://golang.org/doc/effective_go.html#interfaces), if you haven't already. It provides more elaborative examples on the usage of interfaces.

### Encapsulation

Another benefit of Interfaces are they can be used for encapsulation. If a type is only implements the methods of a given interface, it's ok to export only the interface without the underlying type. Obviously, this is helpful in maintaining a cleaner and concise API.

In our previous Cab Driver example, both `Human` and `Robot` types doesn't have any other methods apart from the `Drive` method. Which means we can export only the `Driver` interface and keep `human` and `robot` types encapsulated to the package (hm...a paranoid cab company which doesn't reveal the true identities of the drivers!). 

```go

  // ...
  // Type & method declarations were skipped

  func TakeRide(from Location, to Location, driver Driver){
    driver.Drive(from, to)
  }

  func NewDriver() Driver {
    // this constructor will assign 
    // a random value of type *human or *robot
    // to Driver interface.

    return
  }

  func main(){
    var A Location
    var B Location

    var random_driver Driver = NewDriver() 

    //...

    TakeRide(A, B, random_driver)
  }

```

We have introduced a new function called `NewDriver()` which will return a `Driver` interface. Value of the `Driver` interface could be either `*human` or `*robot`.

### Empty Interface - interface{}

It's possible to define an interface without any methods. Such an interface is known as an *empty interface*, and it's denoted by `interface{}`. Since there are no methods, any type will satisfy this interface. 

I'm sure most of you are familiar with the [`fmt.Printf`](http://golang.org/pkg/fmt/#Printf) function; which accepts variable number of arguments of different types and produce a formatted output. If we take a look at its definition, it accepts variable number of empty interface(`interface{}`) values. This means, `Printf` is using a mechanism based on empty interfaces to infer the types of values at run-time. If you read through the next sections, you will get a clue how it does that.

### Type Assertion

In Go, there's a special expression, which let's you assert the type of the value interface holds. This is known as *Type Assertion*.

In our Cab Driver example, we can use type assertion to verify whether the given driver is a human.

```go
  var random_driver Driver = NewDriver() 
  v, ok := random_driver.(*human)
```

If the `NewDriver()` method returns an interface with the value of type `*human`; `v` will be assigned with that value and value of `ok` will be `true`. If `NewDriver()` returns a value of `*robot` type; `v` will be set to nil and value of `ok` will be `false`. 

With type assertion it is possible to convert one interface value to another interface value too. For the purpose of this example; let's assume there's another interface called `Runner` which defines a `Run` method and our `*human` type also implements the `Run` method.

```go
  var random_driver Driver = NewDriver() 
  runner, ok := random_driver.(Runner)
```

Now when the `Driver` interface is contained with a value of `*human`; it is possible for us to convert the same value to be used with the `Runner` interface too. 

### Type Switches

Using type assertions, Go offers a way to do different actions based on a value's type. Here's the example given in [Gospec](http://golang.org/doc/go_spec.html#Type_assertions) for type switching:

```go
  switch i := x.(type) {
  case nil:
    printString("x is nil")
  case int:
    printInt(i)  // i is an int
  case float64:
    printFloat64(i)  // i is a float64
  case func(int) float64:
    printFunction(i)  // i is a function
  case bool, string:
    printString("type is bool or string")  // i is an interface{}
  default:
    printString("don't know the type")
  }
```

Type switching uses a special form of type assertion, with the keyword `type`. Note that this notation is not valid outside of type switching context.

### Reflection Package

Combining the power of empty interfaces and type assertions, Go provides Reflection package which allows more robust operations on types and values during the run-time.

Basically, reflection package gives us the ability to inspect the type and value of any variable in a Go program.

```go
  import "reflect"

  type Mystring string

  var x Mystring = Mystring("awesome")
  fmt.Println("type:", reflect.TypeOf(x))
  fmt.Println("value:", reflect.ValueOf(x))
```

This gives the output as:

```bash
  type: main.Mystring
  value: awesome
```

However, this is just the tip of the iceberg. There are lot more powerful stuff possible with the Reflection package. I'll leave you with the ["Laws of Reflection" blog post](http://blog.golang.org/2011/09/laws-of-reflection.html) and [Godoc of the relection package](http://golang.org/pkg/reflect/). Hope its capabilities will fascinate you. 

### Further Reading

* Russ Cox's write-up on the data-strcutures behind Interfaces - [http://research.swtch.com/interfaces](http://research.swtch.com/interfaces)
* Law's of Reflection (from Go Blog) - [http://blog.golang.org/2011/09/laws-of-reflection.html](http://blog.golang.org/2011/09/laws-of-reflection.html)
