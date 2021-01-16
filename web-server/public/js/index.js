$(document).ready(function(){
    const data = [];
    // $.ajax({
    //     type: "POST",
    //     url: 'projects/filter',
    //     data: JSON.stringify(data),
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function(data) {
    //         let html = "    {{#each projects}}\n" +
    //             "    <tr class=\"project-row\">\n" +
    //             "        <th scope=\"row\">{{id}}</th>\n" +
    //             "        <td>{{first_name}} {{last_name}}</td>\n" +
    //             "        <td>{{adate}}</td>\n" +
    //             "        <td>{{address}}</td>\n" +
    //             "        <td>\n" +
    //             "            <div class=\"progress\">\n" +
    //             "                <div class=\"progress-bar\" style=\"width: {{payment.process_percentage}}%\" role=\"progressbar\" aria-valuenow=\"{{payment.payed}}\" aria-valuemin=\"0\" aria-valuemax=\"{{payment.total}}\">{{payment.process_percentage}}%</div>\n" +
    //             "            </div>\n" +
    //             "        </td>\n" +
    //             "        <td>{{company}}</td>\n" +
    //             "        <td>\n" +
    //             "            <i id=\"edit-project\" class=\"fa fa-edit icon-clickable\" style=\"margin-left: 7px\"></i>\n" +
    //             "            <i class=\"fa fa-trash-alt icon-clickable\" style=\"margin-left: 7px\"></i>\n" +
    //             "        </td>\n" +
    //             "    </tr>\n" +
    //             "    {{/each}}";
    //
    //
    //         const template = Handlebars.compile(html);
    //         const result = template(data);
    //         $( "tbody" ).html(result);
    //         rowListener();
    //     }
    // });


    $( "#company" ).change(function() {
        // alert( "Handler for .change() called." );
        const company = $( "#company" ).val();
        let data = [];
        if(company !== 'ALL') {
            data.push({object: 'COMPANY', value: company});
        }
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
                    "        <td>{{adate}}</td>\n" +
                    "        <td>{{address}}</td>\n" +
                    "        <td>\n" +
                    "            <div class=\"progress\">\n" +
                    "                <div class=\"progress-bar\" style=\"width: {{payment.process_percentage}}%\" role=\"progressbar\" aria-valuenow=\"{{payment.payed}}\" aria-valuemin=\"0\" aria-valuemax=\"{{payment.total}}\">{{payment.process_percentage}}%</div>\n" +
                    "            </div>\n" +
                    "        </td>\n" +
                    "        <td>{{company}}</td>\n" +
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