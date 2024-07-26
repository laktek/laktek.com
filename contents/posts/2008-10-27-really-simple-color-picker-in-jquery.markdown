---
legacy_slug: /2008/10/27/really-simple-color-picker-in-jquery
layout: post
title: Really Simple Color Picker in jQuery
published: true
meta:
  dsq_thread_id: "68171898"
  _edit_last: "1"
  _edit_lock: "1294940762"
tags:
- Code
- FOSS
- JS
type: post
status: publish
published_at: 1225065600000
---
<img title="screenshot of color picker" src="/images/posts/color_picker.png" alt="" /> Recently, I needed to use a color picker with predefined color palette for my work. Thanks to many enthusiastic developers, there are several <a title="Farbtastic popular jQuery color picker" href="http://www.google.com/url?sa=t&source=web&ct=res&cd=1&url=http%3A%2F%2Facko.net%2Fdev%2Ffarbtastic&ei=I8z_SI_EN4TmswLnzLH_Cw&usg=AFQjCNEqUt-sxpiKTYPVvrkC4cnp9h9cuQ&sig2=I3V3nLbYagbUA3H6hBAE2w">popular</a>, <a href="http://ui.jquery.com/repository/latest/demos/functional/#ui.colorpicker">sophisticated</a> color pickers already exist for <a href="http://www.jquery.com">jQuery</a>. However, most of these plugins looks complex as if they are made to be used in a online image editor. They are overwhelming for simple usage and less flexible for customization. So I had to write my own simple color picker from the scratch.

Usage of color picker is very straightforward. Users can either pick a color from the predefined color palette or enter hexadecimal value for a custom color. Compared to other plugins, it is very lightweight (<strong>it's only 5KB without compressing</strong>) and obtrusive to use. It doesn't require any dependencies apart from jQuery core and uses simple HTML/CSS for presentation.  You have the ability to easily customize the default color palette by adding more colors or replacing the palette with completely different set of colors.
<h3>Want to try?</h3>
If you want to see a demo before trying out by yourself, here is a simple <a href="http://laktek.github.com/really-simple-color-picker/demo.html"><strong>demo of the plugin</strong></a>.

<strong><a href="http://github.com/laktek/really-simple-color-picker/zipball/master">Download Color Picker via GitHub</a></strong>
<h3>Usage</h3>
Color Picker requires jQuery 1.2.6 or higher. So make sure to load it before Color Picker (there's no other dependencies!).
For default styles of the color picker load the CSS file that comes with the plugin.

```markup
<script src="jquery.min.js" type="text/javascript"></script>
<script src="jquery.colorPicker.js" type="text/javascript"></script>
```

Add a text field to take the color input.

```markup
<div><label for="color1">Color 1</label>
<input id="color1" name="color1" type="text" value="#333399" /></div>
```

Then call 'colorPicker' method on the text field when document loads.

```javascript
 jQuery(document).ready(function($) {
    $('#color1').colorPicker();
  });
```

Your favorite colors are missing? Just add them to the palette

```javascript
  //use this method to add new colors to palette
  $.fn.colorPicker.addColors(['000', '000', 'fff', 'fff']);
```

Or completely change the color palette as you need...

```javascript
  $.fn.colorPicker.defaults.colors = ['000', '000', 'fff', 'fff'];
```

That's all you have to do!

<h3>Future Improvements</h3>
This is only the initial release of Color Picker. There may be wild browser bugs or you may find smarter ways to improve the functionality of the plugin.  I'm open to all your suggestions and complaints. Leave a comment here or contact me directly.

Further, the <a href="http://github.com/laktek/really-simple-color-picker">code of the plugin is available via GitHub</a>, so if you feel like forking it and playing with it please do!

<h3>Update</h3>
Plugin now supports all major browsers including IE6! (Thanks muser for the patch)

<h3>Update #2 (October 14, 2009)</h3>
Color picker will automatically update it's color when the value of the input field is changed externally. (Thanks John for initially identifying the issue and Sam Bessey for pushing me on to this change :) )

<h3>Update #3 (February 17, 2012)</h3>
Made a significant change to support transparancy and other additional options. Special thanks for the contributions from [Daniel Lacy](http://daniellacy.com). Please refer the [README](https://github.com/laktek/really-simple-color-picker/blob/master/README.md) for more details.
