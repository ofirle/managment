$(document).ready(function(){
    $("#method").val($("#method").attr('value'));
    $.ajax({
        type: "POST",
        url: location.origin +"/payment/getProjectsIds",
        dataType: 'json',
        contentType: 'application/json',
        success: function(data)
        {
            for (i = 0; i < data.length; i++) {
                $("#project_id").append(new Option(data[i].title, data[i].id));
            }
            project_id = $("#project_id").attr('value');
            if(project_id){
                console.log(project_id);
                $("#project_id").val(project_id);
                $("#project_id" ).prop( "disabled", true ); //Disable
            }
        }
    });



    $("#submit-edit-payment").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        console.log(paths_names);
        let payment_id = undefined;
        let url = undefined;
        if(paths_names[1] === 'payment' && paths_names[2]){
            payment_id = paths_names[2];
            url = location.origin + "/payment/set/" + payment_id;
        }else{
            url = location.origin + "/payment/create";
        }
        let project_id = $("#project_id").val();
        const data = {
            project_id: project_id,
            method: $("#method").val(),
            amount: $("#amount").val()
        };
        console.log(data);
        for (const property in data) {
            if(data[property] == ""){
                console.log("Payment was not updated. " + property + ' is Empty!');
                return;
            }
        }
        console.log(url);
        console.log(data);
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                console.log(data);
                window.location.href = location.origin + "/project/" + project_id;
            }
        });
    });
});