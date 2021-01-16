$(document).ready(function(){
    // const realFileBtn = $("#real-file");
    // const customBtn = $("#custom-button");
    // const customTxt = $("#custom-text");



    $("#real-file").on('change', function(){
        var paths_names = (new URL(window.location.href).pathname).split( '/' );
        console.log(paths_names);
        let project_id = undefined;
        if(paths_names[1] === 'project' && paths_names[3]){
            project_id = paths_names[3];
        }
           console.log("file Selected");
           let fd = new FormData();
           const files = ($("#real-file")[0].files[0]);
           fd.append('upload', files);
           fd.append('project_id', project_id);
           fd.append('description', "description");
           // let data = {
           //     upload: file
           // };
            $.ajax({
                url: location.origin + '/upload',
                type: 'post',
                data: fd,
                contentType:false,
                processData: false,
                success: function(response){
                    console.log(response);
                    // if(response != 0){
                    //
                    // }
                }
            })
    });
});