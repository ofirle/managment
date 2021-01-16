$(document).ready(function(){
    $("#status").val($("#status").attr('value'));
    console.log(status);
    $("#submit-edit-project").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        let url = "/project/add";
        if(paths_names[1] === 'project' && paths_names[3]){
            project_id = paths_names[3];
            url = "/project/set/" + project_id;
        }
        const data = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            city: $("#city").val(),
            address: $("#address").val(),
            status: $("#status").val(),
            payment_amount: $("#payment_amount").val()
        };
        const message = isValidForm(data);
        if(message !== true){
            alert(message);
        }

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                if(project_id !== undefined){
                    window.location.href = location.origin + "/project/" + project_id;
                }else{
                    window.location.href = location.origin + "/project/" + data.id;
                }
            // console.log("SUCCESS");
            }
        });
    });
});

function isValidForm(data){
    for (const property in data) {
        if(data[property] == ""){
            return ("Project was not updated. " + property + ' is Empty!');
        }
    }
    return true;
}