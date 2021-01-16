$(document).ready(function() {
    supplierEdit();
    addCommission();
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
