$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: location.origin +"/project/getSharedCompanies",
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            // if(!data.companies.isEmpty()) {
                let html = '<p style="color:red">For these projects. The figure of the amount is the relative amount of your share : ';
                html += '<ul>';
                data.companies.forEach(function (item) {
                    html += '<li>' + item.title + ': ' +  item.share + '%' + '</li>';
                });
            html += '</ul>';
            $("#companies_shared").append(html);
            // }
        }
    });
    navbarChanged();

    $( "#company" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $( "#object" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $( "#from_date" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $( "#to_date" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });
});

function setFilters(data){
    $.ajax({
        type: "POST",
        url: 'payments/filter',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            let html = " {{#each all_time.data}}\n" +
                "                <tr class=\"payment-row\">\n" +
                "                    <th scope=\"row\">{{id}}</th>\n" +
                "                    <td>{{object}}</td>\n" +
                "                    <td>{{object_value_text}}</td>\n" +
                "                    <td>{{amount}} {{../currency_symbol}}</td>\n" +
                "                    <td>{{company}}</td>\n" +
                "                    <td>{{adate}}</td>\n" +
                "                </tr>\n" +
                "                {{/each}}\n" +
                "                <tr class=\"summery\">\n" +
                "                    <th scope=\"row\"></th>\n" +
                "                    <td></td>\n" +
                "                    <td></td>\n" +
                "                    <td></td>\n" +
                "                    <td>{{all_time.summery}} {{currency_symbol}}</td>\n" +
                "                </tr>";
            const template = Handlebars.compile(html);
            const result = template(data);
            $( "#all_time_table" ).html(result);
            // rowListener();
        }
    });
}


function getFilters(){
    let data = [];
    getFilterCompany(data);
    getFilterObject(data);
    getFilterFromDate(data);
    getFilterToDate(data);
    return data;
}

function getFilterObject(data){
    const object = $( "#object" ).val();
    if(object !== 'ALL'){
        data.push({object: 'OBJECT', value: object});
    }
}

function getFilterCompany(data){
    const company = $( "#company" ).val();
    if(company !== 'ALL'){
        data.push({object: 'COMPANY', value: company});
    }
}

function getFilterFromDate(data){
    const from_date = $( "#from_date" ).val();
    if(from_date !== ''){
        data.push({object: 'FROM_DATE', value: Date.parse(from_date)/1000});
    }
}

function getFilterToDate(data){
    const to_date = $( "#to_date" ).val();
    if(to_date !== ''){
        data.push({object: 'TO_DATE', value: Date.parse(to_date)/1000});
    }
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