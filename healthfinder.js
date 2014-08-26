$(function () {
    $('#health-finder-form').on('submit', function (e) {
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
                    var heading = result.MyHFHeading;
                    var total = result.Total;
                    var topics = result.Topics;
                    var tools = result.Tools;
                    $.each(topics, function (index, topic) {
                        var data = {
                            sequence      : index,
                            id            : topic.Id,
                            title         : topic.Title,
                            logo          : topic.HealthFinderLogo,
                            image_url     : topic.ImageUrl,
                            image_alt     : topic.ImageAlt,
                            categories    : topic.Categories,
                                 sections : topic.Sections,
                            related_items : topic.RelatedItems,
                                  hf_url  : topic.HealthfinderUrl,
                            last_updated  : topic.LastUpdate
                        }
                        $.get('templates/recommendation.html', function (template, textStatus, jqXhr) {
                            var html = $(template).filter('#health-recommender').html();
                            Mustache.parse(html);
                            var rendered = Mustache.render(html, data);
                            $recommendations.append(rendered);
                        });
                    });
                }
            }
        });
    });
});