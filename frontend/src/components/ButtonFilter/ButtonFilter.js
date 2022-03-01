import React from 'react'

const ButtonFilter = ({ children, handleClick, filterValue, itemFilter }) => {
    return (
        <span
            onClick={handleClick}
            className={`button-filter ${filterValue === itemFilter ? "active" : ""}`}
        >
            {children}
        </span>
    )
}

export default ButtonFilter
