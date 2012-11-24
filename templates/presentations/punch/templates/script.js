/*
    <script src="jquery.js"></script>
    <script src="mustache.js"></script>
    <script src="mustache_renderer.js"></script>
    <script src="script.js"></script>
*/

$(document).ready(function(){
	
  // Load and Render GitHub followers
  (function(){
    if($("#github_widget").length > 0){
      var renderer = new MustacheRenderer();

      renderer.afterRender = function(output){
        $("#github_widget").html("<strong>GitHub Watchers</strong><br/>" + output);
      };

      renderer.setTemplate('{{#followers}} \
                            <a href="http://github.com/{{login}}" rel="nofollow"><img size="16" src="{{avatar_url}}" title="{{login}}" alt="{{login}}"/></a> \
                            {{/followers}} \
                          ');
      renderer.setPartials({});

      $.getJSON("https://api.github.com/repos/laktek/punch/watchers?per_page=100", function(data){
        renderer.setContent({"followers": data});
      });
    }
  })();

});
