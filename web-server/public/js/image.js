$(document).ready(function(){
    // const realFileBtn = $("#real-file");
    // const customBtn = $("#custom-button");
    // const customTxt = $("#custom-text");
    navbarChanged();


    $("#real-file").on('change', function(){
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[3]){
            project_id = paths_names[3];
        }
           console.log("file Selected");
           let fd = new FormData();
           const files = ($("#real-file")[0].files[0]);
           fd.append('upload', files);
           fd.append('project_id', project_id);
           fd.append('description', "description");
           // let data = {
           //     upload: file
           // };
            $.ajax({
                url: location.origin + '/upload',
                type: 'post',
                data: fd,
                contentType:false,
                processData: false,
                success: function(response){
                    // if(response != 0){
                    //
                    // }
                }
            })
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