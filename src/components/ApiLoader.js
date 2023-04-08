import { Spinner } from 'react-bootstrap'

export default function ApiLoader() {
    return (
        <div 
            id='my-event-loader' 
            style={{
                display:'none', 
                background: '#ffffff1a', 
                zIndex: 9999, 
                position:'absolute', 
                width: '100vw', 
                height: '100vh', 
                overflow: 'hidden', 
                left: '0px', 
                top:'0px'
            }}>
            <div className='d-flex justify-content-center align-items-center' style={{width:'100%', height:'100%', gap:'10px'}}>
                <Spinner animation="grow" size='sm' variant="danger" />
                <Spinner animation="grow" size='sm' variant="warning" />
                <Spinner animation="grow" size='sm' variant="info" />
                <Spinner animation="grow" size='sm' variant="light" />
            </div>
        </div>
    )
}
