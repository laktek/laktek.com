---
layout: post
title: Modal dialogs without React (or JavaScript)
description: How you can use button properties to control native HTML dialog without a single line of JavaScript.
new_slug: modal-dialogs-without-react-javascript
published: true
tags:
- webdev
published_at: 1762710655419
---

<video src="/videos/posts/show-modal.mp4" autoplay loop muted></video>

This is probably old news, but it went under my radar.

This weekend, I was tinkering with a little hobby project and stumbled on MDN docs for [`<button>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button).
I noticed a relatively unfamiliar `command` attribute, which can take values such as "show-modal" and "request-close", among others.

This led me to discover the [native HTML `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), which is supported by all major browsers for quite some time (Safari and Safari iOS added it in version 15.4, which was released more than 3 years ago). All front-end code bases I've touched in the past 5-6 years would use some React-based UI library, and it would have its own Dialog component.

The `command` attribute for the button has an accompanying `commandfor` attribute, which can be an ID of an element. This means a native HTML `<dialog>` can be controlled entirely from HTML without needing any JavaScript.

```xml
<button commandfor="sample-dialog" command="show-modal">
  Open Dialog
</button>

<dialog id="sample-dialog">
    <div>This is a sample dialog</div>
    <button commandfor="sample-dialog" command="close">Close</button>
</dialog>
```

However, my excitement was short-lived as I discovered `command` and `commandfor` are [currently not supported by Safari](https://caniuse.com/?search=command).

You can still try the [example](/examples/dialog-command) in a supported browser (tip: right-click to view source)

<iframe width="600" height="300" src="/examples/dialog-command"></iframe>

## Popover (non-modal)

However, the MDN docs further said `commandfor` is a more general version of `popovertarget`.
Turns out, there are two other attributes supported by `<button>`, called `popovertarget` and `popovertargetaction`.
This can be used to declaratively control the [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), which is intended for creating popover content on top of regular page content. Any HTML element can be turned into a popover by simply adding a `popover` attribute.
Great news is [Safari and Safari iOS supports](https://caniuse.com/?search=popover) `popover` along with `popvertarget` and `popovertargetaction`.

Here's an HTML dialog controlled via declarative popover API.

```xml
<button popovertarget="sample-dialog" popovertargetaction="toggle">
  Open Dialog
</button>

<dialog popover id="sample-dialog">
    <div>This is a sample dialog</div>
    <button popovertarget="sample-dialog" popovertargetaction="hide">Close</button>
</dialog>
```

[Result](/examples/dialog-popover):

<iframe width="600" height="300" src="/examples/dialog-popover"></iframe>

This works in all major browsers, including both Safari and Safari iOS. Caveat is that it's not a modal - the rest of the page elements remain interactive (for example, you can still click a link under the dialog).

## showModal()

It's possible to turn the dialog into a modal with a single line of JavaScript. This works in [all major browsers](https://caniuse.com/?search=showmodal) (yeah, I know this is kinda cheating as the title of the blog post said "without JavaScript").

The API is straightforward. The `<dialog>` element has a DOM method called `showModal`, which can be used to turn it into a modal using JavaScript. It also has a corresponding `close` method to close the modal.

We can call these methods on the click handlers of the button.

```xml
<button onClick="document.getElementById('sample-dialog').showModal()">
  Open Dialog
</button>
<dialog id="sample-dialog">
  <div>This is a sample dialog</div>
  <button onClick="document.getElementById('sample-dialog').close()">
    Close
  </button>
</dialog>
```

[Result](/examples/dialog-show-modal):

<iframe width="600" height="300" src="/examples/dialog-show-modal"></iframe>


## ::backdrop

Backdrops and overlays have been my pet peeve when it comes to dealing with modals in the past. I've encountered numerous CSS hacks for this problem throughout my career. There's always an element with `z-index: 9999 !important` piercing through the backdrop or some element stealing the focus on the tab.

Thankfully, the `< dialog>` elements also come with a `::backdrop` pseudo-class, which solves most of these problems. No more hacky background `<div>`s.

Here's how we can add a simple glass effect backdrop to our modal.

```css
  dialog::backdrop {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(5px);
  }
```

[Result](/examples/dialog-show-modal-with-backdrop):

<iframe width="600" height="300" src="/examples/dialog-show-modal-with-backdrop"></iframe>

## Don't trust the LLMs?

After going down the MDN docs rabbit hole, I wondered if I had asked an LLM instead, would it have used these APIs to build the modals? This seemed like a routine task that LLMs would have encountered before.

To my surprise, both GPT-5 and Claude Sonnet 4.5 immediately resorted to using a React-based solution.

GPT-5:

![gpt-5 output](/images/posts/gpt-5-modal-example.png)

Claude Sonnet 4.5:

![Claude Sonnet 4.5 output](/images/posts/sonnet-4-5-modal-example.png)
