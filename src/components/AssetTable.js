import React from 'react'
import { useState } from 'react';
import { API_URL, ITEM_PER_PAGE, REQUEST_ACTION, REQUEST_METHOD, RESPONSE_STATUS, TOAST_TYPE } from '../constants';
import { displayEventLoader, displayToast, valueFormater } from '../helper';
import RecordForm from './RecordForm'
import DeletePopup from './DeletePopup';
import { ArrowUp, ArrowDown } from 'react-bootstrap-icons';
import CustomePagination from './Pagination';
import { useEffect } from 'react';

export default function AssetTable({columns, sheetName, records, setRefresh, schemaJson, sortConfig, setSortConfig}) {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const updateAsset = async (asset) => {
        displayEventLoader()
        try {
            let obj = {
                sheet: sheetName,
                method: REQUEST_ACTION.UPDATE_ONE,
                data: asset
            }
            let res = await fetch(API_URL, {
                method: REQUEST_METHOD.POST,
                body: JSON.stringify(obj)
            });
            res = await res.json()
            if(res.status === RESPONSE_STATUS.SUCCESS){
                displayToast(TOAST_TYPE.RECORD_UPDATED);
            }else{
                displayToast(TOAST_TYPE.ERROR);
            }
            setRefresh()
            setShow(false);
        } catch (error) {
            console.log(error)
            setShow(false);
        }
    }
    const handleDeleteSubmit = async (asset) => {
        displayEventLoader()
        try {
            let obj = {
                sheet: sheetName,
                method: REQUEST_ACTION.DELETE_ONE,
                data: asset
            }
            let res = await fetch(`${API_URL}`, {
                method: "POST",
                body: JSON.stringify(obj)
            });
            res = await res.json();
            if(res.status === RESPONSE_STATUS.SUCCESS){
                displayToast(TOAST_TYPE.RECORD_DELETED);
            }else{
                displayToast(TOAST_TYPE.ERROR);
            }
            setRefresh()
            setShowDelete(false)
        } catch (error) {
            setShowDelete(false);
        }
    }
    let columnTypes = schemaJson.columns.reduce((a, col) => {
        a[col.label] = col.type;
        return a;
    }, {});
    const handleHeaderClick = (col) => {
        if(sortConfig.column === col){
            sortConfig.asc = !sortConfig.asc;
            setSortConfig({...sortConfig});
        }else{
            sortConfig.column = col;
            sortConfig.asc = true;
            setSortConfig({...sortConfig});
        }
    }

    const getSortIcon = (col) => {
        if(col === sortConfig.column){
            if(sortConfig.asc){
                return <ArrowDown color="black" size={12} />
            }
            return <ArrowUp color="black" size={12} />
        }else{
            return <ArrowUp color="#aaa" size={12} />
        }
    }
    const navigatePage = (next, current, totalPage) => {
        if(next && current < totalPage){
            setCurrentPage(currentPage+1)
        }else{
            if(current > 1){
                setCurrentPage(currentPage - 1);
            }
        }
    }
    useEffect(() => {
      setCurrentPage(1)
    }, [records.length])
    
    return (
    <div style={{maxWidth:'100vw', overflow: 'auto'}}>
        {show && schemaJson && <RecordForm title="Edit Asset" show={show} asset={selected} setShow={setShow} handleSubmit={updateAsset} schemaJson={schemaJson}/>}
        {showDelete && <DeletePopup {...{show:showDelete, setShow: setShowDelete, asset: selected, handleSubmit: handleDeleteSubmit}}/>}
        <table className="table table-hover">
            <thead>
                <tr style={{background: '#aaa'}}>
                    {columns.map((col,index) => {
                        return <th style={{cursor:'pointer'}} key={`col-index-${index}`} onClick={() => {handleHeaderClick(col)}}>{col} {getSortIcon(col)}</th>
                    })}
                    <th></th>
                </tr>
            </thead>
            <tbody style={{background: 'white'}}>
                {records.slice((currentPage-1)*ITEM_PER_PAGE, currentPage*ITEM_PER_PAGE).map((item, index) => {
                    return (
                        <tr key={`records-item-${index}`} onDoubleClick={() => {setSelected(item); setShow(true)}}>
                            {columns.map((each, ind) => {
                                return <td key={`row-${index}-records-${ind}`} style={{minWidth:'100px'}}>{valueFormater(columnTypes[each], item[each])}</td>
                            })}
                            <td>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '1rem', paddingRight: '1rem'}}>
                                    <button type="button" className="btn btn-warning btn-sm" onClick={() => {setSelected(item); setShow(true && schemaJson)}}>Edit</button>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => {setSelected(item); setShowDelete(true)}}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        <CustomePagination
            currentPage={currentPage} 
            totalPage={(records.length%ITEM_PER_PAGE === 0) ? Math.floor(records.length/ITEM_PER_PAGE) : Math.floor(records.length/ITEM_PER_PAGE) + 1} 
            navigatePage={navigatePage}
        />
    </div>
    )
}
