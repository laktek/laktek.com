---
layout: post
title: Introducing jQuery Smart AutoComplete...
published: true
meta:
  dsq_thread_id: "244628629"
  _edit_lock: "1299174395"
  _edit_last: "1"
  _wp_old_slug: ""
tags:
- Code
- JS
type: post
status: publish
published_at: 1299110400000
---
Few months ago, we did a major revamp in <a href="http://curdbee.com">CurdBee</a> UI. In this revamp we decided to make use of autocomplete on several data heavy inputs to improve the usability. We assumed any existing JavaScript autocomplete plugin could be easily modified to suit to our requirements.   

Unfortunately, that wasn't the case. None of those plugins were comprehensive and flexible enough to cover the cases we had in our hand. Here are some of the issues we faced with the existing plugins:

<ul>
  <li>They introduced whole bunch of new dependencies.</li>
  <li>They didn't support custom filtering algorithms.</li>
  <li>You cannot modify the HTML of results (also, styling the plugin generated markup becomes a nightmare).</li>
  <li>You cannot specify what to do when there are no results.</li>
</ul>

So I had to write a custom jQuery based autocomplete plugin to suit the requirements of CurdBee. Later, I used this same plugin on several other hobby projects with slight modifications. 

At this point, it made me realize this could be something that can be useful for others too. After couple of weeks of free-time hacking, I'm ready to introduce you to the <strong>Smart Autocomplete</strong> plugin!    

First of all, I suggest you to check different use cases of the plugin by visiting the <a href="http://laktek.github.com/jQuery-Smart-Auto-Complete/demo/index.html"><strong>demo page</strong></a>. If those examples pumps you, read on!

<h3>Basic Usage</h3>

<img src="/images/posts/basic_autocomplete.jpg" alt="Basic Autocomplete Screenshot" title="Basic Autocomplete Screenshot" style="float:none" />

Using Smart Autocomplete on your projects is easy. Only dependency it has is for jQuery core library. Make sure you have the latest jQuery core version (1.5 or above), if not you can download it <a href="http://docs.jquery.com/Downloading_jQuery">from here</a>. 

To get the Smart Autocomplete plugin visit its <a href="https://github.com/laktek/jQuery-Smart-Auto-Complete"><strong>GitHub page</strong></a>.

Once you have downloaded both jQuery and the Smart Autocomplete plugin, reference them in the header of your page like this:

```markup
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js" type="text/javascript"></script>
  <script src="jquery.smart_autocomplete.js" type="text/javascript"></script>
```

Now, define an input field to use for autocomplete.

```markup
  <div>
    <label for="fruits_field">Favorite Fruit</label>
    <input type="text" autocomplete="off" id="fruits_field"/>
  </div>
```

To enable autocompletion on the text field, you must select it using jQuery and call the <em>smartAutoComplete</em> method on it:

```javascript
  $(function(){

   $('input#fruits_field').smartAutoComplete({
    source: ['Apple', 'Banana', 'Orange', 'Mango']
   });

  });
```

As you can see in the above example, only required option is the <em>source</em>. Source defines the set of values that will be filtered when user starts typing on the field. Source can be either an array or a string specifying a URL. If you specify a URL, filter function will send an AJAX request to that URL, expecting a JSON array as a response (check <a href="http://laktek.github.com/jQuery-Smart-Auto-Complete/demo/index.html#example_2">Example 2</a>). 

You will also need to add couple of styles to display the results correctly.

```css
    ul.smart_autocomplete_container li {list-style: none; cursor: pointer; margin: 10px 0; padding: 5px; background-color: #E3EBBC; }
    li.smart_autocomplete_highlight {background-color: #C1CE84;}
```

Once you complete the above steps, your text field will have autocomplete capabilities.

<h3>Power of One-liners</h3>

Though Smart Autocomplete comes with sensible defaults, you can easily customize the default behavior by setting couple of one-line options.

If you check the <a href="http://laktek.github.com/jQuery-Smart-Auto-Complete/demo/index.html#example_2">Example 2</a>, you will notice the autocomplete field is defined as follows:

```javascript
    $("#country_field").smartAutoComplete({ 
      source: "countries.json", 
      maxResults: 5,
      delay: 200,
      forceSelect: true
    });
```

Apart from the required <em>source</em> field, it has 3 other options defined. The <em>maxResults</em> option sets the maximum number of results to be shown; <em>delay</em> option sets number of milliseconds plugin should wait (after user enters a key) before calling the filter function.

By setting <em>forceSelect</em> option to true, you can block free-form values in the autocomplete field. This means user have to either select a value from the given suggestions or the field will reset to blank.

You must have seen how Google Instant Search completes rest of the phrase in gray, with the best matching result. It's possible to implement similar behavior with Smart Autocomplete too.

<img src="/images/posts/type_ahead_screenshot.jpg" alt="typeAhead screenshot" title="typeAhead screenshot" style="float:none" />

```javascript
  $("#type_ahead_autocomplete_field").smartAutoComplete({
    source: ['Apple', 'Banana', 'Orange', 'Mango'],
    typeAhead: true
  });
```

All you got to do is to set <em>typeAhead</em> option to <em>true</em>. Isn't that easy?

You can find all available options of the plugin in the <a href="https://github.com/laktek/jQuery-Smart-Auto-Complete">README</a>.

<h3>Define your own Filtering Algorithm</h3>

Smart Autocomplete plugin gives you the flexibility to override the built-in filter function with a custom function. Custom filter function should return an array of results or a <a href="http://api.jquery.com/deferred.promise/">deferred promise</a>, which returns an array on resolve. If you call <a href="http://api.jquery.com/jQuery.ajax/">jQuery Ajax</a> methods, those will return an object containing a promise by default.  

In the <a href="http://laktek.github.com/jQuery-Smart-Auto-Complete/demo/index.html#example_5">5th example</a>, we use Quicksilver like filtering to filter the names of the Jazz musicians.

<img src="/images/posts/jazz_musicians-300x110.png" alt="Jazz Musicians Screnshot" title="Jazz Musicians Screnshot" style="float:none"/>

We use the <a href="http://rails-oceania.googlecode.com/svn/lachiecox/qs_score/trunk/qs_score.js">JavaScript port of Quicksilver string ranking algorithm</a>, which adds <em>score()</em> method to String prototype, to filter the items. 

Here's how the <em>smartAutoComplete</em> method is called on the field, with our custom filter function:

```javascript
  $("#jazz_musicians_field").smartAutoComplete({
        source: [
          "Scott Joplin",
          "Charles Bolden",
           //snip 
        ],

        filter: function(term, source){
            var filtered_and_sorted_list =  
              $.map(source, function(item){
                var score = item.toLowerCase().score(term.toLowerCase());

                if(score > 0)
                  return { 'name': item, 'value': score }
              }).sort(function(a, b){ return b.value - a.value });

            return $.map(filtered_and_sorted_list, function(item){
              return item.name;
            });
          }

        });
```

<h3>Do more with Events</h3>

Smart Autocomplete was written following an event-driven approach and therefore it emits events at the every major step in its process. You can bind handlers to these events similarly to other jQuery Events. Also, it's possible to cancel the default behavior on events by calling <em>ev.preventDefault()</em> method. This makes extension and customization of Smart Autocomplete so easy. 

In <a href="http://laktek.github.com/jQuery-Smart-Auto-Complete/demo/index.html#example_6">example 6</a>, we make use of the evented model of Smart Autocomplete to build multi-value selector. 

<img src="/images/posts/multi_select.jpg" alt="Multi Select Screenshot" title="Multi Select Screenshot" style="float:none" />

Let's see how the implementation is done:

```javascript
  $("#textarea_autocomplete_field").smartAutoComplete({source: "countries.json", maxResults: 5, delay: 200 } );
  $("#textarea_autocomplete_field").bind({

     keyIn: function(ev){
       var tag_list = ev.customData.query.split(","); 
       //pass the modified query to default event
       ev.customData.query = $.trim(tag_list[tag_list.length - 1]);
     },

     itemSelect: function(ev, selected_item){ 
      var options = $(this).smartAutoComplete();

      //get the text from selected item
      var selected_value = $(selected_item).text();
      var cur_list = $(this).val().split(","); 
      cur_list[cur_list.length - 1] = selected_value;
      $(this).val(cur_list.join(",") + ","); 

      //set item selected property
      options.setItemSelected(true);

      //hide results container
      $(this).trigger('lostFocus');
        
      //prevent default event handler from executing
      ev.preventDefault();
    },

  });
```

As shown in the above code, we have handlers bound to <em>keyIn</em> and <em>itemSelect</em> events. Lets try to understand the roles of these two handlers.

Smart Autocomplete plugin stores the context data on an event using a special <em>smartAutocompleteData</em> object. Default actions use these context data on its execution. For example, default <em>keyIn</em> action, gets the <em>query</em> parameter from the <em>smartAutocompleteData</em> object of the event. 

To implement multi-value select, we need to set the last phrase entered (text after the last comma) to the query parameter, which is passed to default <em>keyIn</em> action. The custom handler we've defined for <em>keyIn</em> event does that by overriding the <em>smartAutocompleteData</em> object's query field.  

The <em>itemSelect</em> handler we defined, will concatenate the selected item to the field. However, it also executes <em>ev.preventDefault()</em> to skip the default action from running. 

Apart from the two events we've used in the example, there are set of other events available to use. You can find the complete list in the <a href="https://github.com/laktek/jQuery-Smart-Auto-Complete">README</a>.

<h3>Digging Deeper</h3>

In this post, I only highlighted the most important features of the Smart Autocomplete plugin. You can learn more about plugin's capabilities by reading the README and also the Specs (which is available in <em>specs/core/</em> directory of the plugin) 

As always, I encourage you to fork the plugin's code from the <a href="https://github.com/laktek/jQuery-Smart-Auto-Complete"><strong>Github repo</strong></a> and modify it for your requirements. If you feel your changes can improve the plugin, please feel free to send a pull request via GitHub. 

Also, if you run into any issues in using the plugin, please report them to <a href="https://github.com/laktek/jQuery-Smart-Auto-Complete/issues">GitHub issues</a>.
