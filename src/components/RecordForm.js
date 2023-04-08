import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { valueFormater } from '../helper';

function RecordForm({title, show, asset, columns = [], setShow, handleSubmit, schemaJson}) {
  const [newAsset, setNewAsset] = useState(show && asset? asset : columns.reduce((c, item) => {return {...c, [item]: ''};}, {}));
  const handleClose = () => setShow(false);
  const parseForm = (form) => {
    if(form.type === "select"){
      return (
      <Form.Group className="mb-3 col-md-6" controlId={`exampleForm.${form.label}`} key={`exampleForm.${form.label}`}>
        <Form.Label>{form.label}</Form.Label>
        <Form.Select 
          value={newAsset[form.label]} 
          onChange={(e) => {newAsset[form.label] = e.target.value;setNewAsset({...newAsset})}} 
          aria-label="Default select example">
          <option>{`Select ${form.label}`}</option>
          {form.options.map((item,ind) => {
            return <option value={item} key={`${form.label}-option-${ind+1}`}>{item}</option>
          })}
        </Form.Select>
      </Form.Group>
      )
    }
    return (
    <Form.Group className="mb-3 col-md-6" controlId={`exampleForm.${form.label}`} key={`exampleForm.${form.label}`}>
      <Form.Label>{form.label}</Form.Label>
      <Form.Control
        type={form.type}
        placeholder={`Enter ${form.label}`}
        value={valueFormater(form.type, newAsset[form.label])} 
        onChange={(e) => {newAsset[form.label] = e.target.value;setNewAsset({...newAsset})}} 
      />
    </Form.Group>
    )
  }
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='row g-3'>
          {schemaJson.columns.map((item, index) => {
            return parseForm(item)
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {handleSubmit(newAsset)}}>
          {title === "Add Asset" ? "Add" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
   )
}

export default RecordForm;