const companiesArray = {DANIEL: 'Daniel', HD: 'HD'};
const projectsStatusArray = {PENDING: 'Pending',IN_PROCESS: 'In Process', COMPLETED: 'Completed', PAUSED: 'Paused'};
const methodArray = {CASH: 'Cash',BIT: 'Bit', BANK_TRANSFER: 'Bank Transfer', CHECK: 'Check'};
const supplierTypeArray = {FURNITURE: 'Furniture'};
const paymentSharedByCompany = [{HD: 50}];


function parseDate(timestamp, to_time = false){
    if(!timestamp){
        return '---';
    }
    if(to_time){
        return new Date(timestamp * 1000).toLocaleString()
    }else{
        return new Date(timestamp * 1000).toLocaleDateString()
    }
}

function parseLabelText(key, labels){
    if(isKeyExist(key, labels)){
        return labels[key];
    }
    return '---';
}

// function parseCompany(key){
//     if(isKeyExist(key, company)){
//         return company[key];
//     }
//     return '---';
// }

function isKeyExist(key, array){
    return key in array;
}

module.exports = {
    parseDate: parseDate,
    parseLabelText: parseLabelText,
    isKeyExist: isKeyExist,
    companiesArray: companiesArray,
    projectsStatusArray: projectsStatusArray,
    methodArray: methodArray,
    supplierTypeArray: supplierTypeArray,
    paymentSharedByCompany: paymentSharedByCompany
};