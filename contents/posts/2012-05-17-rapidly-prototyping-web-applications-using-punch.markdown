---
layout: post
title: Rapidly Prototyping Web Applications with Punch
published: true
tags:
- Code
- Punch
type: post
status: publish
published_at: 1337212800000
---

Process of prototyping a web application is two-fold. You will have to focus on the front-end, as well as the underlying data layer which powers it. Representation of the underlying data layer is what we usually call as the API. Front-end should know the types of data exposed by the API and also, API should know what data it should expose to the front-end. So it is essential to prototype these two layers hand in hand.

However, it's extremely difficult peel out and handle these two layers seamlessly with existing prototyping tools. After trying out different prototyping techniques, I finally settled with a simple workflow which is based on [Punch](laktek.github.com/punch).

In this post, I'll explain how to use this workflow to prototype a web application.

### Start with the Front-end

First of all, we should create a new project for the prototyping task. It can be done by running:

```bash
  > punch setup simple_issues
```

I thought it would be cool to create a prototype for a simple issue tacker similar to [GitHub Issues](https://github.com/laktek/punch/issues), hence the name simple issues. Inside the `simple_issues` directory you will find another 2 directories namely - contents &amp; templates and a config file.

Let's start off by prototyping the interface to show a list of issues. We shall create a file named `issues.html` in the `templates` directory. Personally, I used a boilerplate code based on [HTML5 boilerplate](http://html5boilerplate.com/) and [Twitter Bootstrap](http://twitter.github.com/bootstrap/) to build the prototype. Twitter Bootstrap is great for this kind of quick prototyping tasks. It's trivial to select a layout, add visual components and even assign basic interactivity to them. It allows us to focus on the overall arrangement, rather than spending time tinkering minor details.

After adding all essential UI blocks to the prototype, we can proceed to check the result on the browser. For this, we need to start Punch's development server (this is actually a new feature introduced in Punch, so make sure you have the latest version installed).

```bash
  > cd simple_issues
  > punch server
```

Punch server will start on port `9009` by default. You can visit `http://localhost:9009/issues` to view the result.

<iframe src="http://player.vimeo.com/video/42326121?title=0&amp;byline=0&amp;portrait=0" width="704" height="365" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>

Here's the [initial prototype I came up with](/samples/punch_prototype/issues.html).

### Extract the API

As I said before, front-end interface only covers part of the prototyping process. We need to figure out the API as well. For this, we have to look what are the real data needed to make the front-end meaningful.

In this example, list of issues are our main concern. Guided by the front-end, we can come up with a basic representation of the API response for a list of issues. Note that we use JSON as the data format for our API.

```json
  {
    "issues": [

      {
          "id": 8
        , "permalink": "http://localhost:9009/issue"
        , "title": "Any way to get Punch on windows?"
        , "user": {
            "name": "sc0ttwad3"
          }
        , "state": "closed"
      }
  }
```

We save our API prototypes in the `contents` directory using the same name as its front-end prototype (in this case `issues.json`).

In the original front-end prototype we had the list of issues hard-coded as a table:

```markup
  <table class="table table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Reported By</th>
        <th>State</th>
      </tr>
    </thead>

    <tbody>

      <tr>
        <td>8</td>
        <td><a href="#">Any way to get Punch on windows?</a></td>
        <td>sc0ttwad3</td>
        <td>Closed</td>
      </tr>

    </tbody>
  </table>
```

We shall replace those table rows with a [Mustache template](http://mustache.github.com/), so that we can hook the API prototype we just created.

```markup
  {{#issues}}
  <tr>
    <td>{{id}}</td>
    <td><a href="{{permalink}}">{{title}}</a></td>
    <td>{{user.name}}</td>
    <td><span class="label">{{state}}</span></td>
  </tr>
  {{/issues}}
  {{^issues}}
  <tr>
    <td colspan="4">Hooray! You have no issues.</td>
  </tr>
  {{/issues}}
```

Remember to save the protoype page again with the name "issues.mustache". Otherwise Punch will not know it needs to be generated.

### Refine and Repeat

Now you can try changing the `issues.json` file to see how it reflects on the front-end prototype. You can refine the front-end until you're satisfied with the representation of data. Also, you can tweak the API to suit to the requirements of the front-end.

Since Punch's development server generates the site on each request, you can check these changes immediately. Check the following demo to understand the full effect:

<p>
<iframe src="http://player.vimeo.com/video/42327378?title=0&amp;byline=0&amp;portrait=0" width="704" height="365" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
</p>

### Reuse Parts

Another benefit of using Punch for prototyping is you can easily reuse the parts that are repeated in prototypes. For example, if we want to prototype the page for an individual issue, we can reuse the header and footer sections we created earlier in the issues page. Move the repeatable block into a new file and give it a name starting with an underscore (eg. `_header.mustache`). Then Punch will treat it as a partial.

Here's the sample template for a single issue, which includes header and footer as partials:

```markup

  {{> header }}

  <div class="row-fluid">

    {{#issue}}
    <div class="span12">
      <h2>{{title}}</h2>
      <span>Reported by {{user.name}} on {{created_on}}</span>
      <p>{{{body}}}<p>
    </div>
    {{/issue}}

    <hr/>

    {{#comments}}
    <div class="comment">
      <span>{{user.name}} said ({{created_on}}):</span>
      <p>{{body}}</p>
    </div>
    {{/comments}}

  </div>

  {{> footer }}
```

### Moving on to Implementation

Once you are done with prototyping of the front-end and API for a feature, you can start the implementation of it. Designers can use the front-end prototype as the base for the actual template implementation. Since Mustache templates doesn't embed any logic, its definition can be easily translated in to any other templating language you prefer (such as ERB, Jade &amp; etc).

Similarly, the developers can use the prototyped API responses, as the expectations of the actual API implementation. Prototyping this way will help to reduce lot of impedance mismatches that normally arise during the integration of front-end and API.
