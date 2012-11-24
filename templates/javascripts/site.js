$(function(){

 /* HOME PAGE */

 // set the content based on screen width
 var paras_to_show = null;
 var reduce_lists_flag = false;

 var reduce_lists = function(){
   //reduce the lists
   if(reduce_lists_flag){
     //show only first 3 items
     $("div.home.posts ul").each(function(){
       var list_items = $(this).find("li");
       $(list_items).addClass('hide');
       $(list_items.splice(0, 3)).removeClass('hide');
     });
   }
   else {
     $($("div.home.posts ul").find("li")).removeClass('hide');
   }
 };

 var set_content_to_width = function() {
   var client_width = document.documentElement.clientWidth || document.body.clientWidth;
   if(client_width < 768){
     paras_to_show = 1;
     reduce_lists_flag = true;
   }
   else if(client_width > 768 & client_width < 1382){
     paras_to_show = 2;
     reduce_lists_flag = false;
   }
   else {
     paras_to_show = 3;
     reduce_lists_flag = false;
   }

   //trim the article
   if(paras_to_show > 0){
     var article_extract_obj = $("<div></div>");
     article_extract_obj.append(raw_article);

     $('article[role=latest] div.entry-content').html($(article_extract_obj.find('p')[paras_to_show]).prevAll(':not(h2, h3, h4, img, pre, p.skip-homepage)'));
     $('article[role=latest] div.entry-content').show();
   }

   reduce_lists();
 };

 // store the full article
 var raw_article = $('article[role=latest] div.entry-content').html();

 $(window).resize(set_content_to_width);
 //call the function on load
 set_content_to_width();

 //make title go back to home
 $("header h1, header h2").click(function(){
    location.href = "/";
 });

 /* Archive page */

 var filter_by_year = function(year){
  var pushState = arguments[1];
  $("div.posts ul li").each(function(){
    if(year == "archive"){
      $(this).removeClass('hide')
    }
    else if($(this).data('year') != parseInt(year)){
      $(this).addClass('hide');
    }
    else {
      $(this).removeClass('hide')
    }
  });

  //push history state
  if(pushState){
    if(window.history.pushState){
      if(year == "Any"){
        history.pushState({}, "Archive", "/archive");
      }
      else {
        history.pushState({}, "Archive - " + year, "/" + year + "/");
      }
    }
  }
 };

 var filter_by_tag = function(tag){
  var pushState = arguments[1];
  var matches_tag = function(obj, tag){
     var matches = -1;
     $.each($(obj).data('tags'), function(i, v){
        if(v.toLowerCase() == tag){
          matches++;
        }
     });
     return matches
  }
  $("div.posts ul li").each(function(){
    if(tag == "archive"){
      $(this).removeClass('hide')
    }
    else if(matches_tag(this, tag) < 0){
      $(this).addClass('hide');
    }
    else {
      $(this).removeClass('hide')
    }
  });

  //push history state
  if(pushState){
    if(window.history.pushState){
      if(tag == "Any"){
        history.pushState({}, "Archive", "/archive");
      }
      else {
        history.pushState({}, "Archive - " + tag, "/tag/" + tag + "/");
      }
    }
  }
 };

 var swap_filter_selector = function(selector) {

  $(".filter_selector").removeClass('active');
  selector.addClass('active');

	// show the filters section
	var visible_filter = $("#filter_" + $(selector).attr("rel"));
	var hidden_filter = $(".filters").not(visible_filter);
	hidden_filter.addClass("hide");
	hidden_filter.find("a.current").removeClass("current");
	visible_filter.removeClass("hide");

	// enable any filter
	if (!visible_filter.find("li a").hasClass("current")) {
		visible_filter.find("li.any a").addClass("current");
	}

 };

 var load_content_by_path = function() {
   var path = document.location.pathname;
   path_sections = path.split("/");

   if (path_sections[1] == "tag") {
     swap_filter_selector($("a.filter_selector[rel=tags]"));
   } else {
     swap_filter_selector($("a.filter_selector[rel=years]"));
   }
 }

 $("a[rel=next], a[rel=prev]").click(function() {
   var selector_without_controls = ':not([role=control])';
   var filter_parent = $(this).closest('menu');
   var current_filter = filter_parent.find('a.current').parent();
   var direction = $(this).attr('rel');

   if (direction === "next") {
     var filter_to_select = current_filter.next(selector_without_controls);
   } else {
     var filter_to_select = current_filter.prev(selector_without_controls);
   }

   filter_to_select = ( filter_to_select.length > 0 ) ? filter_to_select : $(filter_parent.children(selector_without_controls)[0]);

   //check whether the filter to select is hidden
   if(filter_to_select.hasClass('hide')){
      //make it visible
      filter_to_select.removeClass('hide');

      //hide the first visible selector on other end
      if(direction == "next"){
        $("ul.filters li:not(.hide, .any)").first().addClass('hide');
      }
      else {
        $("ul.filters li:not(.hide, .any)").last().addClass('hide');
      }
   }

   location.href = filter_to_select.children('a').attr("href");

   return false;
 });

 //switch filters
 $(".filter_selector").click(function(){

  if($(this).hasClass("active")){
    return false;
  }

  swap_filter_selector($(this));

  return false;
 });

 load_content_by_path();

});
