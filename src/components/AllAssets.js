import React from 'react'
import { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL, NEW_EMPTY_COLUMN, REQUEST_ACTION, REQUEST_METHOD, RESPONSE_STATUS, TOAST_TYPE } from '../constants';
import { displayEventLoader, displayToast, parseOption, toCapital } from '../helper';
import CreateNewAsset from './CreateNewAsset';
import DeleteSheetPopup from './DeleteSheetPopup';

function AllAssets({setShow, assets, setRefreshAssets}) {
    const [cnaPop, setCnaPop] = useState(false);
    const [assetName, setAssetName] = useState('');
    const [columns, setColumns] = useState([{...NEW_EMPTY_COLUMN}]);
    const [assetNameError, setAssetNameError] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [deleteAssetPop, setDeleteAssetPop] = useState(false);
    const currentSheet = useParams().assetName;
    const navigate = useNavigate();
    const addNewColumn = () => {
        setColumns([...columns, {...NEW_EMPTY_COLUMN}])
    }

    const deleteColumn = (index) => {
        let filterd = columns.filter((item, idx) => {return index !== idx});
        setColumns([...filterd])
    }

    const handleCreateSchema = async () => {
        displayEventLoader()
        if(assetName.length === 0){
            setAssetNameError("Asset Name can't be empty!");
            return
        }
        for(let i=0;i<columns.length;i++){
            let col = columns[i];
            if(col.label === ''){
                col.error = "Column Name can't be empty!";
                setColumns([...columns])
                return
            }
            if(col.type === ''){
                col.error = "Column Data Type can't be empty!";
                setColumns([...columns])
                return
            }
            if(col.type === 'select' && col.options === ''){
                col.error = `Please add Options for column '${col.label}'`;
                setColumns([...columns])
                return
            }
        }
        let columnCopy = JSON.parse(JSON.stringify(columns));
        columnCopy.forEach(element => {
            element.label = toCapital(element.label);
            element.options = parseOption(element.options);
            delete element.error;
        });
        let data = {
            name: toCapital(assetName),
            columns: columnCopy
        }
        try {
            let obj = {
                sheet: 'schema',
                method: REQUEST_ACTION.CREATE_SHEET,
                data: {
                    name: toCapital(assetName),
                    schema: JSON.stringify(data)
                }
            }
            fetch(API_URL, {
                method: REQUEST_METHOD.POST,
                body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then(res => {
                if(res.status === RESPONSE_STATUS.SUCCESS){
                    displayToast(TOAST_TYPE.ASSET_CREATED);
                }else{
                    displayToast(TOAST_TYPE.ERROR);
                }
                setCnaPop(false);
                setAssetName('')
                setColumns([{...NEW_EMPTY_COLUMN}]);
                setRefreshAssets()
            });
        } catch (error) {
            console.log(error)
        }
    }

    const deleteSheet = async (sheetName) => {
        displayEventLoader()
        try {
            let obj = {
                sheet: sheetName,
                method: REQUEST_ACTION.DELETE_SHEET,
            }
            let res = await fetch(`${API_URL}`, {
                method: "POST",
                body: JSON.stringify(obj)
            });
            res = await res.json();
            if(res.status === RESPONSE_STATUS.SUCCESS){
                displayToast(TOAST_TYPE.ASSET_DELETED);
            }else{
                displayToast(TOAST_TYPE.ERROR);
            }
            setDeleteAssetPop(false);
            setSelectedAsset(null)

            setRefreshAssets()
            if(currentSheet === sheetName){
                setShow(false);
                navigate('/');
            }
            
        } catch (error) {
            displayToast(TOAST_TYPE.ERROR);
            setDeleteAssetPop(false);
            setSelectedAsset(null)
        }
    }

    const showDeleteSheetPopup = (sheetName) => {
        setDeleteAssetPop(true);
        setSelectedAsset(sheetName);
    }

    return (
        <>
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>All Assets</Accordion.Header>
                <Accordion.Body>
                    {assets && assets.map((item, index) => {
                        return (
                            <div 
                                style={{borderBottom: '1px solid lightgray', padding: '0.8rem 20px', cursor:'pointer'}} 
                                key={`asset-index-${index}`}
                                className='d-flex justify-content-between align-items-center'
                                >
                                <span onClick={() => {navigate(`/assets/${item.name}`); setShow(false);}}>{item.name}</span>
                                <button onClick={(e) => {showDeleteSheetPopup(item.name)}} className="btn btn-link">delete</button>
                            </div>
                        )
                    })}
                    <div 
                        style={{borderBottom: '1px solid lightgray', padding: '0.8rem 20px', cursor:'pointer'}} 
                        onClick={() => setCnaPop(true)}
                        className="text-primary d-flex justify-content-between align-items-center"
                        >
                        <span>Create New</span>
                        <span style={{fontSize: '22px'}}>+</span>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        {cnaPop && 
            <CreateNewAsset
                {...{
                    cnaPop, 
                    setCnaPop, 
                    assetName, 
                    setAssetName,
                    assetNameError,
                    setAssetNameError,
                    columns, 
                    setColumns, 
                    deleteColumn, 
                    addNewColumn, 
                    handleCreateSchema
                }}
            />
        }
        {deleteAssetPop && 
            <DeleteSheetPopup 
                show={deleteAssetPop} 
                setShow={setDeleteAssetPop} 
                handleDeleteSheet={deleteSheet} 
                sheetName={selectedAsset}
            />
        }
        </>
    )
}

export default AllAssets