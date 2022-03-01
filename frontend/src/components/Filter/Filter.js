import React, { useEffect, useState } from 'react'

const Filter = ({ children, title }) => {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        if (window.innerWidth <= 992) {
            setOpen(false)
        } else {
            setOpen(true)
        }
    }, [])

    return (
        <div className="filter">
            <button className={`accordion ${open === false && 'plug'}`} onClick={() => setOpen(!open)}>
                <span>{title}</span>
            </button>
            <div className={`sidebar-sort ${open === false && 'close'}`}>
                <ul className="filter-price">
                    {children}
                </ul>
            </div>
        </div>
    )
}

export default Filter
