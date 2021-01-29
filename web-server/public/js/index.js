$(document).ready(function(){
    navbarChanged();

    $( "#company" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $( "#status" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $("#delete-project").on("click", function(e) {
        console.log("delete clicked");
        const project_id =$(this).closest('tr').children('th').text();
        let data = {
            project_id: project_id
        };

        e.stopPropagation();
        $.ajax({
            type: "POST",
            url: 'project/delete',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                alert(project_id + " Deleted");
            }
        });
    });

    rowListener();
});

function rowListener(){
        console.log("rowListener Called");
    $(".project-row").on("click", function(e){
        console.log($(this));
        const project_id = $(this).children('th').text();
        window.location.href = "/project/" + project_id;
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
function setFilters(data){
    $.ajax({
        type: "POST",
        url: 'projects/filter',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            let html = "    {{#each projects}}\n" +
                "    <tr class=\"project-row\">\n" +
                "        <th scope=\"row\">{{id}}</th>\n" +
                "        <td>{{first_name}} {{last_name}}</td>\n" +
                "        <td>{{address}}</td>\n" +
                "        <td>{{start_date}}</td>\n" +
                "        <td>\n" +
                "            <div class=\"progress\">\n" +
                "                <div class=\"progress-bar\" style=\"width: {{payment.process_percentage}}%\" role=\"progressbar\" aria-valuenow=\"{{payment.payed}}\" aria-valuemin=\"0\" aria-valuemax=\"{{payment.total}}\">{{payment.process_percentage}}%</div>\n" +
                "            </div>\n" +
                "        </td>\n" +
                "        <td>{{company}}</td>\n" +
                "        <td>{{adate}}</td>\n" +
                "        <td>\n" +
                "            <i id=\"edit-project\" class=\"fa fa-edit icon-clickable\" style=\"margin-left: 7px\"></i>\n" +
                "            <i class=\"fa fa-trash-alt icon-clickable\" style=\"margin-left: 7px\"></i>\n" +
                "        </td>\n" +
                "    </tr>\n" +
                "    {{/each}}";
            const template = Handlebars.compile(html);
            const result = template(data);
            $( "tbody" ).html(result);
            rowListener();
        }
    });
}

function getFilters(){
    let data = [];
    getFilterCompany(data);
    getFilterStatus(data);
    return data;
}

function getFilterCompany(data){
    const company = $( "#company" ).val();
    if(company !== 'ALL'){
        data.push({object: 'COMPANY', value: company});
    }
}

function getFilterStatus(data){
    const status = $( "#status" ).val();
    if(status !== 'ALL'){
        data.push({object: 'STATUS', value: status});
    }
}

function removeSubMenu(){
    $("#sub-nav").empty();
}
