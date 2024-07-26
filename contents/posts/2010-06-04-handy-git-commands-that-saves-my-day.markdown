---
legacy_slug: /2010/06/04/handy-git-commands-that-saves-my-day
layout: post
title: Handy Git commands that saves my day
published: true
meta:
  dsq_thread_id: ""
  _edit_lock: "1275748978"
  _edit_last: "1"
tags:
- Code
type: post
status: publish
published_at: 1275609600000
---
There are 3 essential weapons every developer should have in their armory. A text editor, a terminal and a source code management system. Picking powerful, flexible and personalized tools will make your workflows more productive. As a developer, I use Vim for text editing, bash as the terminal and Git for source code management.

Out of those, Git turns out to be the most fascinating piece of software to me. It's more than a SCM system. It represents a paradigm shift on the way we code. It's decentralized nature, gives freedom to experiment and innovate, without having worry about others' work. It brings sharing and collaboration of work to a new level. It's like the democracy in coding!

Basic understanding of pull-commit-push cycle of Git may be sufficient for most daily ethos. However, there are plethora of other options in it which deserves some time for comprehension. Here are some of such commands, which I found useful and use in my regular workflows.

<h3>git-rebase</h3>

When I first started to use Git, my workflow used to be like this:
```bash
  git pull origin master
  git checkout -b branch_for_new_feature
  git status
  git commit -am "commit message"
  <--cycle from step 2-4, until my work is complete-->
  git checkout master
  git merge branch_for_new_feature
  git push origin
```

However, on many occasions when I try to push the changes to remote server(origin), I will end up with the following error:

```bash
  ! [rejected] master -> master (non-fast forward) error: failed to push some refs to 'ssh://user@server:/repo.git'
```

This is because my colleagues have also pushed to the remote server, while I was working on the new feature. At this point, I could simply do a `git pull` to update my local repo, which would merge the remote changes with the current HEAD. On most cases, this leads to a chain of conflicts, which requires manual resolution. Due to my laziness (or lack of concentration), I often end up deleting what was on the HEAD and replace it with the upstream changes. Mid way, I realize I was actually deleting the new updates on the HEAD that were supposed to be pushed to the remote server. From that point onwards, cleaning up the mess involves pulling out my hair and lot of swearing!

Actually, there is a smarter way to do this. That is to use <a href="http://www.kernel.org/pub/software/scm/git/docs/git-rebase.html" target="_blank">git-rebase</a>. When you do a rebase, it saves all commits in the current branch that are not available in the upstream branch to a staging area, and reset the current branch to upstream branch. Then those saved commits would be reapplied on top of the current branch, one by one. With this process, it ensures my newest changes would remain as the newest.

The new workflow with rebasing would be:
```bash
  git pull origin master
  git checkout -b new-feature-branch
  git status
  git commit -am "commit message"
  <--cycle from step 2-4, until work is done-->

  git checkout master
  git pull origin master #update the master before merging the new changes
  git checkout new-feature-branch
  git rebase master #apply the new changes on top of current master

  git checkout master
  git merge new-feature-branch
  git push origin
```

Though it seems to be longer than the previous workflow, it helps me to stay away from unnecessary conflicts. Even if they do occur, resolution of them are pretty straight-forward, as I know for sure what is the newest change.

<h3>git-cherry-pick</h3>

While working on a new-feature-branch, I encounter quick fixes that are independent from the new feature; thus can be applied to master independently. Delaying the release of these fixes till new-feature-branch gets merged to master seems unnecessary. On such cases <a href="http://www.kernel.org/pub/software/scm/git/docs/git-cherry-pick.html" target="_blank">git-cherry-pick</a> comes in handy. As the name implies, you can pick exactly one commit (by the ref-id) and apply it to another branch. To avoid conflicts, those commits should be self-contained patches. If it depends on another commit, you will require to apply it first.

<h3>git-blame & git-show</h3>

Some days, you wake up to find some one has changed your pet hack! Rather than blaming the cat for eating the code; you can easily find out who is the real culprit, by running:

```bash
	git-blame application.js
```

It would return the author and last commit SHA for all lines in the file. You can even narrow down the output by specifying the starting and ending lines:

```bash
  git blame -L 450,+10 application.js
```

If you want to do further investigation, such as why did the author actually made this change and what are the other patches he committed along with this, you can run:

```bash
  git show last_commit_sha
```

<h3>git-bisect</h3>

With git-blame you were able to track down the issues that is visible to the naked eye. But most freaking bugs are spread out and harder to detect at a glance.

This is more common when you work as a team, each one would be working on modular sections and will have tests covering the code they write. Everything seems to be running smoothly, until you merge all modules together. Tests would start to fail and you are left with no clue what breaks the tests. On such instances, what we normally do is rollback the commits one by one, to find where it causes the trouble. But this can become a tedious process if you have large set of commits. In Git there's a handy assistant for this; it is the <a href="http://www.kernel.org/pub/software/scm/git/docs/git-bisect.html" target="_blank">git-bisect</a> command.

When you specify a range of commits it will continuously chop them in halves, using binary-search until you get to the last known good commit. Typical workflow with `git-bisect` is as follows:

```bash
	git bisect start
	# your repo would be switched to a temporary 'bisect' branch at this point

	# you mark the current HEAD of the repo as bad
	git bisect bad

	# Then you set the last known good version of the repo
	git bisect good version-before-merge

	# This will start the bisecting process.
	# Commits from last good version to current version will be chopped in half.

	# Then you run your tests
	rake test

	# Based on output of the test you mark the commit as good or bad
	git bisect good/bad

	# Git will chop the next subset automatically, and return for you to test

	# Test and marking process, will continue until you end-up with a single commit,
	# which is supposed to be the one which introduced the bug.

	# When bisecting process is done; run:
	git bisect reset

	# You will be returned to your working branch.
```

<h3>git-format-patch/git-apply</h3>

Contributing to some open source projects is easy as sending a pull request via <a href="http://www.github.com" target="_blank">GitHub</a>. But that's not the case with all. Especially in large projects such as Rails, you are expected to submit a ticket to the bug tracker attaching the suggested patch. You have to use the command <a href="http://www.kernel.org/pub/software/scm/git/docs/git-format-patch.html" target="_blank">git-format-patch</a> to create such a patch, which others can simply apply to their repositories for testing.

In the same way, if you want to test someone else's patches, you need to use the command <a href="http://www.kernel.org/pub/software/scm/git/docs/git-apply.html" target="_blank">git-apply</a>.

<h3>git submodule</h3>

<a href="http://www.kernel.org/pub/software/scm/git/docs/git-submodule.html" target="_blank">Git submodules</a> allows you to add, watch and update external repositories inside your main repository. It's my preferred way of managing plug-ins and other vendor libraries in Ruby or Node.js projects.

To add a submodule to your project, run:

```bash
	git submodule add repository_url local_path
```

When someone else takes a clone of your repo, they will need to run;
```bash
	git submodule init
	git submodule update
```

This will import the specified submodules to their environment. Deploying tools such as Capistrano has <a href="http://help.github.com/capistrano/" target="_blank">built-in support</a> for git submodules, which will run the above two commands, after checking out the code.

<h3>git help <em>command</em></h3>

Last, but not least I should remind you that Git has excellent documentation, which makes its learning process so easy. To learn the options and use cases of a certain command all you need to do is running:

```bash
	git help command
```

Apart from the default man pages, there are enough resources on the web on Git including the freely available books: <a href="http://progit.org/book/" target="_blank">Pro Git</a> and <a href="http://book.git-scm.com/index.html" target="_blank">Git Community Book</a>

If you have any other interesting tips on using Git, please feel free to share them in the comments.
