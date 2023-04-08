import React from 'react'
import { hideToast } from '../helper'

function Toast() {
    return (
        <>
            <div id="my-custom-toast-123" className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" style={{position: 'absolute', right: '1rem', top: '0.9rem', zIndex:99}}>
                <div className="d-flex">
                    <div className="toast-body">
                        hello
                    </div>
                    <button type="button" onClick={hideToast} className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </>
    )
}

export default Toast