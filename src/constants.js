const API_URL = "https://script.google.com/macros/s/AKfycbzHJIxR5rwt8sqfT5t0-vZqGT3aaY5D76ihHXlgTqUAf_ih2kdxxa3B7-6-nBjKN-IOxg/exec"
const REQUEST_ACTION = {
    CREATE_ONE: 'CREATE_ONE',
    UPDATE_ONE: 'UPDATE_ONE',
    DELETE_ONE: 'DELETE_ONE',
    CREATE_SHEET: 'CREATE_SHEET',
    CREATE_MULTIPLE: 'CREATE_MULTIPLE',
    DELETE_MULTIPLE: 'DELETE_MULTIPLE',
    DELETE_SHEET: 'DELETE_SHEET',
}

const REQUEST_METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

const RESPONSE_STATUS = {
    SUCCESS:'SUCCESS',
    ALREADY_EXIST: 'ALREADY_EXIST',
    ERROR: 'ERROR'
  }

const DEFAULT_NEW_ASSET_FORM = [{
    label:'',
    type:'text',
    options: '',
    error: null,
}]

const NEW_EMPTY_COLUMN = {
    label: '',
    type: 'text',
    options: '',
    error: null
}

const TOAST_TYPE = {
    ASSET_CREATED: {
        COLOR: '#198754',
        MESSAGE: 'Asset created successfully.'
    },
    RECORD_CREATED: {
        COLOR: '#198754',
        MESSAGE: 'Record added successfully.'
    },
    ASSET_UPDATED: {
        COLOR: '#198754',
        MESSAGE: 'Asset updated successfully.'
    },
    RECORD_UPDATED: {
        COLOR: '#198754',
        MESSAGE: 'Record updated successfully.'
    },
    ASSET_DELETED: {
        COLOR: '#198754',
        MESSAGE: 'Asset deleted successfully.'
    },
    RECORD_DELETED: {
        COLOR: '#198754',
        MESSAGE: 'Record deleted successfully.'
    },
    ASSET_DUPLICATE: {
        COLOR: '#ffc107',
        MESSAGE: 'Asset already exist.'
    },
    RECORD_DUPLICATE: {
        COLOR: '#ffc107',
        MESSAGE: 'Record already exist.'
    },
    DATA_IMPORT_SUCCESS: {
        COLOR: '#198754',
        MESSAGE: 'Data imported successfully.'
    },
    DATA_EXPORT_SUCCESS: {
        COLOR: '#198754',
        MESSAGE: 'Data exported successfully.'
    },
    ERROR: {
        COLOR: '#dc3545',
        MESSAGE: 'Something went wrong.'
    }
}

const ITEM_PER_PAGE = 20;

module.exports = {
    API_URL, 
    REQUEST_ACTION, 
    REQUEST_METHOD, 
    DEFAULT_NEW_ASSET_FORM, 
    NEW_EMPTY_COLUMN,
    TOAST_TYPE,
    RESPONSE_STATUS,
    ITEM_PER_PAGE,
}