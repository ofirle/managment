$(document).ready(function() {
    supplierEdit();
    addCommission();
    navbarChanged();

});

//add-commission

function addCommission() {
    $("#add-commission").on("click", function () {
        var paths_names = (new URL(window.location.href).pathname).split('/');
        let supplier_id = paths_names[2];
        console.log("Add Commission Clicked: ");
        window.location.href = "/commission?supplier_id=" + supplier_id;
    });
}

function supplierEdit(){
    $("#edit-supplier").on("click", function() {
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let supplier_id = undefined;
        if(paths_names[1] === 'supplier' && paths_names[2]){
            supplier_id = paths_names[2];
        }
        console.log("Edit Supplier Clicked: " + supplier_id);
        window.location.href = "/supplier/edit/" + supplier_id;
    });
}

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
