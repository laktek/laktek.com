---
legacy_slug: /2008/10/31/extended-bort-my-base-rails-app
layout: post
title: "Extended-Bort: My base Rails app"
published: true
meta:
  dsq_thread_id: "68172664"
  _edit_lock: "1244943892"
  _edit_last: "1"
tags:
- Code
- FOSS
- Ruby
type: post
status: publish
published_at: 1225411200000
---
<a href="http://github.com/fudgestudios/bort/tree/master">Bort</a> is an awesome base Rails app, which allows you to get into real action without wasting your time on setting up the most common and boring stuff. It comes with RESTful Authentication, OpenID support, Capistrano Mutli-stage deployments and many other essential plugins, thus lifting good work load. I first got to use Bort when developing <a href="http://myconfapp.com">MyConf</a> for <a href="http://www.railsrumble.com">Rails Rumble</a>, where agility mattered to the maximum. Since, I felt it would be ideal to use Bort as the cookie cutter for my future Rails apps as well. However, I felt there needs to be several changes to make it more ideal for my workflow. Hence, I forked Bort and came up with <a href="http://github.com/laktek/extended-bort/">Extended-Bort!</a>

<h3>What are the changes?</h3>

<ul>
	<li>Git Submodules are used to keep Rails and other plugins updated.</li>
	<li>Included Rails 2.2.0 with tha app</li>
	<li>Added annotate-models and make_resourceful plugins </li>
	<li>Added Action Mailer initializer and SMTP settings for production mode</li>
	<li>Uses admin email specified in settings.yml in exception notifier</li>
	<li>Replaced rSpec story runner with new Cucumber Scenario Framework (webrat and cucumber plguins are included)</li>
	<li>Replaced Prototype js with jQuery</li>
	<li>Replaced asset_packager with bundle_fu for bundling assets</li>
	<li>Changed Stylesheets by adding an initial stylesheet, application stylesheet and Hartija CSS print stylesheet</li>
</ul>

<h3>Want to Use?</h3>

If you feel like using Extended-Bort, follow these steps:

```bash
 git clone git://github.com/laktek/extended-bort.git
 git submodule init
 git submodule update
```

Edit the database.yml and the settings.yml files

```bash
 Rake db:migrate
```

Change the session key in config/environment.rb and REST_AUTH_SITE_KEY in environments config (you can generate keys using rake:secret)

Have a brew and celebrate (from original Bort guys, but you can still do it ;) )
