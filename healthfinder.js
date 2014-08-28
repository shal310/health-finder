$(function () {
    $(document).on('click', '#health-finder-form', function (e) {

        //reset recommendations if already present
        $('#recommendations').empty();
  
        //Show Spinner
        $('#spinner').removeClass('hidden');

        e.preventDefault();
        var $recommendations = $('#recommendations');
        var $form = $(this);
        var api_key = 'omwwjzbtdcuhlnqu'; //registered against my email
        var age = $form.find('input[name=age]').val() || '25';
        var gender = $form.find('select[name=gender]').val() || 'male';
        var who = $form.find('select[name=who]').val() || 'someone';
        var is_pregnant = 0;

        var url = 'http://healthfinder.gov/developer/MyHFSearch.json?api_key= ' + api_key + '&who=' + who + '&age=' + age + '&gender=' + gender + '&pregnant=' + is_pregnant;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "jsonp",
            success: function (responseText) {
                var result = responseText.Result;
                if (result.Error === 'False') {
                    var main_heading = result.MyHFHeading;
                    var total = result.Total;
                    var topics = result.Topics;
                    var tools = result.Tools;
                    $.each(topics, function (index, topic) {
                        if (index > 10) return;
                        var data = {
                              sequence           : index
                            , id                 : topic.Id
                            , url                : topic.HealthfinderUrl
                            , logo               : topic.HealthfinderLogo
                            , title              : topic.Title
                            , last_update        : topic.LastUpdate
                            , image_alt          : topic.ImageAlt
                            , image_url          : topic.ImageUrl
                            , populations        : topic.Populations
                            , description        : topic.MyHFDescription
                            , related_items      : topic.RelatedItems
                            , category           : topic.MyHFCategory
                            , accessible_version : topic.AccessibleVersion
                            , sections           : topic.Sections
                            , categories         : topic.Categories
                            , category_heading   : topic.MyHFCategoryHeading
                        }

                        $.get('templates/recommendation.html', function (template, textStatus, jqXhr) {
                            var html = $(template).find('#health-recommender').html();
                            Mustache.parse(html);
                            var rendered = Mustache.render(html, data);
                            $recommendations.append(rendered);
                            $('#spinner').addClass('hidden');
                        });
                    });
                }
            }
        });
    });
});
