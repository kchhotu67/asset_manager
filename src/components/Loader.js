import React from 'react'
import { Spinner } from 'react-bootstrap'

function Loader() {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{width:'100%', height:'100%', flexDirection:'column'}}>
        <Spinner animation="border" variant="dark" />
        <div style={{marginTop:'5px'}}>Loading please wait...</div>
    </div>
  )
}

export default Loader