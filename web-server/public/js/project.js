$(document).ready(function(){
    $("#edit-project").on("click", function() {
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[2]){
            project_id = paths_names[2];
        }
        console.log("Edit Project Clicked: " + project_id);
        window.location.href = "/project/edit/" + project_id;
    });

    $(".edit-payment").on("click", function() {
        const payment_id = $(this).parent().siblings('#id').first().html();
        console.log("Edit Payment Clicked: " + payment_id);
        window.location.href = "/payment/" + payment_id;
    });

    $(".edit-commission").on("click", function() {
        const commission_id = $(this).parent().siblings('#id').first().html();
        console.log("Edit Commission Clicked: " + commission_id);
        window.location.href = "/commission/" + commission_id;
    });

    $(".edit-color").on("click", function() {
        const color_id = $(this).parent().siblings('#id').first().html();
        console.log("Edit Commission Clicked: " + color_id);
        window.location.href = "/color/" + color_id;
    });

    $("#add-payment").on("click", function() {
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        const project_id = paths_names[2];
        console.log("Add Payment Clicked: ");
        window.location.href = "/payment?project_id=" + project_id;
    });

    $("#add-commission").on("click", function() {
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        const project_id = paths_names[2];
        console.log("Add Commission Clicked: ");
        window.location.href = "/commission?project_id=" + project_id;
    });

    $("#add-color").on("click", function() {
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        const project_id = paths_names[2];
        console.log("Add Color Clicked: ");
        window.location.href = "/color?project_id=" + project_id;
    });

    $("#show-all-images").on("click", function() {
        console.log("Show all Images Clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[2]){
            project_id = paths_names[2];
        }
        window.location.href = "/project/images/" + project_id;
    });
});