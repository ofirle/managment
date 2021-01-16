const express = require('express');
const projects_model = require('./../../src/models/project');

//set
//get
const app = express();
app.use(express.json());

// request to api/project/set
app.get('/project/:project_id', (req, res,) => {
    const project_id = req.params.project_id;
    projects_model.getProjectFull(project_id, (data) => {
        res.render('project', data);
    });
});