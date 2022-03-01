import React from 'react'
import Button from '../Button/Button'

const ModalOverlay = ({ children, title, onConfirm, width, submitHandler, loading, to }) => {
    return (
        <div className="modal-overlay" style={{ width: width }}>
            <header className="modal-header border-0">
                <button onClick={onConfirm} type="button" className="btn-close"></button>
            </header>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer border-0">
                <Button to={to} disabled={loading} loading={loading} type="button" onClick={submitHandler} width="auto">{title}</Button>
            </div>
        </div>
    )
}

export default ModalOverlay
