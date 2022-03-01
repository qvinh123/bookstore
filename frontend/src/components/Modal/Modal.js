import React from 'react'
import ReactDOM from 'react-dom'
import BackDrop from '../BackDrop/BackDrop'
import ModalOverlay from '../ModalOverlay/ModalOverlay'

const Modal = ({ onConfirm, children, title, width, submitHandler, loading, to }) => {
    return (
        <>
            {ReactDOM.createPortal(<BackDrop onConfirm={onConfirm} />, document.getElementById('backdrop-root'))}

            {ReactDOM.createPortal(<ModalOverlay to={to} loading={loading} submitHandler={submitHandler} width={width} title={title} onConfirm={onConfirm}>{children}</ModalOverlay>, document.getElementById('overlay-root'))}
        </>
    )
}

export default Modal
