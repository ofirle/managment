$(document).ready(function(){
    $("#status").val($("#status").attr('value'));
    $("#company").val($("#company").attr('value'));
    $("#start_date").val(getFormatDate($("#start_date").attr('value')));
    navbarChanged();
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
            phone: $("#phone").val(),
            city: $("#city").val(),
            address: $("#address").val(),
            status: $("#status").val(),
            company: $("#company").val(),
            start_date: Date.parse($("#start_date").val())/1000,
            payment_amount: $("#payment_amount").val()
        };
        const message = isValidForm(data);
        if(message !== true){
            // alert(message);
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

function getFormatDate(timestamp){
    let date = new Date(timestamp * 1000);
   return date.getFullYear() + '-' + fillerZeroes(date.getMonth().toString() + 1,2) +'-'+ fillerZeroes(date.getDate().toString(),2);
}

function fillerZeroes(string, num_chars){
    console.log("string:" + string);
    console.log("num_chars:" + num_chars);
    console.log("string.length:" + string.length);
    const zeroes_to_fill = num_chars - string.length;
    return "0".repeat(zeroes_to_fill) + string;
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