const mysql = require('../../db/connection');
const lib = require('../lib/operations');
const base = require('./base');

const setImage = (project_id, filename, description, callback) => {
    const {sql, values} = lib.buildSqlCreate(' images_projects', ['project_id', 'filename', 'description'], {project_id: project_id, filename: filename, description: description});
    let succeed = false;
    mysql.connection.query(sql, values,
        function (err, results) {
            if (err) {console.log(err); throw err}
            console.log("created");
            succeed = true;
        });
};

const getImages = (project_id, callback) => {
    const zoom = 4;
    let images_in_row;
    switch(zoom){
        case 1:
            images_in_row = 1;
            break;
        case 2:
            images_in_row = 2;
            break;
        case 3:
            images_in_row = 3;
            break;
        case 4:
            images_in_row = 4;
            break;
        case 5:
            images_in_row = 6;
            break;
        case 6:
            images_in_row = 12;
            break;
    }
    let sql = "SELECT * FROM images_projects WHERE project_id = ?";
    let values =[project_id];
    mysql.connection.query(sql, values,
        function (err, results) {
            if (err) {console.log(err); throw err}
            results.forEach(parseImage);

            const groups = getGroupsByItemInRow(images_in_row, results);
            const result = {width: 12/images_in_row, groups: groups};
            callback(result);
        });
};

function parseImage(item){
    item.adate = base.parseDate(item.adate, true);

}

function getGroupsByItemInRow(items_in_row, images){
    let groups = [];
    let group = [];
    for (let i=0; i<images.length; i++){
        group.push(images[i]);
        if(((i + 1) % items_in_row) === 0 || ((i + 1) % items_in_row) === images.length){
            groups.push({images:group});
            group = [];
        }
    }
    return groups;
}

function parseImages(item) {
    item.adate = parseDate(item.adate, false);
    item.status = parseStatus(item.status);
    item.company = parseCompany(item.company);
    return item;
}

module.exports = {
    setImage: setImage,
    getImages: getImages
};