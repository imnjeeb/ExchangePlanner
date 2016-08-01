/////////////////////////////////////////////////////////////////////////////
// Populate the INPUT tag for the Expiry Date
/////////////////////////////////////////////////////////////////////////////
function populateInputDate (theDate, theId) {
    if(theDate != 'null') {
        var myDate = new Date(theDate);
        var myYear = myDate.getYear() + 1900;
        var myMonth = myDate.getMonth() + 1;
        var myDay = myDate.getDate();

        if(myMonth < 10) myMonth = '0' + myMonth;
        if(myDay < 10) myDay = '0' + myDay;

        $("#" + theId).val(myYear + '-' + myMonth + '-' + myDay);
    }
    else $("#" + theId).val(theDate);
}

/////////////////////////////////////////////////////////////////////////////
// OnLoad
/////////////////////////////////////////////////////////////////////////////
$(function(){
    // Populate the
    populateInputDate('<%= start_date %>', 'start_date');
    populateInputDate('<%= expiry_date %>', 'expiry_date');

    // Handle the Edit button
    $("#editButton").on('click', function(e){
        if($(this).text() == "Edit") {

            $("#company_name").prop("readonly", false);
            $("#expiry_date").prop("readonly", false);
            $("#cancelButton").prop ("disabled", false);

            $(this).text("Save");
        }
        else {
            // Apply the changes
            $("#company_name").prop("readonly", true);
            $("#expiry_date").prop("readonly", true);
            $("#cancelButton").prop ("disabled", true);

            $.ajax({
                url : '/api/company/<%= company_id %>',
                data : {
                    company_name : $("#company_name").val(),
                    expiry_date : $("#expiry_date").val()
                },
                type : "PUT"
            }).done(function(data){
                if(data.status == "OK") {
                    alert("Successfully updated " +  $("#company_name").val() + " info");
                    location.reload();
                }
                else {
                    alert("Failed to Edit user information\r\n" + data.message);
                }

                $("#editButton").text("Edit");
            });
        }
    });

    // Handle the Cancel button
    $("#cancelButton").on('click', function(e){
        $("form_profile").trigger("reset");

        $("#company_name").prop("readonly", true);
        $("#expiry_date").prop("readonly", true);
        $("#cancelButton").prop ("disabled", true);
        $("#editButton").text("Edit");
    });

});