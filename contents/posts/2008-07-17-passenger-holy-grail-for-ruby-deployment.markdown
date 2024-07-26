---
legacy_slug: /2008/07/17/passenger-holy-grail-for-ruby-deployment
layout: post
title: Passenger - Holy Grail for Ruby Deployment
published: true
meta:
  dsq_thread_id: "68172590"
  _edit_lock: "1216302797"
  _edit_last: "1"
tags:
- Code
- Ruby
type: post
status: publish
published_at: 1216252800000
---
Popular notion about developing web apps with Ruby on Rails (or other Ruby frameworks) was "You can write a web app in 15 minutes, but it will take 15 days to deploy it correctly". Especially if you are coming from the world of PHP, where you have to just write the app and upload it, this might have been utterly confusing. Having to juggle with Apache/Nginx, Mongrel clusters, or FastCGI, just to deploy a simple web app would surely have sounded a nightmare.Â  You must have wondered countless number of times why doesn't it <strong>just work</strong> as in PHP ??

Well, finally you're prayers have been answered! Enter <a href="http://www.modrails.com/">Phusion Passenger</a>( a.k.a mod_rails or mod_rack), a module for Apache web servers, which will make deploying ruby app just a breeze. Yeah, like in good old PHP now you can now just upload your app and you're live! voila!

Thanks to Passenger, now you can use the same Apache web server where you hostedÂ  your legacy PHP apps, to deploy your Ruby apps. Also, if you cannot afford to pay for a VPS, you can even use a cheap Shared host such as <a href="http://www.dreamhost.com/r.cgi?183909">Dreamhost </a>(which already <a href="http://blog.dreamhost.com/2008/05/13/passenger-for-ruby-on-rails/">supports Passenger</a>). If it was the hassle of hosting the apps, which prevented you from developing in Ruby apps, it should not be a problem anymore.
<h3>So how I get up and running?</h3>
Installing Passenger is simple and the process is unbelievably user-friendly. All you have to run is just two commands in your terminal. (I assume you have installed Apache 2, Ruby and Ruby gems)

```bash
sudo gem install passenger
```

and then run,

```bash
passenger-install-apache2-module
```

<img src="http://articles.slicehost.com/assets/2008/5/1/mod_rails_install_1.jpg" alt="Passenger installation screen" />

Then you will be presented with the following guided installation process. Just do as it say and you're done!

If you are using Dreamhost, Passenger comes built-in with the hosting package. You have to enable it for the domain you wish to host your app, through the Dreamhost control panel.

Once you've installed (or enabled) Passenger, you could just upload the files using your favorite FTP program (or using SFTP/SSH)

When you make updates, you will need to restart the application to reflect the changes. It's also not that difficult all you have to do is to create a blank file called 'restart.txt' on your application's tmp/ directory. You could do this by running following command in the terminal.

```bash
touch /webapps/myapp/tmp/restart.txt
```

If you are used to automated deployment using <a href="http://capify.org">Capistrano</a>, deploying apps can be even simpler. Here is a <a href="http://tomcopeland.blogs.com/juniordeveloper/2008/05/mod_rails-and-c.html">sample recipe</a> on how to do that.

You need further information about Passenger,Â  the offical <a href="http://www.modrails.com/documentation/Users%20guide.html">user guide</a> and following <a href="http://www.rubyinside.com/28_mod_rails_and_passenger_resources-899.html">collection of resources</a> can be helpful.

<h3>Kudos</h3>
Few months ago there were lot of <a href="http://blog.dreamhost.com/2008/01/07/how-ruby-on-rails-could-be-much-better/">dispute</a> regarding <a href="http://www.rubyinside.com/no-true-mod_ruby-is-damaging-rubys-viability-on-the-web-693.html">complexity</a> of Ruby deployment, then <a href="http://www.loudthinking.com/posts/21-the-deal-with-shared-hosts">DHH (creator of Rails) openly invited</a> to someone to tackle the challenge rather than just complain. In this context, <a href="http://www.phusion.nl/">Phusion</a>, a small company in Dutch came up with Passenger. It's a truly a great effort which made our lives easy. <strong>Kudos</strong> for the fine folks over at Phusion, you guys really rock !
