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
    navbarChanged();


    $("#submit-edit-color").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let color_id = undefined;
        let url = undefined;
        if(paths_names[1] === 'color' && paths_names[2]){
            color_id = paths_names[2];
            url = location.origin + "/color/set/" + color_id;
        }else{
            url = location.origin + "/color/create";
        }
        let project_id = $("#project_id").val();
        const data = {
            project_id: project_id,
            manufacturer: $("#manufacturer").val(),
            code: $("#code").val(),
            description: $("#description").val(),
        };
        console.log(data);
        for (const property in data) {
            if(data[property] === ""){
                console.log("Color was not updated. " + property + ' is Empty!');
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

function removeSubMenu(){
    $("#sub-nav").empty();
}

function navbarChanged(){
    $( ".nav-option" ).on( "mouseover", function() {
        $(this).css("font-weight: bold;");
        addSubMenu($(this).attr('id'));
    });
    $("nav" ).mouseleave(function(){
        $( "#sub-nav" ).html("");
    });
}

function addSubMenu(type){
    removeSubMenu();
    let html = "";
    switch(type){
        case 'project-nav':
            html = "<li><a style=\"font-size: 0.85em;\" href=\"/projects/\">Show All</a></li>\n" +
                "<li><a style=\"font-size: 0.85em;\" href=\"/project/create\">Add</a></li>";
            break;
        case 'payment-nav':
            html = "<li><a style=\"font-size: 0.85em;\" href=\"/payments/\">Show All</a></li>\n" +
                "<li><a style=\"font-size: 0.85em;\" href=\"/payment/\">Add</a></li>";
            break;
        case 'supplier-nav':
            html = "<li><a style=\"font-size: 0.85em;\" href=\"/suppliers/\">Show All</a></li>\n" +
                "<li><a style=\"font-size: 0.85em;\" href=\"/supplier/create\">Add</a></li>";
            break;
    }
    $( "#sub-nav" ).html(html);
}