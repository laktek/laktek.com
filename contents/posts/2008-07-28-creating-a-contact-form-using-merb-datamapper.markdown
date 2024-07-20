---
layout: post
title: Contact Form using Merb &amp; DataMapper
published: true
meta:
  dsq_thread_id: "68172597"
  _edit_lock: "1311335735"
  _edit_last: "1"
tags:
- Ruby
- Code
type: post
status: publish
published_at: 1217203200000
---
Major benefit of using Rails to develop web applications is its smart conventions, which promote developers to adapt to common patterns and avoid wasting time in reinventing the wheel. Rails is strictly bonded with a database and has a pre-defined directory structure. Though these conventions are helpful in common cases, it reduces the flexibility of its use in custom contexts.

If you are looking for a configurable yet smart framework, you should try out <a href="http://www.merbivore.com">Merb</a>. Approaching to version 1.0, Merb is quite stable. I found it's quite productive for lot of cases where Rails would've been too bulky. Using flexible ORM layer <a href="http://datamapper.org/">DataMapper</a>, with Merb makes the things even more simple.

Here is a simple example of using Merb and DataMapper to implement a Contact Form. Contact forms are used to mail the user feedback to site administrator. Generally, there's no need to store the information in a database. However it may be useful to do validations and Spam detection before sending the information. This can be implemented with Merb, by creating a flat application which would only have a single file and a configuration directory. Further DataMapper can be used to perform validations without creating a database.

<h3>Getting Started</h3>

First of all, you need to install Merb and DataMapper gems. I recommend you to install from the latest edge releases. <a href="http://www.slashdotdash.net/articles/2008/07/05/getting-started-with-merb-and-datamapper">This guide</a> will show you how to do that.

Now lets create a new Merb app.

``` bash
merb-gen app myapp --flat
```

By issuing directive "--flat" generator will create a flat file structure for the app. Basically, it would be two directories for configurations(config) and views, along with the application.rb, which will contain the code.

<h3>Configurations</h3>

Add the following stuff in 'config/init.rb' to prepare the application environment.

First we'll define the routes. Similar to Rails, Merb also supports <a href="http://brainspl.at/articles/2007/01/25/merb-gets-restfull-routes">RESTful routes</a>. We'll create a singular resource named 'contacts', to map to Contacts controller.

```ruby
Merb::Router.prepare do |r|
  r.resource :contacts

  r.default_routes
end
```

We need to have Merb Mailer, Merb helpers (form controls, etc), DataMapper-Core and DataMapper-Validations gems for this app. So lets define those dependencies.

```ruby
require "merb-mailer"
dependency 'dm-core'
dependency 'dm-validations'
dependency "merb_helpers"
```

Next, Specify the SMTP settings of your mail server, which would be used to send the mails.

```ruby
Merb::Mailer.config = {
    :host   => 'mail.example.com',
    :port   => '25',
    :user   => 'test@example.com',
    :pass   => '',
    :auth   => :plain,
    :domain => "example.com" # the HELO domain provided by the client to the server
  }
```

<h3>Implementation</h3>

Now let's move into 'application.rb' where we do the essential stuff.


Let's define a Contact class, which will be the DataMapper model. In configurations we didn't setup a database connection for DataMapper since we are not going to store information. So DataMapper will use the default Abstract adapter. This is good enough to provide ORM behavior without persistence. In the model we have defined the fields and the required validations. DataMapper offers smart validations such as "validates_format :email, :as => :email_address", which saves you from juggling with regular expressions.


```ruby
class Contact
  include DataMapper::Resource

  property :id, Integer, :serial => true
  property :name, String
  property :email, String
  property :message, String

  validates_present :name, :email
  validates_format :email, :as => :email_address
end
```


Next we have to setup the controller. Our controller will have two actions - show and create. Restful routes will match GET requests with the path '/contacts' to the show action. Similarly POST requests with the same path will be mapped to the create action.

```ruby
class Contacts < Merb::Controller
  def show
    @contact = Contact.new
    render
  end

  def create
    @contact = Contact.new(params[:contact])
    if @contact.valid?
      send_info
      render "Thank you."
    else
      render :show
    end
  end

private
  def send_info
    m = Merb::Mailer.new :to => 'lakshan@web2media.net',
                         :from => @contact.email,
                         :subject => 'Contact Form Results',
                         :text => "#{@contact.name} (#{@contact.email}) wrote : \n #{@contact.message}"
    m.deliver!
  end
end
```

We defined a private method 'send_info' to handle the mailer functionality.

```erb
 <%= error_messages_for :contact %>
 <% form_for :contact, :action => url(:contacts) do %>
      <div><%= text_control :name, :label => 'Name' %></div>
      <div><%= text_control :email,  :label => 'Email' %></div>
      <div><%= text_area_control :message, :label => 'Message' %></div>
      <%= submit_button 'Send' %>
 <% end %>
```

These form helper tags comes with the merb_helper gem.

<h3>Done ! </h3>

We have done the coding, now lets see how it works.

To start your app, in the terminal go to your app directory and run the command <code>merb</code>. Then direct your browser to 'http://localhost:4000/contacts' (normally merb loads in port 4000). Check whether it works correctly.

That's all folks! Isn't Merb sounds great?

I have uploaded the complete source of the sample to github - <a href="http://github.com/laktek/contact-form">http://github.com/laktek/contact-form</a>.
