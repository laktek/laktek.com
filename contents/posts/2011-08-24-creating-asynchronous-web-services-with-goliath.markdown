---
legacy_slug: /2011/08/24/creating-asynchronous-web-services-with-goliath
layout: post
title: Creating asynchronous web services with Goliath
published: true
meta:
  dsq_thread_id: "394386869"
  _edit_lock: "1314156864"
  _edit_last: "1"
  _wp_old_slug: ""
tags:
- Code
- Ruby
type: post
status: publish
published_at: 1314144000000
---
Recently, I've been working on improving the performance of <a href="http://curdbee.com">CurdBee</a> API. There were certain highly consumable end-points which also had tight coupling to external resources. I wanted to extract these endpoints out of the main app to cut the cruft and improve the throughput. 

This require to turn them into bare-metal services which can utilize asynchronous processing. Weighing on the amount of code we can reuse, it was better to stick with a Ruby implementation rather than switching to a specialized evented library such as <a href="http://nodejs.org/">Node.js</a>. However, implementing something like this in a Ruby is a challenge, because <a href="http://rack.rubyforge.org/">Rack</a> interface itself is not designed to be asynchronous.

Luckily, there are couple of ways to solve this problem. The most convincing solution I found, was to use the Goliath framework from <a href="http://goliath.io">PostRank labs</a>. It implements a fully asynchronous stack, which includes a web server and a Rack-compatible API. Goliath hides the complexity of asynchronous processing from the developer. With Goliath, you can continue to write your code in the traditional top-down flow avoiding "callback spagetti". 

<h3>Goliath's Magic Secret</h3>

Goliath serves to requests using a <a href="https://github.com/eventmachine/eventmachine/wiki">EventMachine</a> loop. For each request, Goliath creates a <a href="http://www.rubyinside.com/ruby-fibers-8-useful-reads-on-rubys-new-concurrency-feature-1769.html">Fiber</a>, a continuation method introduced in Ruby 1.9. A Fiber is paused or resumed by EventMachine callbacks on IO operations. 

Goliath handles all this by itself without needing the developer involvement. Which means developers are free to write code following the traditional top-down flow.

Goliath also implements a API closely related to Rack and ships common Rack middlewares modified for asynchronous processing. So from the outset, writing a Goliath app is very similar to writing any other Rack apps. 

<h3>Writing a Goliath app</h3>

Since Goliath depends on Fibers, you will require <a href="http://www.ruby-lang.org/en/downloads/">Ruby 1.9+</a> to write and deploy Goliath apps. Once you have setup Ruby 1.9 in your system, you can use <em>gem install goliath</em> to get Goliath.
  
If you have used other Rack Frameworks like <a href="http://sinatrarb.com">Sinatra</a> before, grasping Goliath's conventions would be very easy. A simple Goliath app is a ruby file with a class extending from <em>Goliath::API</em>. As in Sinatra, the file name should be the lower-case class name (for example, if your class name is <em>MyApi</em> then your file should be saved as <em>my_api.rb</em>).

Goliath ships bunch of common & frequently used middleware, re-written in asynchrnous manner. If you want to use any common middleware, make sure you use the Goliath equivalent. Also, if you want to write any custom middleware for your app, check <a href="https://github.com/postrank-labs/goliath/wiki/Middleware">Goliath documentation</a> for guidance.

Your endpoint class extending from <em>Goliath::API</em> must implement a method named <em>response</em>, which should return an array consisting the status, headers and body (similar to a response in Rack). 

Simple Goliath API implementation, will look like this: 

```ruby
require "rubygems"
require "bundler/setup" #using bundler for dependencies

require 'goliath'
require 'mysql2'
 
class MyApi < Goliath::API
  use Goliath::Rack::Params             # parse query & body params
  use Goliath::Rack::Formatters::JSON   # JSON output formatter
  use Goliath::Rack::Render             # auto-negotiate response format

  def response(env)
    #check the auth key
    if(!params.include?('auth_key') || params['auth_key'] != auth_key)
      [401, {}, "Unauthorized"]
    else
      response = {"total": 0} 

      [200, {}, response] #since we use the JSON formatter middleware, output will be formatted as JSON
     end
  end

end
```

Goliath supports the convention of multiple environments and provides a simple mechanism for environment specific configurations. You will have to create a <em>config</em> directory in app path and inside it you should create a file with the same name as your Goliath API, which defines the configurations. 

Very important thing you should always keep in mind is <strong>Goliath use a Fiber to process a request</strong>. Unlike Threads, Fibers are not preempted by a scheduler, which means a Fiber gets to run as long as it wants to. So if you use any blocking IO calls it will lock the process, defeating the whole purpose of using Goliath. When you are picking IO libraries make sure they are written in asynchronous fashion. Most common libraries do support asynchronous processing; for example <a href="https://github.com/brianmario/mysql2">Mysql2 gem</a> supports asynchornous connections via EventMachine & Fibers.

Here's how you can configure Mysql2 driver in Goliath to work in a non-blocking manner:

```ruby
require 'mysql2/em_fiber'

environment :development do
  config['db'] = EM::Synchrony::ConnectionPool.new(:size => 20) do
                                      ::Mysql2::EM::Fiber::Client.new(:host => 'localhost',
                                      :username => 'root',
                                      :socket => nil,
                                      :database => 'myapi_db',
                                      :reconnect => true)
                 end
end
```

On a database query, Goliath will pause the Fiber allowing other requests to be processed and will resume when it gets the results. 

<h3>Deploying with Capistrano</h3>

We are using Capistrano to deploy Goliath apps to production. Process is similar to deploying other Rack apps and we use the <a href="https://github.com/leehambley/railsless-deploy">railsless-deploy</a> gem  to avoid Rails specific conventions in Capistrano. Here's how our Capfile and deploy recipe look like:

<em>Capfile:</em>
```ruby
require 'rubygems'
require 'railsless-deploy'
load    'config/deploy'
```

<em>deploy.rb:</em>
```ruby
require 'capistrano/ext/multistage'

set :stages, %w(staging production)
set :default_stage, "production"

# bundler bootstrap
require 'bundler/capistrano'
```

<em>deploy/production.rb:</em>
```ruby

#############################################################
#	Application
#############################################################

set :application, "myapi"
set :deploy_to, "/home/app_user/apps/myapi"

#############################################################
#	Settings
#############################################################

default_run_options[:pty] = true
ssh_options[:forward_agent] = true
set :use_sudo, true 
set :scm_verbose, true
set :keep_releases, 3 unless exists?(:keep_releases)

#############################################################
#	Servers
#############################################################

set :user, "app_user"
set :domain, "0.0.0.0"
set :password, "app_pwd"

server domain, :app, :web
role :db, domain, :primary => true

#############################################################
#	Git
#############################################################

set :scm, :git
set :deploy_via,    :remote_cache
set :branch, "master"
set :repository, "ssh://git@repo_server/repos/myapp.git"

namespace :deploy do
    
  desc "Restart the app after symlinking"
  task :after_symlink do
    try_sudo "god restart myapi"
  end

end
```

<h3>Monitoring Goliath with God</h3>

Goliath is also a standalone app server, so you don't need any other Ruby app server to run Goliath apps. However, we use <a href="http://god.rubyforge.org">God</a> to monitor the Goliath process for memory leaks and automatically restart on failure. Here is the God config we are using for Goliath:

```ruby
app_path = '/home/app_user/apps/myapi/current'
app_env = 'prod'
ruby_path = '/usr/bin/ruby' #change this if you are using RVM

God.watch do |w|
  # script that needs to be run to start, stop and restart
  w.name          = "my_api" 
  w.interval      = 60.seconds

  w.start         = "cd #{app_path} && #{ruby_path} my_api.rb -e #{app_env} -p 9201 -d" 

  # QUIT gracefully shuts down workers
  w.stop = "kill -QUIT `cat #{app_path}/goliath.pid`"

  w.restart = "#{w.stop} && #{w.start}"

  w.start_grace   = 20.seconds
  w.pid_file      = "#{app_path}/goliath.pid" 

  w.uid = 'app_user'
  w.gid = 'app_user'

  w.behavior(:clean_pid_file)

  w.start_if do |start|
    start.condition(:process_running) do |c|
      c.interval = 60.seconds
      c.running = false
    end
  end

  w.restart_if do |restart|
    restart.condition(:memory_usage) do |c|
      c.above = 300.megabytes
        c.times = [3, 5]
      end

    restart.condition(:cpu_usage) do |c|
      c.above = 50.percent
      c.times = 5
    end
  end

  w.lifecycle do |on|
    on.condition(:flapping) do |c|
      c.to_state = [:start, :restart]
      c.times = 5
      c.within = 5.minute
      c.transition = :unmonitored
      c.retry_in = 10.minutes
      c.retry_times = 5
      c.retry_within = 2.hours
    end
  end
end
```

<h3>Proxying with Nginx</h3>

Finally, there should be a way to forward HTTP requests Goliath process(s). This can be done by setting up a simple Nginx proxy.

```bash
upstream myapi { 
 server localhost:9201; 
} 
 
server { 
 listen 80; 
 server_name myapi.myapp.com; 
 
 location / { 
   proxy_pass  http://myapi; 
 } 
```

Hope this information helps you to get started with Goliath, for further details please check the <a href="http://goliath.io">Goliath website</a>.
