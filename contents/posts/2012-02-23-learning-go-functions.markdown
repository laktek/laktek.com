---
layout: post
title: Learning Go - Functions
published: true
tags:
- Code
- Go
type: post
status: publish
published_at: 1329955200000
---

Functions are first-class citizens in Go. In the [very first post](http://laktek.com/2012/01/05/learning-go/) of this series, we learnt that Go functions can return multiple values. Apart from multiple return values, there are several other interesting features in Go functions that's worth exploring.

### Higher-order Functions

In Go, a function can take another function as an argument and also define a function as a return type. This feature, which is known as higher-order functions in functional programming, is a great way to define dynamic and reusable behavior.

For example, `Map` function from the `strings` package takes a mapping function as its first argument. We can come up with a simple cipher algorithm by passing a function to `Map`.

```go
  output := strings.Map(func(c int) int {
		alphabet := "abcdefghijklmnopqrstuvwxyz"
		cryptabet := "THEQUICKBROWNFXJMPSVLAZYDG"

		return utf8.NewString(cryptabet).At(strings.Index(alphabet, string(c)))
	}, "hello")
```

What if you want to encode your message with a different cryptabet? How about something fancy like Sherlock Holmes' Little Dancing Men? Current implementation doesn't have that flexibility, but let's try to extend our code.

```go
  func CipherGenerator(cryptabet string) func(int) int {
    return func(c int) int {

      alphabet := "abcdefghijklmnopqrstuvwxyz"
      encoded_cryptabet := utf8.NewString(cryptabet)

      return encoded_cryptabet.At(strings.Index(alphabet, string(c)))

    }
  }

  func main() {
    fmt.Printf(strings.Map(CipherGenerator("☺☻✌✍✎✉☀☃☁☂★☆☮☯〠☎☏♕❤♣☑☒✓✗¢€"), "hello"))
  }
```

So we created a function called `CipherGenerator`. It can accept any unicode string as a cryptabet and return a function of type `func(int) int` which is assignable as a mapping function to `strings.Map`.

### User-Defined Function types

When you define a function to return another function, its signature can get little too complex. In the previous example, the function signature was `func CipherGenerator(cryptabet string) func(int) int`. This not easy to comprehend at a glance. We can make this more readable by [declaring a named type](http://laktek.com/2012/01/27/learning-go-types/) for the returning function.

```go
  type MappingFunction func(int) int
```

Now we can declare the `CipherGenerator` function like this:

```go
  func CipherGenerator(cryptabet string) MappingFunction {
    // ...
  }
```

Since the underlying type matches, it is still assignable to the `strings.Map`.

### Closure

In the function literal that's returned from the `CipherGenerator`, we are referencing to the variable `cryptabet`. However, `cryptabet` is defined only in the scope of `CipherGenerator`. Then how does returned function has access to `cryptabet` each time it runs?

This property is known as [Closure](<http://en.wikipedia.org/wiki/Closure_(computer_science)>). In simple terms, a function will inherit the variables from the scope it was declared.

Applying the same principle, we can also move the variable `alphabet` from the scope of returning function to the scope of `CipherGenerator`.

```go
  func CipherGenerator(cryptabet string) MappingFunction {
    alphabet := "abcdefghijklmnopqrstuvwxyz"

    return func(c int) int {

      encoded_cryptabet := utf8.NewString(cryptabet)

      return encoded_cryptabet.At(strings.Index(alphabet, string(c)))

    }
  }
```

### Deferred Calls

In Go functions you can define a special statement called `defer`. Defer statements invoke function or method calls immediately before the surrounding function (function that contains the defer statement) returns.

Defer statements are most commonly used for cleanup jobs. Its execution is ensured whatever return path your function takes.

```go
  func Read(reader io.ReadCloser) string {
    defer reader.Close()

    // ...
  }
```

Defer statement evaluates the parameters to the function call at the time it's executed. However, the function call isn't invoked until the surrounding function returns. Check the example below.

```go
  func FavoriteFruit() (fruit string) {
    fruit = "Apple"
    defer func(v string) {
      fmt.Printf(v)
    }(fruit)

    fruit = "Orange"

    return
  }
```

Though the value of `fruit` is later changed to Orange, defer function call will still print Apple. This is because it was the value `fruit` held, when the defer statement was executed.

Since we can use function literals in defer statements, closure property applies to them too. Instead of passing the variable `fruit` in the defer function call, we can directly access it from the deferred function.

```go
  func FavoriteFruit() (fruit string) {
    fruit = "Apple"
    defer func() {
      fruit = "Orange"
    }()

    return
  }
```

What is more interesting here is deferred call actually modifies the return value of the surrounding function. This is because the deferred call is invoked before return values are passed to the caller.

You can have mulitple defer statements within a function.

```go
  func f() (output string) {
    defer fmt.Printf("first deferred call executed.")
    defer fmt.Printf("second deferred call executed.")

    return "Function returned"
  }

  fmt.Printf(f())

  // Output:
  // second deferred call executed.
  // first deferred call executed.
  // Function returned
```

As you can see from the output, defer statements are executed in the Last-In-First-Out(LIFO) order.

### Variadic Functions

If you've noticed, you can invoke `fmt.Printf` with variable number of arugments. On one instance, you may simply call it as `fmt.Printf("Hello")` and in another as `fmt.Printf("Result of %v plus %v is %v", num1, num2, (num1 + num2))`. Since you have to define the parameters when declaring a function signature, how this is possible?

You can define the last parameter to a function with a type prefixed with `...`. Then it means the function can take zero or more arguments of the given type. Such functions are known as variadic functions.

Here's a simple variadic function to calculate the average of a series of integers.

```go
  func Avg(values ...int) float64 {
    sum := 0.0
    for _, i := range values {
      sum += float64(i)
    }
    return sum / float64(len(values))
  }

  Avg(1, 2, 3, 4, 5, 6) //3.5
```

In a variadic function, arguments to the last parameter is collected to a slice of the given type. We can directly pass an already composed slice instead of individual values to the variadic function. However, argument should be appended with a `...`.

```go
  values := []int{1, 2, 3, 4, 5, 6}
  Avg(values...) //3.5
```

By using [blank interface type](http://laktek.com/2012/02/13/learning-go-interfaces-reflections) with variadic functions, you can come up with very flexible functions similar to `fmt.Printf`.

### Further Reference

Go Coderwalk on First-Class Functions. [http://golang.org/doc/codewalk/functions/](http://golang.org/doc/codewalk/functions/)
