
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

                var error = result.Error;
               // debugger;
                if (error === 'False'){
                    var heading = result.MyHFHeading;
                    var total   = result.Total;
                    var topics  = result.Topics;
                    var tools = result.Tools;

                    var header = $('<div />').addClass('header').html(heading);
                    var topic_wrap = $('<ul />');
                    $.each(topics, function(index, topic) {
                        console.log(index, topic);
                        var li = $('<li />').attr('id', topic.Id)
                        var h2 = $('<h2 />').text(topic.Title);
                        var img = $('<img />').attr('src', topic.ImageUrl   ).attr('alt', topic.ImageAlt);
                        var label = $('<label />').addClass('categories').text(topic.Categories);
                        var a_div = $('<div />');
                        var  a  = $('<a />').attr('href', topic.AccessibleVersion).text('Accessible Version');
                        a_div.append(a);

                         var img_logo = $('<img />').attr('src', topic.HealthfinderLogo  ).attr('alt', topic.HealthfinderLogo);
                          var  a_healthfinder  = $('<a />').attr('href', topic.HealthfinderUrl);
                            a_healthfinder.append(img_logo);
                      var Last_Update=$('<time />').text(topic.LastUpdate);
                        li.append(h2);
                        li.append(img);
                        li.append(label);
                        li.append(a_div);
                      //  li.append(img_logo);
                        li.append(a_healthfinder);
                        li.append(Last_Update);



                        topic_wrap.append(li);


                    });


                    $('#health-finder-results').append(header).append(topic_wrap);
                }
            }
        });
    });
});