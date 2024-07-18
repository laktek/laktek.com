--- 
layout: post
title: Simple command line todo list
published: true
meta: 
  dsq_thread_id: "68172617"
  _edit_last: "1"
  _edit_lock: "1222580431"
tags: 
- Code
- FOSS
- Ruby
type: post
status: publish
---
They say <a href="http://lifehacker.com/software/notag/poll-results--tracking-to-dos-110928.php">pen and paper is the best</a> way to manage a todo list. Following the popular norm, I also started tracking my todos with pen and paper. But after several unsuccessful attempts of finding a pen or deciphering tasks from torn or soaked paper, I felt keyboard and the pixel-screen would be more accessible than the traditional method. Without relying on any sophisticated applications I relied on the most simple form - plain-text. It was better, but after being inspired from efforts like <a href="http://todotxt.com/library/todo.sh/">todo.sh</a> and<a href="bestpractical.typepad.com/worst_impractical/2006/09/todopl_or_how_i.html"> todo.pl</a>, I thought of coming up with a small command line utility of my own.
<h3>Enter todo gem!</h3>
This resulted in coding my first ruby gem - todo. It is just a simple command line utility for managing todos. I didn't want to loose the flexibility offered by plain-text lists, hence it will use human readable YAML form, to store the lists. This enables you to use your favorite text editor to edit these todo lists.
Further it supports tags. You could list the tasks by tags, thus making things smart and easy.

Todo gem will run specific to a directory. This enables to keep different task lists in each directory. For example, I keep a todo list in my 'home' directory which holds all my housekeeping stuff and then I have separate lists for each project I work on in their respective directories. This separation allows better organization of the things to be done.
<h3>Example</h3>
Here is a basic example of how todo gem works:

```ruby
  #visit your project folder
  cd projects/newapp

  #create a new todo list for the project
  todo create

  #add a new task
  todo add "write the specs"
  - add tags : important, due:24/08/2008

  #listing all tasks
  todo list --all

  #listing tasks tagged 'important'
  todo list --tag important

  #removing a task by name
  todo remove "write the specs"

  #removing a task by index
  todo remove -i 1
```

<h3>Get it!</h3>
To install todo gem in your machine simply run;

```bash
sudo gem install todo
```

Also the code of the <a href="http://github.com/laktek/todo">gem is hosted in github</a>, so you could fork and flip it in the way you want (and don't forget to send me a pull request).
