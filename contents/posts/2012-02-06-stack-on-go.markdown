--- 
layout: post
title: Stack on Go - A Wrapper for Stack Exchange API
published: true
tags: 
- Code 
- Go 
type: post
status: publish
---

Regular readers of this blog would know I've been spending my free time to [learn Go](http://laktek.com/tag/go). Today, I present you the first fruit of those learning experiences. [Stack on Go](https://github.com/laktek/stack-on-go) is a wrapper library written in Go for [Stack Exchange API](https://api.stackexchange.com). 

When I first stumbled upon the version 2.0 of Stack Exchange API, I felt it as one of the best API designs I've ever seen. So I decided to write a wrapper for it in Go, which was a good way to learn both Golang and modern API design techniques.

*Stack on Go* fully implements the Stack Exchange API 2.0 and it is compatible with the Go runtime at Google AppEngine. I hope this could be a good platform for some interesting apps such as notifiers, aggregators and stat analyzers based on Stack Exchange API (well, the possibilities are endless with such a rich dataset). 

Also, bear in mind Stack Exchange is running a competition and [offering an iPad2](http://blog.stackoverflow.com/2011/12/stack-exchange-api-v2-0-public-beta/) for the most awesome application submitted (that'd also give *Stack on Go* a great chance to become the best library ;) ). 

So If you always wanted to learn Go but never got the start, hope this would be a great motivator.

### Installation

Let's have a look how to get started with *Stack on Go*.

*Stack on Go* is fully compatible with Go1.

To install the package, run:

```bash
  go get github.com/laktek/Stack-on-Go 
```
 
### Basic Usage

Once installed, you can use *Stack on Go* by importing it in your source.

```go
  import "github.com/laktek/Stack-on-Go/stackongo"
```

By default, package will be named as `stackongo`. If you want, you can give an alternate name at the import.

Stack Exchange API contains global and site specific methods. Global methods can be directly called like this:

```go
  sites, err := stackongo.AllSites(params)
```

Before calling site specific methods, you need to create a new session. A site identifier should be passed as a string (usually, it's the domain of the site).

```go
  session := stackongo.NewSession("stackoverflow")
```

Then call the methods in scope of the created session.

```go
  info, err := session.Info()
```

Most methods accept a map of parameters. There's a special `Params` type that you can use to create a parameter map. 

```go
  //set the params
  params := make(stackongo.Params)
  params.Add("filter", "total")
  params.AddVectorized("tagged", []string("go", "ruby", "java"))

  questions, err := session.AllQuestions(params)
```

If you prefer, you can pass your parameters directly in a `map[string]string` literal:

```go
  questions, err := session.AllQuestions(map[string]string{"filter": "total", "tagged": "go;ruby;java"})
```

Most methods returns a `struct` containing a collection of items and meta information (more details available in [StackExchange docs](https://api.stackexchange.com/docs/wrapper) ). You can traverse through the results to create an output:

```go
  for _, question := range questions.Items {
		fmt.Printf("%v\n", question.Title)
		fmt.Printf("Asked By: %v on %v\n", question.Owner.Display_name, time.SecondsToUTC(question.Creation_date))
		fmt.Printf("Link: %v\n\n", question.Link)
	}
```

You can use the returned meta information to make run-time decisions. For example, you can check whether there are more results and load them progressively.

```go
  if questions.Has_more {
    params.Page(page + 1)
    questions, err = session.AllQuestions(params)
	}
```

### Authentication 

Stack Exchange follows the OAuth 2.0 workflow for user authentication. *Stack on Go* includes two helper functions tailored for authentication offered by the Stack Exchange API.

`AuthURL` returns you a URL to redirect the user for authentication and `ObtainAcessToken` should be called from the handler of redirected URI to obtain the access token.

Check the following code sample, which explains the authentication flow:

```go
  func init() {
    http.HandleFunc("/", authorize)
    http.HandleFunc("/profile", profile)
  }

  func authorize(w http.ResponseWriter, r *http.Request) {
    auth_url := stackongo.AuthURL(client_id, "http://myapp.com/profile", map[string]string{"scope": "read_inbox"})

    header := w.Header()
    header.Add("Location", auth_url)
    w.WriteHeader(302)
  }

  func profile(w http.ResponseWriter, r *http.Request) {
    code := r.URL.Query().Get("code")
    access_token, err := stackongo.ObtainAccessToken(client_id, client_secret, code, "http://myapp.com/profile")

    if err != nil {
      fmt.Fprintf(w, "%v", err.String())
    } else {
      //get authenticated user
      session := stackongo.NewSession("stackoverflow")
      user, err := session.AuthenticatedUser(map[string]string{}, map[string]string{"key": client_key, "access_token": access_token["access_token"]})
      
      // do more with the authenticated user
    }

  }
```

### Using with AppEngine

If you plan to deploy your app on [Google AppEngine](http://code.google.com/appengine/docs/go/), remember to do a one slight modification in your code. Since AppEngine has a special package to fetch external URLs you have to set it as the transport method for *Stack on Go*. 

Here's how to do it:

```go
  import (
    "github.com/laktek/Stack-on-Go/stackongo"
    "appengine/urlfetch"
  )

  func main(){
    c := appengine.NewContext(r)
    ut := &urlfetch.Transport{Context: c}

    stackongo.SetTransport(ut) //set urlfetch as the transport

		session := stackongo.NewSession("stackoverflow")
    info, err := session.Info()
  }
```

### Under the Hood

If you wish to write wrappers for other web app APIs in Go, you might be interested in knowing the implementation details of *Stack on Go*.

Actually, the implementation is fairly straightforward. The following method is the essence of the whole library. 

```go
  func get(section string, params map[string]string, collection interface{}) (error os.Error) {
    client := &http.Client{Transport: getTransport()}

    response, error := client.Get(setupEndpoint(section, params).String())

    if error != nil {
      return
    }

    error = parseResponse(response, collection)

    return

  }
```

Every method call is routed to above function with the relevant struct, path and parameters provided. Using the path and parameters, we generate the endpoint URL. This is then called using the `http.Client` methods. Afterwards, the response and the provided struct interface is passed to a custom parser function. There the response body is read and parsed using the `JSON.Unmarshall` method. The JSON output is finally mapped to the provided struct via the interface. This is what the called method finally returns.

I used `httptest`, which is available in Go's standard packages to unit test the library. All API calls were proxied (using a custom Transport) to a dummy server which serves fake HTTP responses. This setup makes it easy to test both request and response expectations easily.

```go
  func createDummyServer(handler func(w http.ResponseWriter, r *http.Request)) *httptest.Server {
    dummy_server := httptest.NewServer(http.HandlerFunc(handler))

    //change the host to use the test server
    SetTransport(&http.Transport{Proxy: func(*http.Request) (*url.URL, os.Error) { return url.Parse(dummy_server.URL) }})

    //turn off SSL
    UseSSL = false

    return dummy_server
  }

  func returnDummyResponseForPath(path string, dummy_response string, t *testing.T) *httptest.Server {
    //serve dummy responses
    dummy_data := []byte(dummy_response)

    return createDummyServer(func(w http.ResponseWriter, r *http.Request) {
      if r.URL.Path != path {
        t.Error("Path doesn't match")
      }
      w.Write(dummy_data)
    })
  }
```

For those who like to dig deeper the [source code is available on GitHub](https://github.com/laktek/Stack-on-Go). You can contact me if you need any help in using *Stack on Go*. Also, feel free to [report any issues and improvements](https://github.com/laktek/Stack-on-Go/issues).  

