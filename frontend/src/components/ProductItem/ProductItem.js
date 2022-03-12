import React from 'react'
import { Link } from 'react-router-dom'

import { formatPrice, saveProductLocal } from "../../utils"

import TagSale from '../TagSale/TagSale'

const ProductItem = ({ product }) => {
    return (
        <div className="product-item">
            <div className="product-img">
                <Link onClick={() => saveProductLocal(product)} to={`/products/${product.slugName}`} className="text-center">
                    <img className="w-100" src={product.images[0]?.url} alt={
                        product.name
                    } />
                </Link>

                {
                    product.stock === 0 && <div className="tag-sold">
                        Hết hàng
                    </div>
                }
                {product.tag !== 0 && <TagSale value={product.tag} top="0" right="0" />}
            </div>
            <div className="product-info">
                <div className="product-title">
                    <Link to={`/products/${product.slugName}`}>{product.name}</Link>
                </div>

                <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}₫</span>
                    <span className="original-price">{formatPrice(product.priceOriginal)}₫</span>
                </div>

            </div>
        </div>

    )
}

export default ProductItem
