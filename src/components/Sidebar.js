import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';
import AllAssets from './AllAssets';


function Sidebar({show, setShow}) {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const fetchAssets = async () => {
        try {
            let res = await fetch(`${API_URL}?sheet=schema`);
            res = await res.json()
            setAssets(res.data.records)
        } catch (error) {
            console.log(error)
        }
    }

    const setRefreshAssets = () => {
        fetchAssets();
    }

    useEffect(() => {
        fetchAssets()
    }, [])
    
    return (
        <Offcanvas show={show} onHide={() => setShow(false)}>
            <Offcanvas.Header closeButton style={{borderBottom: '1px solid lightgray'}}>
                <Offcanvas.Title>Asset Manager</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div 
                    style={{borderBottom: '1px solid lightgray', padding: '0.8rem 20px', cursor:'pointer'}} 
                    onClick={() => {navigate('/dashboard'); setShow(false);}}
                    >
                    Dashboard
                </div>
                <AllAssets assets={assets} setShow={setShow} setRefreshAssets={setRefreshAssets}/>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default Sidebar;