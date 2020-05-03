/* ------------------------------------------------------------------------------
*
*  # Alpaca - Basic inputs
*
*  Specific JS code additions for alpaca_basic.html page
*
*  Version: 1.0
*  Latest update: Mar 10, 2016
*
* ---------------------------------------------------------------------------- */

//function to make post requests
function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

$(function() {

    // Make Online Payment
    $("#payment_online_form").submit(function(e) {

        /*======================================================================================
         ===============  Please fill the result checking end point URL below ===================
         =======================================================================================*/
        var url = config.routes.base+'/pay_online/'+$("#online_pay_application_id").val(); // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $("#payment_online_form").serialize(), // serializes the form's elements.
            success: function(data)
            {
                //make container visible
                var result_container = $('#payment_online_result_container');
                result_container.removeClass('hidden');
                var result_content = '';

                switch (data['result']){
                    case "not_paid":
                        //redirect to payment page
                        url = config.routes.base+'/payment_redirect';
                        var mobile = data['mobile'];
                        var email = data['email'];
                        var name = data['name'];
                        var application_no = data['application_no'];
                        var order_id = data['order_id'];
                        post(url, {_token:window.Laravel.csrfToken, ORDER_ID:order_id,APPLICATION_NO: application_no, MOBILE:mobile, EMAIL:email, NAME:name});
                        break;
                    case "paid":
                        result_content = '<div><span class="bg-warning-700 text-highlight"> FEE FOR THIS APPLICATION NUMBER IS ALREADY PAID</span></div>';
                        result_content += '</div>';
                        break;
                }
                result_container.html(result_content);
            },
            error : function (err) {
                var result_container = $('#payment_online_result_container');
                result_container.removeClass('hidden');
                var result_content = '';
                result_content = '<div><span class="bg-warning-700 text-highlight">INVALID APPLICATION NUMBER</span></div><br><br>';
                result_container.html(result_content);
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });

    // Check payment status
    $("#payment_status_form").submit(function(e) {

        /*======================================================================================
         ===============  Please fill the result checking end point URL below ===================
         =======================================================================================*/
        var url = config.routes.base+'/payment_status/'+$("#application_id").val(); // the script where you handle the form input.
        $.ajax({
            type: "POST",
            url: url,
            data: $("#payment_status_form").serialize(), // serializes the form's elements.
            success: function(data)
            {
                //make container visible
                var result_container = $('#result_container');
                result_container.removeClass('hidden');
                var result_content = '';

                switch (data['result']){
                    case "not_paid":
                        result_content = '<div><span class="bg-warning-700 text-highlight">APPLICATION FEE NOT PAID</span></div><br><br>';
                        break;
                    case "paid":
                        result_content = '<div><span class="bg-success-700 text-highlight"> APPLICATION FEE PAID </span></div>';

                        result_content += '</div>';
                        break;
                }
                result_container.html(result_content);
            },
            error : function (err) {
                var result_container = $('#result_container');
                result_container.removeClass('hidden');
                var result_content = '';
                result_content = '<div><span class="bg-warning-700 text-highlight">INVALID APPLICATION NUMBER</span></div><br><br>';
                result_container.html(result_content);
            }
        });
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });


    //date of birth formatter
    $.fn.formatter.addInptType('A', /[0-3]/);
    $.fn.formatter.addInptType('B', /[0-1]/);
    $('#dob_of_student').formatter({
        pattern: '{{A9}}/{{B9}}/{{9999}}'
    });

    $('#date_of_tc').formatter({
        pattern: '{{A9}}/{{B9}}/{{9999}}'
    });

    $('#download_form_dob').formatter({
        pattern: '{{A9}}/{{B9}}/{{9999}}'
    });

    $('#year_of_leaving_school').formatter({
        pattern: '{{9999}}'
    });

    $('#permanent_address_pin').formatter({
        pattern: '{{999999}}'
    });
    $('#communication_address_pin').formatter({
        pattern: '{{999999}}'
    });

    //Show / Hide general_category_others select box based on general_category select box
    $('[name="general_category"]').on('change', function() {
        var general_category = this.value;
        var general_category_other_container = $('#general_category_other_container');
        var general_category_other = $('#general_category_other');

        if(general_category == "Other"){
            general_category_other_container.removeClass('hidden');
            general_category_other.addClass('required');
        }
        else{
            general_category_other_container.addClass('hidden');
            general_category_other.removeClass('required');
        }
    });

    //Show / Hide district and city based on state fields
    $('#state').on('change', function() {
        var state = this.value;
        var Kerala_container = $('#Kerala_container');
        var Karnataka_container = $('#Karnataka_container');
        var Tamilnadu_container = $('#Tamilnadu_container');
        
        if(state == "Kerala"){
            Kerala_container.removeClass('hidden');
            Karnataka_container.addClass('hidden');
            Tamilnadu_container.addClass('hidden'); 
        }
        else if(state == "Karnataka"){
            Karnataka_container.removeClass('hidden');
            Kerala_container.addClass('hidden');
            Tamilnadu_container.addClass('hidden'); 
        }
        else if(state == "Tamilnadu"){
            Tamilnadu_container.removeClass('hidden');
            Kerala_container.addClass('hidden');
            Karnataka_container.addClass('hidden'); 
        }
    });


    //Show / Hide communication address input fields based on value of "permanent_communication_same" check box
    $('#permanent_communication_same').on('change', function() {
        var same_address = this.checked;
        var communication_address_container = $('.communication_address_container');
        var communication_input = $('.communication_input');

        if(same_address){
            //permanent and communication addresses are same
            communication_address_container.addClass('hidden');
            communication_input.removeClass('required');
        }
        else{
            //permanent and communication addresses are not same
            communication_address_container.removeClass('hidden');
            communication_input.addClass('required');

            //reset form inputs
            communication_input.val('');
        }
    });


    //mapping course value list  in to text list for labels
    function course_name_mapping(institution_id){
        var course_name_list = [];
        var course_list = courses[institution_id];

        for(var i=0; i<course_list.length;i++){
            course_name_list.push(course_code[course_list[i]])
        }
        return course_name_list;
    }

    $("#institution_details").alpaca({
        "schema": {
            "type": "object",
            "properties": {
                "institution_id": {
                    "title": "Select the Institute that you want to apply for",
                    "type": "string",
                    "required": true
                },
                "course_id": {
                    "title": "Stream / Standard / Department you are applying for",
                    "type": "string",
                    "required": true,
                    "enum": null
                }
            }
        },
        "options": {
            "fields": {
                "institution_id": {
                    "id": "institution_id",
                    "type": "select",
                    //"hideInitValidationError" : true,
                    "sort": false,
                    "removeDefaultNone": false,
                    "noneLabel": "-- Select --",
                    // "styles": "required",
                    "dataSource": config.institutions_data,
                    "events": {
                        "change": function () {
                            var institution = this.getValue();
                            if(institution == '2' || institution == '12'){
                                $('#helper_gender_of_student').text("Admission to this Institution is restricted to girls only");
                                $('#gender_of_student').val('Female');

                                //remove auto lock for religion
                                $('#religion_of_student').attr('readonly', true);
                                $('#religion_of_student').val('Islam');
                            }
                            else{
                                //remove auto lock for religion
                                $('#religion_of_student').attr('readonly', true);
                                $('#religion_of_student').val('Islam');
                            }
                            if(institution == '8'){
                                $('#last_madrasa_wrapper > label').html('Name of Hifz Qura’n College you completed Hifz:  <span class="text-danger">*</span>');
                                $('#last_madrasa_wrapper > .help-block').removeClass('hide');
                                $('.hifz_completion_year_wrapper').removeClass('hide');
                                $('#hifz_year').addClass('required');
                                $('#last_class_madrasa').removeClass('required');
                                $('.last_class_madrasa_wrapper').addClass('hide');
                            } else {
                                $('.hifz_completion_year_wrapper').addClass('hide');
                                $('#hifz_year').removeClass('required');
                                $('#last_class_madrasa').addClass('required');
                                $('.last_class_madrasa_wrapper').removeClass('hide');
                                $('#last_madrasa_wrapper > label').html('Name of Madrassa attended in previous years: <span class="text-danger">*</span>');
                                $('#last_madrasa_wrapper > .help-block').addClass('hide');
                            }

                            if(institution){
                                institute_data = institutions.filter(i=>i.id==institution);
                                if (institute_data[0].message == '' || institute_data[0].message == null) {
                                    $('#institute_helper').addClass('hide');
                                } else {
                                    $('#institute_helper').removeClass('hide');
                                    $('#institute_helper_message').html(institute_data[0].message);
                                }
                            }

                        }
                    }
                },
                "course_id": {
                    "type": "select",
                    "removeDefaultNone": false,
                    "noneLabel": "-- Select --",
                    "events": {
                        "change": function () {
                            var institute = $('#institution_id').val()
                            if(institute == 1 || institute == 10 || (institute == 4 && this.getValue() != '18' )) {
                                $('#sslc_reg_no_container').removeClass('hidden');
                                //$('#sslc_reg_no').addClass('required');
                            } else{
                                $('#sslc_reg_no_container').addClass('hidden');
                                $('#sslc_reg_no').removeClass('required');
                            }
                        }
                    }
                }
            }
        },
        "postRender": function(control) {
            //apply select2 to each select inputs
            // $('#institute').select2({
            //     minimumResultsForSearch: Infinity
            // });

            var institute = control.childrenByPropertyId["institution_id"];
            var course = control.childrenByPropertyId["course_id"];

            course.subscribe(institute, function(val) {
                if (val == undefined) {
                    return;
                }
                this.schema.enum = courses[val];
                this.options.optionLabels= course_name_mapping(val);
                this.refresh();
                $("#institution_details").trigger('course-ready');
            });
            $("#institution_details").trigger('form-ready');

        }
    });


    // Select2 select Institution
    $("#select-institution-container").alpaca({
        "schema":{
            "required": true,
            "validate": true
        },
        "data":"",
        "options": {
            "type": "select",
            "id": "select-institution",
            "dataSource": "",
            "removeDefaultNone": false,
            "noneLabel": "-- Select --",
            "showMessages":true,
            "sort": false,
            "hideInitValidationError": true
        },
        "postRender": function(control) {
            $('#select-institution').select2({
                minimumResultsForSearch: Infinity
            });
        }
    });

});
