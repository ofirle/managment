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
                console.log(data);
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