import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { displayToast } from '../helper';

function DeleteSheetPopup({show, sheetName, setShow, handleDeleteSheet}) {
    const [deleteTex, setDeleteTex] = useState('');
    const validateDelete = () => {
        if(deleteTex === 'delete'){
            handleDeleteSheet(sheetName)
        }else{
          displayToast({COLOR: 'red', MESSAGE:"Please type 'delete' to delete this asset!"})
        }
    }
  const handleClose = () => setShow(false);
  const handleOnChange = (e) => {
    setDeleteTex(e.target.value);
  }
  return (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div>
                After deleting this asset, it won't be recovered.
            </div>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Please type <i>delete</i> to delete this Asset.</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                onChange={handleOnChange}
              />
            </Form.Group>
          </Form>
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

export default DeleteSheetPopup;