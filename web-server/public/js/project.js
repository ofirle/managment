$(document).ready(function(){
    navbarChanged();


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

    $(".commission-payed").on("click", function() {
        const commission_id = $(this).parent().siblings('#id').first().html();
        console.log("Payed Commission Clicked: " + commission_id);
        window.location.href = "/commission/payed/" + commission_id;
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

    $("#delete-project").on("click", function(e) {
        console.log("delete clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[2]){
            project_id = paths_names[2];
        }
        let url = location.origin + "/project/delete";
        let data = {
            project_id: project_id
        };

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                window.location.href = "/projects";
            }
        });
    });


    $(".delete-payment").on("click", function(e) {
        console.log("delete Payment clicked");
        const payment_id = $(this).parent().siblings('#id').first().html();
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[2]){
            project_id = paths_names[2];
        }
        let url = location.origin + "/payment/delete";
        let data = {
            payment_id: payment_id
        };

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                window.location.href = "/project/" + project_id;
            }
        });
    });

    $(".delete-commission").on("click", function(e) {
        console.log("delete Commission clicked");
        const commission_id = $(this).parent().siblings('#id').first().html();
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[2]){
            project_id = paths_names[2];
        }
        let url = location.origin + "/commission/delete";
        let data = {
            commission_id: commission_id
        };

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                window.location.href = "/project/" + project_id;
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