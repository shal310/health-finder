
var fetch_sections_markup = function(sections) {

    var div = $('<div />').text('Sections');
    var ul = $('<ul class="panel-group" id="sections-items"/>');

    $.each(sections, function(index, section){
        if(section) {
            var title = section.Title;
            var description = section.Description;
            var content = section.Content;

            var a = $('<a data-toggle="collapse" data-parent="#sections-items" href="#collapse-' + index + '" class="collapsed" />');
            var heading = $('<h4 />').attr('title', description).html(title);
            a.html(heading);
            var panel_div = $('<div class="panel-default" />').html(a);

            var content_div = $('<div class="panel-collapse collapse" id="collapse-' + index + '"/>');
            var p = $('<p />').html(content);
            content_div.html(p);

            var li = $('<li class="panel" />');
            li.append(panel_div);
            li.append(content_div);

            ul.append(li);
        }
    });

    div.append(ul);
    return div;
}


var fetch_related_items_markup = function(related_items) {

    var div = $('<div />').addClass('related-items').text("Related Items");
    var ul = $('<ul />').addClass('collapse in');

    $.each(related_items, function(index, related_item){
        if (related_item) {
            var title = related_item.Title;
            var url = related_item.Url;
            var item_type = related_item.Type;

            var a = $('<a target="_blank"/>').attr('href', url).text(title).attr('title', 'Opens in a new tab');
            var label = $('<i />').html('&nbsp; (' + item_type + ')');

            var li = $('<li />').append(a).append(label);

            ul.append(li);
        }
    });

    div.append(ul);
    return div;
}

var fetch_categories_markup = function(categories) {
   var div = $('<div />').text('Categories');
   var cats = $('<div />').addClass('categories').text(categories);

   div.append(cats);
   return div;
}

$(function(){

    $('#health-finder-form').on('submit', function(e){
        e.preventDefault();

        var $form = $(this);

        var api_key = 'omwwjzbtdcuhlnqu'; //registered against my email
        var age = $form.find('input[name=age]').val() || '25';
        var gender = $form.find('select[name=gender]').val() || 'male';
        var who = $form.find('select[name=who]').val() || 'someone';
        var is_pregnant = 0;

        //debugger;

        var url = 'http://healthfinder.gov/developer/MyHFSearch.json?api_key= ' + api_key + '&who=' + who + '&age=' + age + '&gender=' + gender + '&pregnant=' + is_pregnant;
        $.ajax({
            type : "GET",
            url  : url,
            dataType: "jsonp",
            success: function(responseText) {
                console.log(responseText);
                var result = responseText.Result;

                if (result.Error === 'False'){
                    var heading = result.MyHFHeading;
                    var total   = result.Total;
                    var topics  = result.Topics;
                    var tools   = result.Tools;

                    var outer_div = $('<div />').addClass('header').html(heading);
                    $('#health-finder-results').append(outer_div);

                    var topic_wrap = $('<ul />');

                    $.each(topics, function (index, topic) {
                        console.log(index, topic);

                        var id = topic.Id;
                        var title = topic.Title;
                        var logo = topic.HealthFinderLogo;
                        var image_url = topic.ImageUrl;
                        var image_alt = topic.ImageAlt;
                        var categories = topic.Categories;
                        var sections = topic.Sections;
                        var related_items = topic.RelatedItems;
                        var hf_url = topic.HealthfinderUrl;
                        var last_updated = topic.LastUpdate;


                        var li = $('<li />').attr('id', id);
                        var h4 = $('<h4 />').text(title);
                        li.append(h4);

                        var img_div = $('<div class="image-wrap" />');

                        var img = $('<img />').attr('src', image_url).attr('alt', image_alt);
                        var a_img_href = $('<a />').attr('href', '#');
                        a_img_href.html(img);

                        var last_update_time = $('<time />').text(last_updated);

                        img_div.append(a_img_href);
                        img_div.append(last_update_time);


                        var a = $('<a />').attr('href', topic.AccessibleVersion).text('Accessible Version').wrap('<div />');
                        li.append(a);

                        var img_logo = $('<img />').attr('src', image_url).attr('alt', 'Health Finder');
                        var a_healthfinder = $('<a />').attr('href', hf_url);
                        a_healthfinder.append(img_logo);

                        li.append(a_healthfinder);

                        var section_markup = fetch_sections_markup(sections);
                        li.append(section_markup);

                        var related_markup = fetch_related_items_markup(related_items);
                        li.append(related_markup);

                        var categories_markup = fetch_categories_markup(categories);
                        li.append(categories_markup);

                        topic_wrap.append(li);

                        outer_div.append(topic_wrap);

                    });
                }
            }
        });
    });
});