$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: location.origin +"/commission/getCommissionsIds",
        dataType: 'json',
        contentType: 'application/json',
        success: function(data)
        {
            for (let i = 0; i < data.length; i++) {
                $("#commission_id").append(new Option(data[i].title, data[i].id));
            }
            let commission_id = $("#commission_id").attr('value');
            if(commission_id){
                console.log(commission_id);
                $("#commission_id").val(commission_id);
                $("#commission_id" ).prop( "disabled", true ); //Disable
            }
        }
    });
    navbarChanged();


    $("#submit-commission-payed").on("click", function(event){
        event.preventDefault();
        console.log("submit clicked");
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        console.log(paths_names);
        let commission_id = undefined;
        let url = undefined;
        if(paths_names[1] === 'commission' && paths_names[2] === 'payed'){
            commission_id = paths_names[3];
            url = location.origin + "/commission/payed/set/" + commission_id;
        }
        const data = {
            commission_id: commission_id,
            method: $("#method").val(),
            payed_date: Date.parse($("#payed_date").val())/1000

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
                window.location.href = location.origin + "/projects";
            }
        });
    });
});

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