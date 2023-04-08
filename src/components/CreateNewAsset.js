import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { NEW_EMPTY_COLUMN } from '../constants';

function CreateNewAsset({
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
    handleCreateSchema}) {
    const handleCancel = () => {
        setCnaPop(false);
        setColumns([{...NEW_EMPTY_COLUMN}]); 
        setAssetName(''); 
        setAssetNameError(null)
    }
    return (
        <Modal show={cnaPop} onHide={handleCancel} size="lg" centered>
                <Modal.Header>
                    <Modal.Title>Create New Asset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3 col-md-6">
                        <Form.Label>Asset Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={assetName}
                            placeholder="e.g. User Asset"
                            required
                            onChange={(e) => {setAssetName(e.target.value); setAssetNameError(null);}}
                        />
                        {assetNameError && <span style={{color:'red', fontSize:'13px'}}>{assetNameError}</span>}
                    </Form.Group>
                    
                    {
                        columns.map((col, index) => {
                            return (
                                <div key={`col-index-${index}`} style={{padding: '1rem', border: '1px solid #eaeaea', borderRadius: '2px', position: 'relative', marginBottom: '1rem'}}>
                                    {columns.length > 1 &&
                                        <button 
                                            type="button" 
                                            className="btn-close btn-sm" 
                                            aria-label="Close" 
                                            style={{position: 'absolute', top:'5px', right:'5px'}}
                                            onClick={() => {deleteColumn(index)}}>
                                        </button>
                                    }           
                                    <Form className='row g-3'>
                                        <Form.Group className="mb-3 col-md-6">
                                            <Form.Label>Column Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={col.label}
                                                placeholder="Enter Column Name"
                                                required
                                                onChange={(e) => {col.label = e.target.value; col.error = null; setAssetNameError(null); setColumns([...columns])}}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3 col-md-6">
                                            <Form.Label>Select Data Type</Form.Label>
                                            <Form.Select 
                                                disabled={col.label.length > 0 ? false : true}
                                                aria-label="Select Data Type" 
                                                value={col.type}
                                                onChange={(e) => {col.type = e.target.value; col.error = null; setAssetNameError(null); setColumns([...columns])}}>
                                                <option value="text">text</option>
                                                <option value="number">number</option>
                                                <option value="email">email</option>
                                                <option value="date">date</option>
                                                <option value="select">select</option>
                                            </Form.Select>
                                        </Form.Group> 
                                        {col.type === 'select' && 
                                            <Form.Group className="mb-3 col-md-12">
                                                <Form.Label>{`Enter Select Options for ${col.label}`}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={col.options}
                                                    placeholder="e.g. [option A, option B, option C]"
                                                    required
                                                    onChange={(e) => {col.options = e.target.value; col.error = null; setAssetNameError(null); setColumns([...columns])}}
                                                />
                                            </Form.Group>
                                        }                   
                                    </Form>
                                    {col.error && <span style={{color:'red', fontSize:'13px'}}>{col.error}</span>}
                                </div>
                            )
                        })
                    }
                    <div 
                        style={{border: '1px solid', padding: '0.4rem 20px', cursor:'pointer', borderRadius: '4px'}} 
                        onClick={() => addNewColumn()}
                        className="text-primary d-flex justify-content-between align-items-center"
                        >
                        <span>Add Column</span>
                        <span style={{fontSize: '22px'}}>+</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateSchema}>
                        Create New Asset
                    </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default CreateNewAsset;