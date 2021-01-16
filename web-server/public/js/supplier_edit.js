$(document).ready(function(){
    $("#type").val($("#type").attr('value'));
    $("#submit-edit-supplier").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        let supplier_id = undefined;
        let url = "/supplier/add";
        if(paths_names[1] === 'supplier' && paths_names[3]){
            supplier_id = paths_names[3];
            url = "/supplier/set/" + supplier_id;
        }
        const data = {
            title: $("#title").val(),
            address: $("#address").val(),
            phone: $("#phone").val(),
            contact_name: $("#contact_name").val(),
            email: $("#email").val(),
            type: $("#type").val(),
        };
        console.log(data);
        console.log(url);
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
                const direct_id = supplier_id === undefined ? data.id : supplier_id;
                window.location.href = location.origin + "/supplier/" + direct_id;
            }
        });
    });
});

function isValidForm(data){
    for (const property in data) {
        if(data[property] == ""){
            return ("Supplier was not updated. " + property + ' is Empty!');
        }
    }
    return true;
}