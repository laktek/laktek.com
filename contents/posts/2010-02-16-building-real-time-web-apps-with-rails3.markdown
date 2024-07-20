---
layout: post
title: Building Real-time web apps with Rails3
published: true
meta:
  dsq_thread_id: "68172462"
  _edit_lock: "1273022283"
  _edit_last: "1"
tags:
- Code
- Realie
- Ruby
type: post
status: publish
published_at: 1266278400000
---
On deciding the web framework to build <a target="_blank" href="http://www.web2media.net/laktek/tag/realie/">Realie</a>, one of the main considerations was should I move to a totally asynchronous framework? Most established web frameworks, including my favorite Rails is built in a synchronous manner and follows a call-stack based model. Real-time web apps needs to be asynchronous. <a href="http://en.wikipedia.org/wiki/Event-driven_programming">Evented programming model</a> ideally suits to this.

Since there were lot of hype around <a href="http://www.nodejs.org">Node.js</a> based async <a href="http://www.fabjs.org">web frameworks</a> in last couple of months, my initial idea was also to use such framework for my project. However, that felt as a totally new learning curve. Apart from grasping how to use JavaScript in server-side, it also meant I need to adopt to a totally new eco-system for templating, routing, etc.

However, when I revisit my requirement it was clear only a part of the web app really needs to be asynchronous. Most parts can still be done with a traditional call stack based web framework. Using a fully async. web framework  to build an entire app seems to be useless. Also, it felt an overkill to run two different apps to serve sync and async stuff.

In this context, I came to know about <a href="http://m.onkey.org/2010/1/7/introducing-cramp">Cramp</a>, a Ruby asynchronous framework written by Pratik Naik. Best thing about Cramp is capability of using Rack middlewares (keep in mind not fully Rack compliant). Then came the option how about using Rails and Cramp together to build a hybrid of real-time web app. With Rails3, it makes it so easy to mix any other Rack endpoint with Rails. So this sounded a perfect solution to my problem.

Since, Cramp follows evented model it needs an evented web server such as <a href="http://code.macournoyer.com/thin">Thin</a> or <a href="http://rainbows.rubyforge.org/">Rainbows!</a>. Further, Cramp has implemented websockets support for these two server backends.

<h3>Integrating Rails3 and Cramp</h3>

First of all, you will need to bundle Cramp gem, with your Rails app. For this, open the `Gemfile` and add the following:

```ruby
	gem "cramp", :require => 'cramp/controller'
```

For my work I only needed the Cramp controller (it has also got an async model) so for now I only required it.

As I mentioned earlier, to support web sockets, cramp needs to extend the web server we use. To specify the web server, I added an initializer (`config/initializers/cramp_server.rb`) with the following line :

```ruby
	Cramp::Controller::Websocket.backend = :thin
```

Then, I created a simple Cramp controller, which can respond to web sockets (`app/cramps/communications_controller.rb`)

```ruby
	class CommunicationsController < Cramp::Controller::Websocket
		periodic_timer :send_hello_world, :every => 2
		on_data :received_data

		def received_data(data)
			if data =~ /stop/
				render "You stopped the process"
				finish
			else
				render "Got your #{data}"
			end
		end

		def send_hello_world
			render "Hello from the Server!"
		end
	end
```

Now the fun part! The new Rails3 router supports pointing to any Rack compatible endpoint, so we can easily hook our cramp controller for public access. In `config/routes.rb` add the following:

```ruby
  match "/communicate", :to => CommunicationsController
```

Our Cramp endpoint can co-exist with rest of the Rails controllers without any issues.

<h3>Viola!</h3>

Another important change with Rails3 is its also a fully compatible Rack app now. This means as any other Rack app, we can also start our Rails app by running `rackup`.

```bash
	rackup -s thin -p 3000 --env production
```

This will start our app using Thin server backend on port 3000. Keep in mind, we need to provide an environment other than `development`, to avoid Rack Lint middleware. This is because Cramp is not a fully compatible with Rack SPEC and it will throw exceptions.
