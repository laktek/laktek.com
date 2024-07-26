---
legacy_slug: /2012/04/27/create-quick-html5-presentations-with-punch
layout: post
title: Create Quick HTML5 Presentations with Punch
published: true
tags:
- Code
- JS
- Punch
type: post
status: publish
published_at: 1335484800000
---

HTML5 presentations are cool and convenient. They just work in the browser and thanks to CSS3 & JavaScript they can be made to look even better than the traditional slides. It's easy to link to individual slides. Also, demos (if you're showing something related to web technologies) can done on the slides itself. There are already couple of good frameworks such as [Google's HTML5Slides](http://code.google.com/p/html5slides/), [deck.js](http://imakewebthings.com/deck.js/) and [impress.js](http://bartaz.github.com/impress.js) to create HTML5 presentations.

However, in all above frameworks, you have to define the slides as HTML blocks (usually wrapped inside a `div` or a `section`). It's fairly trivial; but you may feel editing the slides gets messy and verbose when you have dozens or more slides. Especially, if you are trying to put together a presentation in a rush (which you should try to avoid).

I felt the same while creating the [presentation on Punch](http://laktek.com/presentations/punch/slides.html), which I recently presented at [RefreshColombo](http://refreshcolombo.org). Then I realized [Punch](http://laktek.github.com/punch) itself can be used to make the process of creating HTML5 presentations quick and painless.

This is what I did. Rather than adding the slides in to the HTML page, I created them in a separate JSON file. Here's how it was structured.

```javascript
  {
    "slides": [
      {
      "slogan": "Main Title of Presentation"
      },

      {
        "slogan": "Title of the Slide"
      , "primary_text": "A summary or sub-title"
      },

      {
        "slide_title": "Title of the Slide"
      , "primary_text": "This is a slide with just text. This is a slide with just text."
      },

      {
        "slide_title": "Title of the Slide"
      , "image": "cat_picture.jpg"
      , "footnote": "Source: http://www.flickr.com/photos/splityarn/2363974905/"
      }
    ]
  }
```

Then I saved the HTML page for slides as a Mustache template. There I added a section for slides, which can be rendered iteratively based on different content (as defined in the above JSON). Here's the mustache portion of the template which would be rendered:


```markup

  ...

  {{#slides}}
  <article class="{{class}}" >

    {{#slogan}}
      <h2>{{{slogan}}}</h2>
    {{/slogan}}

    {{#slide_title}}
      <h3>{{{slide_title}}}</h3>
    {{/slide_title}}

    {{#primary_text}}
      <p class="primary">{{{primary_text}}}</p>
    {{/primary_text}}

    {{#image}}
      <img src="images/{{image}}" class="centered"/>
    {{/image}}

    {{#code}}
      <pre>{{code}}</pre>
    {{/code}}

    {{#list}}
      <ul class="build">
        <li>{{{.}}}</li>
      </ul>
    {{/list}}

    {{#secondary_text}}
      <p class="secondary">{{{secondary_text}}}</p>
    {{/secondary_text}}

    {{#footnote}}
      <p class="source">{{{footnote}}}</p>
    {{/footnote}}

  </article>
  {{/slides}}

  ...

```

Finally, I ran `punch` command to generate the following HTML5 Presentation - <a href="http://laktek.com/presentations/punch/slides.html">http://laktek.com/presentations/punch/slides.html</a>

I have created a [simple bootstrapper](https://github.com/laktek/punch-presenter), by extracting the common slide formats from my presentation, which you can use straight away. I used a slightly modified version of [Google's HTMl5Slides](http://code.google.com/p/html5slides/). If you are happy with the default styles, you can just edit the `contents/slides.json` file and replace it with your slides. When you are done, run the `punch` command in the top-most directory to generate the HTML output.

You can edit the default template (`templates/slides.mustache`) to define any additional blocks to use in the slides or even change the template entirely to use a different presentation framework such as [deck.js](http://imakewebthings.com/deck.js/) or [impress.js](http://bartaz.github.com/impress.js).

The source is available in [GitHub](https://github.com/laktek/punch-presenter). Fork it and use!
