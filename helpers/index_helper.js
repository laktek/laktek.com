var _ = require("underscore");
var path = require("path");

var helper_utils = require("punch").Utils.Helper;
var blog_content_handler = require("punch-blog-content-handler");

var latest_post;
var recent_posts;
var popular_posts;
var last_modified = null;

var popular_post_permalinks = [
	"/2008/10/27/really-simple-color-picker-in-jquery",
	"/2011/11/23/basic-patterns-for-everyday-programming",
	"/2011/03/03/introducing-jquery-smart-autocomplete",
	"/2012/04/19/punch-a-fun-and-easy-way-to-build-modern-websites",
	"/2010/05/25/real-time-collaborative-editing-with-websockets-node-js-redis"
];

var fetch_content = function(callback) {
	blog_content_handler.getAllPosts(function(err, posts_obj, posts_last_modified) {
		if (!err) {
			var all_posts = _.values(posts_obj);
			last_modified = posts_last_modified;

			latest_post = all_posts.pop();
			recent_posts = all_posts.slice(all_posts.length - 6).reverse();

			popular_posts = _.filter(all_posts, function(post) {
				return popular_post_permalinks.indexOf(post.permalink) > -1
			});

			blog_content_handler.getPost(path.join(latest_post.permalink, "index"), function(err, post_contents, modified_date) {
				if (!err) {
					latest_post = post_contents;
				}

				return callback();
			});
		}
	});
}

var tag_helpers = {

	latest_post: function() {
		return latest_post;
	},

	recent_posts: function() {
		return recent_posts;
	},

	popular_posts: function() {
		return popular_posts;
	}

};

module.exports = {

	directAccess: function(){
		return { "block_helpers": {}, "tag_helpers": {}, "options": {} };
	},

	get: function(basepath, file_extension, options, callback){
		var self = this;

		if (basepath !== "/index") {
			return callback(null, {}, {}, null);
		}

		fetch_content(function() {
			return callback(null, { "tag": tag_helpers }, {}, last_modified);
		});
	}

}
