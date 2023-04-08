import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_URL, REQUEST_ACTION, REQUEST_METHOD, RESPONSE_STATUS, TOAST_TYPE } from '../constants';
import RecordForm from './RecordForm';
import AssetTable from './AssetTable';
import CenterText from './CenterText';
import Loader from './Loader';
import { displayEventLoader, displayToast } from '../helper';
import ImportForm from './ImportForm';

function AssetPage() {
  let { assetName } = useParams();
  const [records, setRecords] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [schemaJson, setSchemaJson] = useState(null);
  const [query, setQuery] = useState('');
  const [filterdRecords, setFilterdRecords] = useState([]);
  const [showQueryRecords, setShowQueryRecords] = useState(false);
  const [sortConfig, setSortConfig] = useState({column: 'id', asc: false});
  const [importForm, setImportForm] = useState(false);
  
  const handleSubmit = async (asset) => {
    displayEventLoader()
    try {
        let obj = {
            sheet: assetName,
            method: REQUEST_ACTION.CREATE_ONE,
            data: asset
        }
        let res = await fetch(API_URL, {
            method: REQUEST_METHOD.POST,
            body: JSON.stringify(obj)
        });
        res = await res.json()
        if(res.status === RESPONSE_STATUS.SUCCESS){
          displayToast(TOAST_TYPE.RECORD_CREATED);
        }else{
          displayToast(TOAST_TYPE.ERROR);
        }
        setRefresh();
        setShowAssetForm(false)
    } catch (error) {
        console.log(error)
        setShowAssetForm(false)
    }
  }
  const setRefresh = () => {
    fetchData()
  }
  

  async function fetchData(refresh=false) {
    setLoading(refresh && true)
    try {
        const response = await axios.get(`${API_URL}?sheet=${assetName}`);
        setColumns(response.data.data.columns);
        setRecords(response.data.data.records);
        setFilterdRecords([...response.data.data.records])
        setLoading(false)
        setError(false)
    } catch (error) {
        setLoading(false);
        setError(true)
    }
  }

  async function fetchSchema(){
    try {
        const response = await axios.get(`${API_URL}?sheet=schema&name=${assetName}`);
        if(response.data.data.records.length > 0){
            let schema = JSON.parse(response.data.data.records[0].schema);
            setSchemaJson(schema)
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    setQuery('');
    setShowQueryRecords(false);
    fetchSchema();
  }, [assetName])

  useEffect(() => {
    fetchData(true);
  }, [assetName])

  const handleSearch = (e) => {
    e.preventDefault();
    if(query.length < 1){
      setShowQueryRecords(false);
      setFilterdRecords([...records]);
      return;
    }
    let filtered = records.filter(item => {
      let values = Object.values(item);
      for(let i=0;i<values.length;i++){
        if(values[i].toString().toLowerCase().includes(query.toLowerCase())){
          return true;
        }
      }
      return false;
    })

    setFilterdRecords(filtered)
    setShowQueryRecords(true)
  }
  const sortTable = () => {
    let sortedRecord = filterdRecords.sort((a, b) => {
      return a[sortConfig.column] > b[sortConfig.column] ? 1 : (a[sortConfig.column] < b[sortConfig.column] ? -1 : 0)
    });
    if(!sortConfig.asc){
      sortedRecord = sortedRecord.reverse()
    }
    setFilterdRecords([...sortedRecord])
  }
  useEffect(() => {
    sortTable()
  }, [sortConfig])
  
  const exportData = () => {
    if(filterdRecords.length < 1){
      displayToast({COLOR: '#dc3545', MESSAGE: 'There is not data to export!'})
    }else{
      let header = columns.join(',');
      let download_data = `${header}\n`;
      filterdRecords.forEach((item) => {
        let row = "";
        let rowData = []
        columns.forEach((col) => {
          rowData.push(item[col])
        });
        row = rowData.join(',') + '\n';
        download_data = download_data + row;
      });

      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      let filename = assetName+'.csv';
      let blob = new Blob([download_data]);
      let url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      displayToast(TOAST_TYPE.DATA_EXPORT_SUCCESS);
    }
  }
  return (
    <>
        {!loading && schemaJson &&
          <>
            <div className='d-flex justify-content-between align-items-center' style={{padding:'1rem'}}>
              <div className='me-5' style={{fontWeight: 'bold'}}>
                <Button variant='success' onClick={()=> {setImportForm(true)}} className='me-2'>Import Data</Button>
                <Button variant='warning' onClick={exportData} className='me-2'>Export Data</Button>
                {importForm && <ImportForm {...{sheetName: assetName, setRefresh, importForm, setImportForm, columns}}/> }
                Total Records: {records.length}
              </div>               
              <div className='d-flex justify-content-end align-items-center col-md-8'>
                {showQueryRecords > 0 &&
                  <div className='me-3' style={{fontWeight: 'normal', color:'red'}}>Search Result: {filterdRecords.length}</div>
                }
                <form className="d-flex me-2 col-md-5" role="search">
                      <input className="form-control me-2" type="search" value={query} onChange={(e)=> {setQuery(e.target.value)}} placeholder="Search" aria-label="Search"/>
                      <button className="btn btn-secondary" onClick={handleSearch}>Search</button>
                  </form>
                <Button onClick={()=> setShowAssetForm(true)}>Add New Record</Button>
              </div>
            </div>
            {showAssetForm &&
                <RecordForm 
                    title={'Add New Asset'}
                    show={showAssetForm}
                    columns={columns}
                    setShow={setShowAssetForm}
                    handleSubmit={handleSubmit}
                    schemaJson={schemaJson}
                />
            }
          </>
        }
        {(loading || !schemaJson) && <Loader/>}
        {(error && !loading) && <CenterText text="Something went wrong!"/>}
        {
            !loading && !error && schemaJson && records.length > 0 && 
            <AssetTable 
              columns={columns} 
              records={filterdRecords} 
              setRefresh={setRefresh}
              sheetName={assetName}
              schemaJson={schemaJson}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
        />}
        {!loading && !error && !filterdRecords.length && <CenterText text="Records Not Found!"/>}
    </>
  )
}

export default AssetPage