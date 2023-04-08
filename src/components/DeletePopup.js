import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function DeletePopup({show, asset, setShow, handleSubmit}) {
    const [deleteTex, setDeleteTex] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const validateDelete = () => {
        if(deleteTex === 'delete'){
            handleSubmit(asset)
        }else{
          setErrorMessage("Please type 'delete' to delete this asset!")
        }
    }
  const handleClose = () => setShow(false);
  const handleOnChange = (e) => {
    if(errorMessage){
        setErrorMessage('')
    }
    setDeleteTex(e.target.value);
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Please type <i>delete</i> to delete this record.</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={handleOnChange}
              />
            </Form.Group>
          </Form>
          {errorMessage && <span style={{color: 'red'}}>{errorMessage}</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={validateDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
   )
}

export default DeletePopup;