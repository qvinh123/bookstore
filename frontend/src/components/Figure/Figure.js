import React from 'react'

const Figure = (props) => {
    return (
        <figure className="avatar" style={{ width: props.width, height: props.height }}>
            <img className="rounded-circle" src={props.image} alt="figure-img" />
        </figure>
    )
}

export default Figure
