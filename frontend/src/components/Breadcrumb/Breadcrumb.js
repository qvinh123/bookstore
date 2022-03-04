import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumb = ({ slugCategory, name, color, category }) => {
    return (
        <div className="breadcrumb-small" style={{ color: color }}>
            <Link to="/">Trang chủ</Link>
            {category &&
                <>
                    <span> / </span>
                    <Link to={`/categories/${slugCategory}`}>{category}</Link>
                </>
            }
            {name &&
                <>
                    <span> / </span>
                    <span>{name}</span>
                </>
            }
        </div>
    )
}

export default Breadcrumb
