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
                //debugger;
                if (error === 'False'){
                    var heading = result.MyHFHeading;
                    var total   = result.Total;
                    var topics  = result.Topics;
                    var tools = result.Tools;

                    var header = $('<div />').addClass('header').html(heading);
                    var topic_wrap = $('<ul />')
                    $.each(topics, function(index, topic) {
                        console.log(index, topic);
                        var li = $('<li />').attr('id', topic.Id).text(topic.Title);
                        topic_wrap.append(li);
                    });


                    $('#health-finder-results').append(header).append(topic_wrap);
                }
            }
        });
    });
});