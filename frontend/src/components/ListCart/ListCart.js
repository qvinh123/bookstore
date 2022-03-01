import React from 'react'
import CartItem from '../../screens/Shop/cart/CartItem/CartItem'

const ListCart = ({ cartItems }) => {

    return (
        <div className="listCart">
            <div className="container text-lg-center mt-4">
                <table className="table mb-0" style={{ color: 'var(--text-color)' }}>
                    <thead className="d-none d-lg-block">
                        <tr className="row">
                            <th className="col-2"></th>
                            <th className="col-3">Sản phẩm</th>
                            <th className="col-2">Đơn giá</th>
                            <th className="col-2">Số lượng</th>
                            <th className="col-2">Tổng tiền</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {cartItems && cartItems.map(cart => (
                            <CartItem key={cart.product._id} cart={cart} cartItems={cartItems} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListCart
