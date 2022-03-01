import React from 'react'
import ProductSub from '../ProductSub/ProductSub'

const ListProductsSub = ({ products }) => {
    return (
        <ul className="sub-list-products">
            {
                products?.slice(0, 3).map(product => {
                    return <li key={product._id} style={{fontWeight:"500",marginBottom:"15px"}}>
                        <ProductSub product={product} />
                    </li>
                })
            }
        </ul>
    )
}

export default ListProductsSub
