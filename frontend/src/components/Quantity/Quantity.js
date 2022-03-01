import React from 'react'

const Quantity = ({ decreaseQty, increaseQty, qty }) => {
    return (
        <div className="quantity">
            <button onClick={decreaseQty} className="minus" type="button">
                <i className="fas fa-minus"></i>
            </button>
            <input className="count" readOnly type="number" name="quantity" value={qty} min="1" />
            <button onClick={increaseQty} className="plus" type="button">
                <i className="fas fa-plus"></i>
            </button>
        </div>
    )
}

export default Quantity
