$(document).ready(function(){
    $( "#company" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });

    $( "#status" ).change(function() {
        let data = getFilters();
        setFilters(data);
    });
    rowListener();
});

function rowListener(){
        console.log("rowListener Called");
    $(".project-row").on("click", function(){
        const project_id = $(this).children('th').text();
        window.location.href = "/project/" + project_id;
    });
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