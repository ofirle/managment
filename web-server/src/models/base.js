const companiesArray = {DANIEL: 'Daniel', HD: 'HD'};
const projectsStatusArray = {PENDING: 'Pending',IN_PROCESS: 'In Process', COMPLETED: 'Completed', PAUSED: 'Paused'};
const methodArray = {CASH: 'Cash',BIT: 'Bit', BANK_TRANSFER: 'Bank Transfer', CHECK: 'Check'};
const supplierTypeArray = {FURNITURE: 'Furniture', CURTAINS: 'Curtains', FLOORING: 'Flooring', CERAMICS: 'Ceramics', CARPENTER: 'Carpenter', KITCHEN: 'Kitchen', RENOVATOR: 'Renovator'};
const objectTypeArray = {PROJECT: 'Project', COMMISSION:'Commission'};
const paymentSharedByCompany = [{key:'HD', value:50}];


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

function getValueCompanyShared(company_key, array){
    for(let i=0; i<array.length; i++){
        if(array[i].key === company_key){
            return array[i].value;
        }
    }
    return false;
}

module.exports = {
    parseDate: parseDate,
    parseLabelText: parseLabelText,
    isKeyExist: isKeyExist,
    getValueCompanyShared: getValueCompanyShared,
    companiesArray: companiesArray,
    projectsStatusArray: projectsStatusArray,
    methodArray: methodArray,
    supplierTypeArray: supplierTypeArray,
    paymentSharedByCompany: paymentSharedByCompany,
    objectTypeArray: objectTypeArray
};