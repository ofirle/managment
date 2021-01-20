const express = require('express');
const projects_model = require('./models/project');
const payments_model = require('./models/payment');
const images_model = require('./models/image');
const commission_model = require('./models/commission');
const suppliers_model = require('./models/supplier');
const colors_model = require('./models/color');
const path = require('path');

const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.set('views', path.join(__dirname, '../views/'));
app.set('view engine', 'hbs');

app.get('/payments', (req, res,) => {
    payments_model.getPayments(false, true, (all_time) => {
        var date = new Date();
        var firstDayMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        let filter_month= [{object: 'FROM_DATE', value: firstDayMonth.getTime()/1000}];

        payments_model.getPayments(filter_month, true,(this_month) => {
            projects_model.getProjectsNotFullyPayed((projects_rest_to_pay) => {
                res.render('payments', {'all_time':all_time, 'this_month':this_month, 'projects_rest_to_pay': projects_rest_to_pay, 'currency_symbol': '₪'} );
            });
        });
    });
});

app.post('/payments/filter', (req, res,) => {
    payments_model.getPayments(req.body, true, (all_time_filter) => {
        res.send({'all_time':all_time_filter, 'currency_symbol': '₪'} )
    });
});



app.get('/suppliers', (req, res,) => {
    suppliers_model.getSuppliers((data) => {
        res.render('suppliers', {suppliers: data});
    });
});

app.get('/projects', (req, res,) => {
    projects_model.getProjectsInfo(false, (data) => {
        res.render('index.hbs', {'projects':data});
    });
});

app.post('/projects/filter', (req, res,) => {
    const body = req.body;
    projects_model.getProjectsInfo(req.body, (data) => {
        res.send({'projects':data});
    });
});

app.post('/project/getSharedCompanies', (req, res,) => {
    projects_model.getSharedCompanies((data) => {
        res.send({'companies':data});
    });
});

app.get('/project/create', (req, res,) => {
    res.render('project_edit', {});
});

app.get('/project/:project_id', (req, res,) => {
    const project_id = req.params.project_id;
    projects_model.getProjectFull(project_id, (data) => {
        res.render('project', data);
    });
});

app.get('/supplier/create', (req, res,) => {
    res.render('supplier_edit', {action_edit: false});
});

app.get('/supplier/:supplier_id', (req, res,) => {
    const supplier_id = req.params.supplier_id;
    suppliers_model.getSupplierInfo(supplier_id, true, (data) => {
        res.render('supplier', data);
    });
});


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        const file_split = file.originalname.split('.');
        cb (null, genRanHex(32) + '.' + file_split[1]);
    }
});
var upload = multer({ storage: storage });
const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

app.post('/upload', upload.single('upload'), (req, res) => {
    console.log('server log');
    const project_id = req.body.project_id;
    const file_name = req.file.filename;
    const description = req.body.description;
    images_model.setImage(project_id, file_name, description,(data) => {
        return res.send(data);
    });
    res.send()
});


app.post('/project/set/:project_id', (req, res) => {
    const project_id = req.params.project_id;
    projects_model.setProjectInfo(project_id, req.body,(data) => {
        return res.send(data);
    });
});

app.post('/project/add', (req, res) => {
    projects_model.addProject(req.body,(data) => {
        return res.send(data);
    });
});

app.get('/project/edit/:project_id', (req, res,) => {
    const project_id = req.params.project_id;
    projects_model.getProjectInfo(project_id, false, (data) => {
        res.render('project_edit', data);
    });
});

app.get('/supplier/edit/:supplier_id', (req, res,) => {
    const supplier_id = req.params.supplier_id;
    suppliers_model.getSupplierInfo(supplier_id, false,(data) => {
        res.render('supplier_edit', data);
    });
});

app.post('/supplier/set/:supplier_id', (req, res) => {
    const supplier_id = req.params.supplier_id;
    suppliers_model.setSupplierInfo(supplier_id, req.body,(data) => {
        return res.send(data);
    });
});

app.post('/supplier/add', (req, res) => {
    suppliers_model.addSupplier(req.body,(data) => {
        return res.send(data);
    });
});

app.get('/project/images/:project_id', (req, res,) => {
    const project_id = req.params.project_id;
    images_model.getImages(project_id, (data) => {
        res.render('show_images', data);
    });
});

app.get('/payment/:payment_id?', (req, res,) => {
    const payment_id = req.params.payment_id;
    const queries = req.query;
    payments_model.getPaymentInfo(payment_id, false, queries, (payment_data) => {
        const action_edit = payment_data !== undefined;
        res.render('payment_edit', {'action_edit': action_edit,'data':payment_data});
    });
});

app.get('/color/:color_id?', (req, res,) => {
    const color_id = req.params.color_id;
    const queries = req.query;
    colors_model.getColorInfo(color_id, false, queries, (color_data) => {
        const action_edit = color_id !== undefined;
        res.render('color_edit', {'action_edit': action_edit,'data':color_data});
    });
});

app.get('/commission/:commission_id?', (req, res,) => {
    const commission_id = req.params.commission_id;
    commission_model.getCommissionInfo(commission_id, false, req.query, (commission_data) => {
        const action_edit = commission_data !== undefined;
        res.render('commission_edit', {'action_edit': action_edit,'data':commission_data});
    });
});

app.get('/commission/payed/:commission_id?', (req, res,) => {
    const commission_id = req.params.commission_id;
        res.render('commission_payed', {'data':{commission_id: commission_id}});
});

app.post('/commission/getCommissionsIds', (req, res,) => {
    commission_model.getCommissionsIds((data) => {
        res.send(data)
    });
});

///commission/payed/set/

app.post('/commission/payed/set/:commission_id', (req, res,) => {
    const commission_id = req.params.commission_id;
    commission_model.setPaymentCommission(commission_id, req.body, (data) => {
        res.send(data)
    });
});


app.post('/commission/set/:commission_id?', (req, res,) => {
    const commission_id = req.params.commission_id;
    console.log("in Post Commission Set: " + commission_id);
    commission_model.setCommissionInfo(commission_id, req.body, (data) => {
        res.send(data);
    });
});


app.post('/color/set/:color_id?', (req, res,) => {
    const color_id = req.params.color_id;
    console.log("in Post Color Set: " + color_id);
    colors_model.setColorInfo(color_id, req.body, (data) => {
        res.send(data);
    });
});

app.post('/payment/set/:payment_id?', (req, res,) => {
    const payment_id = req.params.payment_id;
    console.log("in Post Payment Set: " + payment_id);
    payments_model.setPaymentInfo(payment_id, req.body, (data) => {
        res.send(data);
    });
});

app.post('/color/create', (req, res,) => {
    console.log("in Post Color Create: ");
    colors_model.setNewColor(req.body, (data) => {
        res.send(data);
    });
});

app.post('/commission/create', (req, res,) => {
    console.log("in Post Commission Create: ");
    commission_model.setNewCommission(req.body, (data) => {
        res.send(data);
    });
});

app.post('/payment/create', (req, res,) => {
    console.log("in Post Payment Create: ");
    payments_model.setNewPayment(req.body, (data) => {
        res.send(data);
    });
});

app.post('/payment/getProjectsIds', (req, res,) => {
    projects_model.getProjectsIds((data) => {
        res.send(data)
    });
});
///supplier/getSuppliersIds
app.post('/supplier/getSuppliersIds', (req, res,) => {
    suppliers_model.getSuppliersIds((data) => {
        res.send(data)
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is up on port ' + port )
});