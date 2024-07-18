--- 
layout: post
title: Distraction Free Writing with Vim 
published: true
tags:
- Code
type: post
status: publish
---

I recently configured Vim to switch to a special writing mode upon opening Markdown files. It helps me to keep the focus while writing avoiding distractions. I first saw this concept in [iA Writer](http://www.iawriter.com/) and immediately fell in love with it. However,  my muscle memory was too tied with Vim and I didn't want to switch to a different editing environment solely for this purpose. Hence, I tried to make Vim to behave in a similar manner.

Check this screencast to see it in action:

<p class="skip-homepage">
<iframe src="http://player.vimeo.com/video/48860722" width="650" height="396" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
</p>

For anyone interested, these are the steps I took to setup it. Please note that I tried this with **MacVim** on OS X Lion. It may not work as expected in other versions or other OSs. 

* Installed syntax highlighting [plugin for Markdown](http://plasticboy.com/markdown-vim-mode/).

* Enabled [iA Writer color scheme](https://github.com/jacekd/vim-iawriter) for Vim. I made some [customizations](https://github.com/laktek/distraction-free-writing-vim/blob/master/colors/iawriter.vim) to get the current appearance.

* Added the following custom function into `.vimrc`, to run when a Markdown file is created or opened.

```vim
	" turn-on distraction free writing mode for markdown files
	au BufNewFile,BufRead *.{md,mdown,mkd,mkdn,markdown,mdwn} call DistractionFreeWriting()

	function! DistractionFreeWriting()
		colorscheme iawriter
		set background=light
		set gfn=Cousine:h14                " font to use
		set lines=40 columns=100           " size of the editable area
		set fuoptions=background:#00f5f6f6 " macvim specific setting for editor's background color 
		set guioptions-=r                  " remove right scrollbar
		set laststatus=0                   " don't show status line
		set noruler                        " don't show ruler
		set fullscreen                     " go to fullscreen editing mode
		set linebreak                      " break the lines on words
	endfunction
```

* I also added this setting to `.vimrc`, to toggle SpellChecking in normal mode.

```vim
	:map <F5> :setlocal spell! spelllang=en_us<CR>
```

* Installed the [Cousine font](http://www.fontsquirrel.com/fonts/cousine). It's a free alternative to Nitti Light, the font used by iA Writer.

* Turned off Mac OS X's native full-screen mode for MacVim (otherwise the custom background color is not applied).

```vim
	defaults write org.vim.MacVim MMNativeFullScreen 0
```

You can find the customized versions of all needed files in this [Git repo](https://github.com/laktek/distraction-free-writing-vim).

**Update**: I extracted the distraction free mode settings into its own plugin and allowed it to be toggled from the `F4` key (now it won't be forced upon opening Markdown files). Check the [repo in GitHub](https://github.com/laktek/distraction-free-writing-vim) for updated settings. 
