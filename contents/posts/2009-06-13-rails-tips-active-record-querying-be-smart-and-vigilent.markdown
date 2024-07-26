---
legacy_slug: /2009/06/13/rails-tips-active-record-querying-be-smart-and-vigilent
layout: post
title: "[Rails Tips] Reduce Queries in ActiveRecord with :group"
published: true
meta:
  dsq_thread_id: "68172748"
  _edit_last: "1"
  _edit_lock: "1266367259"
tags:
- Ruby
- Code
type: post
status: publish
published_at: 1244851200000
---
I thought of sharing some tips in Ruby on Rails development, which would come in handy especially if you are a newbie.  The cornerstone of all of Rails' magic is ActiveRecord. As you know it's an <acronym title="Object Relational Mapper">ORM</acronym>, which hides all cumbersome and mundane SQL by a syntactic sugar coating. However, blind and lazy usage of ActiveRecord could really hurt your application's performance.  I found this particular instance when revisiting code of an app, I have written in my early days of Rails. As a newbie overdosed with ActiveRecord's magic, had written a blunt piece of code which looks horrible and also would make the app painfully slow.
<blockquote><strong>1550</strong> items in total (<strong>1350</strong> Available, <strong>150</strong> Out of Stock and <strong>50</strong> Discontinued)</blockquote>
This was the expected summary output. At surface, displaying such a block seems trivial, right?  I had the following in the view:

```erb
<%= @all_items_count %>; items in total (<%= available_items_count %> Available, <%= out_of_stock_items_count %> Out of Stock and <%= discontinued_items_count %> Discountinued)
```

Then in the controller, I have explicitly assigned the ActiveRecord query results all four variables. ('acts_as_state_machine' plugin provides the count_in_state method.)

```ruby
def index
   @all_items_count = Item.count :all
   @available_items_count = Item.count_in_state :available, :all
   @out_of_stock_items_count = Item.count_in_state :out_of_stock, :all
   @discontinued_items_count = Item.count_in_state :discontinued, :all
end
```

Technically this works. But can you spot the issue here? Lets get to terminal and inspect the app's logs. When rendering this action, it sends a query to database to get each of the four values. Database queries are costly and will cause a slow response.
<h3>Better Solution?</h3>
If we could reduce the number of database queries this action would be very effective. So is there a way we could reduce the number of Database queries? Remember that we can group the results of an SQL query? You can specify the :group option in ActiveRecord's query methods.  I modified the previous code to pass the :group option to the query:

```ruby
def index
   @items_in_state = Item.count :all, :group => "state"
end
```

Now, instead of four queries we are making <strong>only one</strong> database query. With the group option passed, ActiveRecord will return the results in the form of a Hash. So we can now grab the count of items in each state.  Lets change our view to adapt to the changes we did in the controller.

```erb
<%= count_items("all") %>; items in total (<%= count_items("available") %> Available, <%= count_items("out_of_stock") %> Out of Stock and <%= count_items("discontinued") %> Discontinued)
```

Here, I used a simple helper method called `count_items` to make it more elegant. Here is what goes in the helper:

```ruby
def count_items(state)
  return @items_in_state.inject(0) { |count, s| count + s[1] } if state == "all"
  @items_in_state.fetch(state, 0)
end
```

To return the total count, we could use `<a href="http://www.ruby-doc.org/core/classes/Enumerable.html#M003171">inject</a>` method, which would iterate through the hash to take the sum.  Also, keeping the basics in mind, we should index the database fields which is queried regularly. In this case, it is better to index of the `state` column of the table.  Mistakes like this are very obvious and could be easily avoided if you do the things with a sense. However know the trade-offs, always keep an eye on what's happening behind at the backstage. Don't let the faithful genie to turn into a beast.
