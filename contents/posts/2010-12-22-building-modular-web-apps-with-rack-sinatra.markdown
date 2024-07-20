---
layout: post
title: Building Modular Web Apps with Rack &amp; Sinatra
published: true
meta:
  dsq_thread_id: ""
  _edit_lock: "1293764891"
  _edit_last: "1"
  _wp_old_slug: ""
tags:
- Code
- GSOC
- Ruby
type: post
status: publish
published_at: 1292976000000
---
Working on <a href="http://www.web2media.net/laktek/2010/05/01/im-with-opennebula-this-summer/">OpenNebula's Administration tool in last Google Summer of Code</a>, was one of the best development experiences I had during 2010. The project has been successfully completed and awaiting to be released with a future version of OpenNebula.

In this post, I would like to give some insights on its development, since I believe it stands as a good case study on how to build modular web apps, especially using Rack & Sinatra.

<h3>Background</h3>

Main objective of OpenNebula's Admin Tool is to enable easy management & monitoring of your OpenNebula cloud setup via a web based interface.
Basically, this includes management of users, hosts, virtual networks and virtual machines(VM). It's planned to be extended further to offer features like infrastructure checks, installation and configuration tweaking of an OpenNebula setup (which are already in development).

Also, it is expected to be self hosted, interfacing to an OpenNebula front-end server. It interacts with the OpenNebula using its Ruby API.

In order to achieve these requirements, the application needed to be modular, self-contained and easily customizable. If we used an opinionated framework like Rails, we would be spending majority of the development time on tweaking the framework for the problem domain, rather than focusing on the problem domain itself. However, on the other hand, building such fully featured app from the scratch within a 3-month timeline was not also realistic.

In this background I started exploring the possibilities of using a mini-frameworks(web DSLs), specifically <a href="http://sinatrarb.com">Sinatra</a>. From my mentor, I got to know that they have used Sinatra for certain parts of the OpenNebula project. So it was a safe bet to try for this context.

Since, Sinatra inherently follows the concepts of <a href="http://rack.rubyforge.org/">Rack</a>, its rich middleware stack can be used to bridge the functionality of the apps.

<h3>Collection of Mini-Apps</h3>

Looking at the overall app, it is composed of loosely coupled resource modules, which have minimal interaction or dependency between them. This made possible to contain each resource module in it's own mini app; which means adding, removing or customization of a module can be done without affecting the behavior of others.

```ruby
class HostsApp < Sinatra::Base

  #define the model
  require 'models/host'

  #define the views (based on mustache)
  register Mustache::Sinatra
  require 'views/hosts/layout'
  set :mustache, {
    :views => 'views/hosts',
    :templates => 'templates/hosts'
  }

  set :sessions, true

  get '/list', :provides => :json do
    Host.all.to_json
  end

  get '/list' do
    @hosts = Host.all
    @flash = flash

    unless @hosts.include?(:error)
      mustache :list
    else
      puts "Error: "+@hosts[:error]
      "<h1>Oops..An error occurred.</h1><p>#{@hosts[:error]}</p>"
    end
  end
end
```

Above, is an simplified example of how a mini-app is defined. It extends <em>Sinatra::Base</em> class and follows an explicitly defined <strong><abbr title="Model, View, Controller">MVC</abbr></strong> pattern. API calls are wrapped in a separate model class, while output generation is done using a <link>Mustache</link> based view templates. So it is basically similar to a controller in Rails.

In above code block, you may notice there are two routes defined for <em>GET /list</em> path. Only difference is one route has a condition: <em>provides</em>. Which means it only responds to requests accepting JSON as the content type. This way we can offer different response types for same resource (i.e. an API) in Sinatra.

<h3>Template Rendering</h3>

As I mentioned earlier I used <a href="http://mustache.github.com/">Mustache</a> for generating views of the project. This was also the first time I used Mustache and I was really hooked with its flexibility.

Mustache defers from traditional language specific templating schemes, by defining it's own logic-less template format. This makes it possible to reuse the same template on different contexts. For example, in this project I used the same template for server-side rendering with Sinatra and also again on client-side (with JavaScript), when data are loaded via a AJAX.

Exploring Mustache's capabilities in detail would take a post of it's own, so I leave it for a future post.

<h3>Routing</h3>

In order to form a one high-level application, individual mini-apps with different end-points, needed to be mapped to a single address space.

For this purpose, I used <a href="https://github.com/josh/rack-mount">Rack::Mount</a>, library written by Josh Peek, which also powers Rails3' default routing. It simply routes requests to individual Rack apps based on the path.

This is how the route set for the Admin Tool looks like (which I hope is self-explanatory):

```ruby
# route paths to different apps
Routes = Rack::Mount::RouteSet.new do |set|
  set.add_route UserSessionApp, { :path_info => %r{^/user_session*} }, {}, :user_session
  set.add_route HostsApp, { :path_info => %r{^/host*} }, {}, :host
  set.add_route VirtualNetworksApp, { :path_info => %r{^/vnet*} }, {}, :vnet
  set.add_route VirtualMachinesApp, { :path_info => %r{^/vm*} }, {}, :vm
  set.add_route UsersApp, { :path_info => %r{^/user*} }, {}, :user
  set.add_route DashboardApp, { :path_info => %r{^/$} }, {}, :dashboard

  #public file routes
  set.add_route Rack::File.new(File.dirname(__FILE__) + "/public"), { :path_info => %r{^/public*} }, {}, :public
end

# run the routeset
run Routes
```

<h3>User Authentication</h3>

Another important concern of this project was how to enforce user authentication. Admin console access needed to be restricted by the login credentials defined by <em>One Client</em> of OpenNebula.

There are several authentication middleware libraries available for Rack. Out of those, <a href="https://github.com/hassox/warden/wiki">Warden</a> seems to be the most flexible and well documented. Ability to define custom authentication strategies easily, also made it more suitable for our requirement.

This is how the authentication strategy based on <em>one_client</em> was defined using Warden:

```ruby
Warden::Strategies.add(:password) do
  def valid?
    params["user_name"] || params["password"]
  end

  def authenticate!
    u = get_one_client
    (u.one_auth == "#{params["user_name"]}:#{Digest::SHA1.hexdigest(params["password"])}") ? success!(u) : fail!("Could not log in")
  end
end
```

Another interesting thing about Warden is it only invokes when we explicitly calls it. Otherwise it just remains as an object in Rack environment, without getting in the way of application execution. In order invoke Warden, we can call it within a before filter in Sinatra. Request processing will continue or halt depending on the authentication result.

```ruby
before do
  #check for authentication
  unless env['warden'].authenticated?
    session["return_to"] = request.path
    redirect "/user_session/new"
  end
end
```

<h3>Other essential Rack Middleware</h3>

There are couple of other Rack middleware, that were used in this project, which provides some of the essential conveniences we have in Rails.

One such middleware is Rack::NestedParams (available in <a href="https://github.com/rack/rack-contrib">Rack Contrib package</a>), which is used handle nested form parameters properly. Also, <a href="http://nakajima.github.com/rack-flash/">Rack::Flash</a> is useful, which gives the option of adding flash messages (success, errors and warnings) to the app.

<h3>Source Code</h3>

You can view the full source code of the OpenNebula's Admin Tool from its repository at <a href="http://dev.opennebula.org/projects/one-admin-tool/repository">http://dev.opennebula.org/projects/one-admin-tool/repository</a>
