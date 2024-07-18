--- 
layout: post
title: Simple Helper to Extract Values from a String
published: true
tags:
- JS 
- Code
type: post
status: publish
---

While writing a blogging engine based on [Punch](https://github.com/laktek/punch), I needed to implement a way to extract values from a path based on a permalink pattern defined by the user. 

After writing a helper function to solve this case, I realized it can be useful in other similar cases too. So I extracted it to a its own package named, [ExtractValues](https://github.com/laktek/extract-values). 

Here's how you can use it:

```javascript
var extractValues = require('extract-values');

extractValues('/2012/08/12/test.html', '/{year}/{month}/{day}/{title}.html')
>> { 'year': '2012', 'month': '08', 'day': '12', 'title': 'test' }

extractValues('John Doe <john@example.com> (http://example.com)', '{name} <{email}> ({url})')
>> {'name': 'John Doe', 'email': 'john@example.com', 'url': 'http://example.com' }

extractValues('from 4th October  to 10th  October',
				'from `from` to `to`',
				{ whitespace: 1, delimiters: ['`', '`'] })
>> {'from': '4th October', 'to': '10th October' }

extractValues('Convert 1500 Grams to Kilograms',
				'convert {quantity} {from_unit} to {to_unit}',
				{ lowercase: true })
>> {'quantity': '1500', 'from_unit': 'grams', 'to_unit': 'kilograms' }]

```

### Options

From the above examples, you may realize the helper function accepts several options. Let's see what those options mean.

**whitespace** - normalizes the whitespace in the input string, so it can be aligned with the given pattern. You can define the number of continuous whitespaces to contain in the string. Making it zero (0) will remove all whitespaces.

**lowercase** - converts the input string to lowercase before matching.

**delimiters** - You can specify which characters are the value delimiters in the pattern. 
Default delimiters are `{` and `}`.

This is intended to be used for matching trivial and definite patterns, especially in contexts where you want to give the option to end-users to provide patterns. For more complex and fuzzy matching, you would be better off with regular expressions.

You can check the [source in GitHub](https://github.com/laktek/extract-values) or directly install it from the NPM (`npm install extract-values`).

P.S.: There were some great suggestions and alternate language implementations in the [HackerNews discussion](http://news.ycombinator.com/item?id=4611429) for this post.

This helper since ported to several other languages:

* Ruby version - [https://github.com/ezkl/excise](https://github.com/ezkl/excise)
* Python version - [https://github.com/gnrfan/extract-values](https://github.com/gnrfan/extract-values)

