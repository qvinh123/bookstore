import React from 'react'

const TagSale = ({ value, top, right }) => {
    return (
        <div className="tag-saleoff" style={{
            top: `${top}px`,
            right: `${right}px`,
            position: 'absolute',
            zIndex: 1,
            background: "var(--primary-color)",
            height: "40px",
            width: "40px",
            lineHeight: " 40px",
            borderRadius: "50%",
            color: "var(--white-color)",
            textAlign: "center",
        }}>
            -{value}%
        </div>
    )
}

export default TagSale
