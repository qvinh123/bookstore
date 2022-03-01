import React from 'react'

const ErrorMessage = ({ errorValue, touched }) => {
    return (
        errorValue && touched ? <p style={{ color: 'var(--primary-color)', fontWeight: "600",marginTop: "5px"}}>{errorValue}</p>:null
    )
}

export default ErrorMessage
