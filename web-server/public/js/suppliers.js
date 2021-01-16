$(document).ready(function() {
    rowListener();
});

function rowListener(){
    console.log("rowListener Called");
    $(".supplier-row").on("click", function(){
        const supplier_id = $(this).children('th').text();
        window.location.href = "/supplier/" + supplier_id;
    });
}