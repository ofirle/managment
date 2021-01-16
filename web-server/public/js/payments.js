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
});
