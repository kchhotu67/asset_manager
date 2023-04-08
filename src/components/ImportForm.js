import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { API_URL, REQUEST_ACTION, REQUEST_METHOD, RESPONSE_STATUS, TOAST_TYPE } from '../constants';
import { displayToast, displayEventLoader } from '../helper';


export default function ImportForm({sheetName, setRefresh, importForm, setImportForm, columns}) {
    const [csvColumns, setCsvColumns] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [columnMatch, setColumnMatch] = useState(() => {
      let x = {}
      columns.slice(1).forEach((col) => {
        x[col] = ''
      })
      return x;
    });
    const handleSubmit = async () => {
      displayEventLoader();
      let colsIndex = {};
      Object.keys(columnMatch).forEach((key) => {
        colsIndex[key] = csvColumns.indexOf(columnMatch[key]);
      });
      let finalData = [];
      csvData.forEach((item) => {
        let row = ["=row()-1"];
        columns.slice(1).forEach((col) => {
          row.push(item[colsIndex[col]])
        });
        finalData.push(row);
      })
      try {
        let obj = {
          sheet: sheetName,
          method: REQUEST_ACTION.CREATE_MULTIPLE,
          data: finalData
        }
        let res = await fetch(API_URL, {
          method: REQUEST_METHOD.POST,
          body: JSON.stringify(obj)
        });
        res = await res.json()
        if(res.status === RESPONSE_STATUS.SUCCESS){
          displayToast(TOAST_TYPE.DATA_IMPORT_SUCCESS);
        }else{
          displayToast(TOAST_TYPE.ERROR);
        }
        setRefresh();
        setImportForm(false)
      } catch (error) {
        setRefresh();
        setImportForm(false)
      }
    }
    const parseData = (searchString) => {
      const countOccurace = (str, text) => {
        let count = 0;
        for (let i=0;i<str.length;i++){
          if(str[i] === text){
              count++;
          }
        }
        return count;
      }
      let finalData = [];
      while(true){
        if(searchString.indexOf(',"') !== -1){
          let indStart = searchString.indexOf(',"');
          let first = searchString.substr(0,indStart)
          if(first !== ""){
            first = first.replaceAll('""', '"');
            let splits = first.split(',');
            if(splits[0].indexOf('"') !== -1){
              splits[0] = splits[0].slice(1, splits[0].length -1);
              splits[0] = splits[0].replaceAll('""', '"')
            }
            finalData = [...finalData, ...splits];
          }
          let indexEnd = searchString.indexOf('",', indStart+1)
          let count = countOccurace(searchString.substr(indStart+1, indexEnd-indStart), '"')
          while(count%2 !== 0){
            indexEnd = searchString.indexOf('",', indexEnd+1);
            if(indexEnd < 0){
                break;
            }
            count = countOccurace(searchString.substr(indStart+1, indexEnd-indStart), '"')
          }
          if(indexEnd === -1){
            let newValue = searchString.substr(2, searchString.length-3);
            newValue = newValue.replaceAll('""', '"')
            finalData = [...finalData, newValue]
            break
          }
          let newValue = searchString.substr(indStart+1, indexEnd-indStart)
          newValue = newValue.substr(1, newValue.length-2);
          newValue = newValue.replaceAll('""', '"')
          finalData = [...finalData, newValue]
          searchString = searchString.substr(indexEnd+1)

        }else{
          if(searchString[0] === ',') searchString = searchString.substr(1)
          let newData = searchString.split(',')
          finalData = [...finalData, ...newData]
          break
        }
      }
      return finalData;
    }
    const handleFileSelect = (e) => {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file);
      reader.onload = function(event){
        let csvData = event.target.result;
        csvData = csvData.split('\n');
        csvData = csvData.map((item) => {
            return item.replaceAll('\r', '')
        })
        csvData = csvData.filter((item) => {
            return item !== ""
        })
        let finalData = [];
        csvData.forEach(element => {
          let r = parseData(element);
          finalData.push(r);
        });
        setCsvColumns(finalData[0]);
        setCsvData(finalData.slice(1))
      }
    }
    return (
    <Modal show={importForm} onHide={() => {setImportForm(false)}} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Import Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                accept='.csv'
                onChange={handleFileSelect}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        {csvColumns && csvData.length > 0 &&
          <Modal.Body>
            <Form>
              {columns.slice(1).map((col, index) => {
                return (
                  <Form.Group key={`input-index-${index}`} className="mb-3">
                    <Form.Label>{col}</Form.Label>
                    <Form.Select 
                      aria-label="Select Data Type" 
                      value={columnMatch[col]}
                      onChange={(e) => {columnMatch[col] = e.target.value;setColumnMatch({...columnMatch})}}
                      >
                      <option key={`item-index-${0}`} value={''}>{`Select matching Column for ${col}`}</option>
                      {
                        csvColumns.map((item, ind) => <option key={`item-index-${ind+1}`} value={item}>{item}</option>)
                      }
                    </Form.Select>
                </Form.Group> 
                )
              })}
            </Form>
          </Modal.Body>
        }
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setImportForm(false)}}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Import
          </Button>
        </Modal.Footer>
    </Modal>
    )
}
