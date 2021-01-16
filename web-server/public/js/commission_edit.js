$(document).ready(function(){
    $("#method").val($("#method").attr('value'));
    $.ajax({
        type: "POST",
        url: location.origin +"/payment/getProjectsIds",
        dataType: 'json',
        contentType: 'application/json',
        success: function(data)
        {
            for (let i = 0; i < data.length; i++) {
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
    $.ajax({
        type: "POST",
        url: location.origin +"/supplier/getSuppliersIds",
        dataType: 'json',
        contentType: 'application/json',
        success: function(data)
        {
            for (let i = 0; i < data.length; i++) {
                $("#supplier_id").append(new Option(data[i].title, data[i].id));
            }
            let supplier_id = $("#supplier_id").attr('value');
            if(supplier_id){
                $("#supplier_id").val(supplier_id);
                $("#supplier_id" ).prop( "disabled", true ); //Disable
            }
        }
    });



    $("#submit-edit-commission").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        console.log(paths_names);
        let commission_id = undefined;
        let url = undefined;
        if(paths_names[1] === 'commission' && paths_names[2]){
            commission_id = paths_names[2];
            url = location.origin + "/commission/set/" + commission_id;
        }else{
            url = location.origin + "/commission/create";
        }
        let project_id = $("#project_id").val();
        const data = {
            project_id: project_id,
            supplier_id: $("#supplier_id").val(),
            payment_method: $("#method").val(),
            item_cost: $("#item_cost").val(),
            item_description: $("#item_description").val(),
            percentage: $("#percentage").val()
        };
        console.log(data);
        for (const property in data) {
            if(data[property] === ""){
                console.log("Commission was not updated. " + property + ' is Empty!');
                return;
            }
        }
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