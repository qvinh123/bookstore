import React from 'react'

const BackDrop = ({ onConfirm }) => {
    return (
        <div style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100vh",
            zIndex: "10",
            background: "rgba(0, 0, 0, 0.75)"
        }}
            className="backdrop"
            onClick={onConfirm} />
    )
}

export default BackDrop
