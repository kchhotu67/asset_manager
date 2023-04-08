// Open the Google Spreadsheet using its URL and get the sheet named "Sheet1"
const app = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1TyoUthrYWJ0dhri6dqkWZt0O_gyttbPHYXpHyxBDDgc/edit#gid=0");
const schema = app.getSheetByName("Schema");
const RESPONSE_STATUS = {
  SUCCESS:'SUCCESS',
  ALREADY_EXIST: 'ALREADY_EXIST',
  ERROR: 'ERROR'
}

const REQUEST_ACTION = {
  CREATE_ONE: 'CREATE_ONE',
  UPDATE_ONE: 'UPDATE_ONE',
  DELETE_ONE: 'DELETE_ONE',
  CREATE_SHEET: 'CREATE_SHEET',
  CREATE_MULTIPLE: 'CREATE_MULTIPLE',
  DELETE_MULTIPLE: 'DELETE_MULTIPLE',
  DELETE_SHEET: 'DELETE_SHEET',
}

// Define a function to handle HTTP GET requests
function doGet(req){
  let sheetName = req.parameter.sheet;
  let records = fetchSheetData(sheetName, req.parameter);
  let obj = {
    data: records,
    status: records ? RESPONSE_STATUS.SUCCESS: RESPONSE_STATUS.ERROR
  }
  return ContentService.createTextOutput(JSON.stringify(obj))
}
 
// Define a function to handle HTTP POST requests
function doPost(req){
  let request = JSON.parse(req.postData.contents)
  if(request.method == REQUEST_ACTION.CREATE_ONE){
    let res = insertRowToSheet(request.sheet, request.data);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }else if(request.method == REQUEST_ACTION.CREATE_MULTIPLE){
    let res = insertMultipleRowsToSheet(request.sheet, request.data);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }else if(request.method == REQUEST_ACTION.UPDATE_ONE){
    let res = updateSheetRow(request.sheet, request.data);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }else if(request.method == REQUEST_ACTION.DELETE_ONE){
    let res = deleteSheetRow(request.sheet, request.data.id);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }else if(request.method == REQUEST_ACTION.CREATE_SHEET){
    let res = createNewSheet(request);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }else if(request.method == REQUEST_ACTION.DELETE_SHEET){
    let res = deleteSheet(request.sheet);
    return ContentService.createTextOutput(JSON.stringify({status:res}));
  }
  else{
    return ContentService.createTextOutput(JSON.stringify({status:RESPONSE_STATUS.ERROR}));
  }
}

// Define a test function to log all the data in the sheet (for debugging purposes)
function createNewSheet(request){
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  try{
    let sheet = app.getSheetByName(request.data.name);
    if(sheet){
      return RESPONSE_STATUS.ALREADY_EXIST;
    }
    let newSheet = ss.insertSheet();
    newSheet.setName(request.data.name);
    let schema = JSON.parse(request.data.schema);
    let columns = schema.columns;
    let insertCols = ['id']
    columns.forEach((col) => {
      insertCols.push(col.label)
    });
    newSheet.appendRow(insertCols)
    return insertRowToSheet(request.sheet, request.data);
  }catch(err){
    return RESPONSE_STATUS.ERROR;
  }
}


function insertRowToSheet(sheetName, jsonData, uniqueCol = null){
  let sheet = app.getSheetByName(sheetName);
  let columns = sheet.getDataRange().getValues()[0]
  if(uniqueCol){
    let colIndex = columns.indexOf(uniqueCol);
    if(colIndex === -1) return RESPONSE_STATUS.ERROR;
    let records = sheet.getDataRange().getValues();
    for(let i=1;i<records.length;i++){
      if(records[i][colIndex] == jsonData[uniqueCol]){
        return RESPONSE_STATUS.ALREADY_EXIST;
      }
    }
  }
  columns = columns.slice(1)
  let insertRow = ["=row()-1"]
  columns.forEach((col) => {
    insertRow.push(jsonData[col])
  })
  try{
    sheet.appendRow(insertRow)
    return RESPONSE_STATUS.SUCCESS;
  }catch(err){
    Logger.log(err)
    return RESPONSE_STATUS.ERROR;
  }
}

function insertMultipleRowsToSheet(sheetName, data){
  let sheet = app.getSheetByName(sheetName);
  try{
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1,1,data.length, data[0].length).setValues(data);
    return RESPONSE_STATUS.SUCCESS;
  }catch(err){
    Logger.log(err)
    return RESPONSE_STATUS.ERROR;
  }
}

function fetchSheetData(sheetName, queryObj = {}){
  let sheet = app.getSheetByName(sheetName);
  let records = sheet.getDataRange().getValues()
  let columns = records[0]
  let queryObject = Object.keys(queryObj).reduce((r, key) => {
    if(columns.indexOf(key) != -1){
      r[key] = queryObj[key];
    }
    return r;
  },{})
  records = records.slice(1)
  if(Object.keys(queryObject).length > 0){
    let indexKeys = {}
    Object.keys(queryObject).forEach(key => {
      indexKeys[key] = columns.indexOf(key);
    })
    records = records.filter((item) => {
      let filtered = true;
      Object.keys(queryObject).forEach(key => {
        if(item[indexKeys[key]] != queryObject[key]){
          filtered = false;
        }
      })
      return filtered
    })
  }
  let jsonRecords = records.map((item) => {
    let jsonItem = {}
    for(let i=0;i<columns.length;i++){
      jsonItem[columns[i]] = item[i]
    }
    return jsonItem;
  })
  return {columns, records:jsonRecords};
}

function updateSheetRow(sheetName, jsonData){
  let sheet = app.getSheetByName(sheetName)
  let columns = sheet.getDataRange().getValues()[0]
  let data = sheet.getRange(jsonData['id']+1,1,1,6).getValues()[0];
  for(let i=0;i<columns.length;i++){
    data[i] = jsonData[columns[i]]
  }
  data[0] = "=row()-1"
  for(let i=0;i<data.length;i++){
    sheet.getRange(jsonData['id']+1, i+1 ).setValue(data[i]); 
  }
  return RESPONSE_STATUS.SUCCESS;
}

function deleteSheetRow(sheetName, id){
  let sheet = app.getSheetByName(sheetName);
  sheet.deleteRow(id+1);
  return RESPONSE_STATUS.SUCCESS;
}

function deleteSheet(sheetName){
  try{
    let data = schema.getDataRange().getValues();
    let columns = data[0];
    let records = data.slice(1);
    let index = columns.indexOf('name');
    for(let i=0;i<records.length;i++){
      if(records[i][index] === sheetName){
        schema.deleteRow(i+2);
        let sheet = app.getSheetByName(sheetName);
        app.deleteSheet(sheet);
        return RESPONSE_STATUS.SUCCESS;
      }
    }
    return RESPONSE_STATUS.ERROR;
  }catch(err){
    Logger.log(err);
    return RESPONSE_STATUS.ERROR;
  }
}
