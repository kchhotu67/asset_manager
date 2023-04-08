import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Toast from './Toast';

export default function Header() {
    const [showSiderbar, setShowSiderbar] = useState(false);
  return (
    <>
        <Toast/>
        <nav className="navbar bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <span style={{cursor:'pointer'}} onClick={()=>{setShowSiderbar(true)}}>
                        <div style={{'width': '30px', 'height': '3px', 'background': '#fff', marginBottom: '6px', marginTop: '6px'}}></div>
                        <div style={{'width': '30px', 'height': '3px', 'background': '#fff', marginBottom: '6px', marginTop: '6px'}}></div>
                        <div style={{'width': '30px', 'height': '3px', 'background': '#fff', marginBottom: '6px', marginTop: '6px'}}></div>
                    </span>
                    <Link 
                        className="navbar-brand" 
                        to={"/"}
                        style={{"color": "white", fontSize: '32px'}}>
                        Asset Manager
                    </Link>
                </div>
                <Sidebar {...{show:showSiderbar, setShow: setShowSiderbar}}/>
            </div>
        </nav>
    </>
  )
}
