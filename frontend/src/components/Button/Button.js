import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ children, to, bg, onClick, width, loading, color, border, mr, ...rest }) => {
    let Component = "button"

    const props = { ...rest }

    if (to) {
        Component = Link
        props.to = to
    }

    if (onClick) {
        props.onClick = onClick
    }

    return (

        <Component {...props} style={{ border: `${border && border}`, background: `${bg ? bg : "var(--primary-color)"}`, width: `${width ? width : "auto"}`, color: `${color && color}`, marginRight: `${mr && mr}` }} className="button-action">
            {loading ? <div className="spinner-border spinner-border-sm text-white"></div> : children}
        </Component>
    )
}

export default Button