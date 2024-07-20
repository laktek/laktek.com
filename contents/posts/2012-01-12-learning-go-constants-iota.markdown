---
layout: post
title: Learning Go - Constants &amp; Iota
published: true
tags:
- Code
- Go
type: post
status: publish
published_at: 1326326400000
---

When you learn Golang, your first encounter with constant declarations can be little confusing.

```go
type ByteSize float64
const (
    _ = iota  // ignore first value by assigning to blank identifier
    KB ByteSize = 1<<(10*iota)
    MB
    GB
    TB
    PB
    EB
    ZB
    YB
)
```

Why only the first constant (`KB`) has a value assigned? What does `iota` means? These are some of the questions that could pop into your mind when you go through the above code sample for the first time. [As I mentioned in the previous post](http://laktek.com/2012/01/05/learning-go), best way to find answers to such questions is to refer the [Go spec](http://golang.org/doc/go_spec.html).

### Constant Expressions

In Go, constants can be numbers, string or boolean values. Basically, constant values can be represented by a literal(eg. `"foo"`, `3.0`, `true`) or by an expression(eg. `24 * 60 * 60`). Since constants are initiated at the compile time, constant expressions should be composed only from constant operands.

If a constant value is a literal or evaluated from an expression containing only untyped constant operands it is an **untyped constant**. If you want, you can explicitly specify a type for a constant at the time of declaration.

```go
const typed_size int64 = 1024
const untyped_size = 1024

var f float64 = typed_size // will give you a compile error
var f float64 = untyped_size // valid assginment
```

As shown in the above example, if you try to assign a typed constant to a variable of a different type it will give a compilation error. On the other hand, an untyped constant is implicitly converted to the type of variable at the assignment.

### Declaring Constants

You can declare multiple constants in a single line as a comma-separated list. However, you should always have same number of identifiers and expressions. This means,

```go
 const a, b, c = 1 //invalid assignment
```

is invalid.

You should write it in this way:

```go
 const a, b, c = 1, 1, 1 //valid assignment
```

If you feel this is too repetitive, you can try the parenthesized form of constant declaration. Most interesting property of parenthesized form is you can omit an expression to an identifier. If you do so, the previous expression will be repeated. So the above example can be re-written in parenthesized form like this:

```go
 const(a = 1
       b
       c
      )
```

Here constants `b` and `c` will also take the value `1`.

```go
const (
	Yes = 1
	True
	No = Yes >> 1
	False
)
```

In the above example, constants `Yes` and `True` gets the value `1`; while `No` and `False` gets `0`. Also, note that we can use a previously defined constant in an expression to declare another constant.

### What is Iota?

A practical usage of constants is to represent enumerated values. For example, we can define days of the week like this:

```go
const (
  Sunday = 0
  Monday = 1
  Tuesday = 2
  Wednesday = 3
  Thursday = 4
  Friday = 5
  Saturday = 6
)
```

Iota is a handy shorthand available in Go that makes defining of enumerated constants easy. Using `iota` as an expression, above example can be re-written in Go as follows:

```go
const (
  Sunday = iota
  Monday
  Tuesday
  Wednesday
  Thursday
  Friday
  Saturday
)
```

Iota value is reset to `0` at every constant declaration (a statement starting with `const`) and within a constant declaration it is incremented after each line(ConstSpec). If you use `iota` in different expressions in the same line they will all get the same `iota` value.

```go
const(
 No, False, Off = iota, iota, iota // assigns 0
 Yes, True, On                    // assigns 1
)
```

Finally, here's a little tricky one. What would be the value of c?

```go
const (
	a = iota // a == 0
	b = 5    // b == 5
	c = iota // c == ?
)
```

In the above example, `c` will take the value `2`. That's because value of `iota` is incremented at each line within a declaration. Eventhough, the 2nd line doesn't use the `iota` value it will still get incremented.
