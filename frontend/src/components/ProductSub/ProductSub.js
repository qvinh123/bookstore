import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, saveProductLocal } from '../../utils'

const ProductSub = ({ product }) => {
    return (
        <div className="row">
            <div className="col-3 pe-0">
                <div className="sub-product-left">
                    <Link onClick={() => {
                        saveProductLocal(product)
                    }
                    } to={`/products/${product.slugName}`}>
                        <img src={product.images[0].url} className="w-100" alt={product.name} />
                    </Link>
                </div>
            </div>
            <div className="col-9">
                <div className="sub-product-right">
                    <div className="sub-product-title">
                        <Link onClick={() => {

                            saveProductLocal(product)
                        }
                        } to={`/products/${product.slugName}`}>{product.name}</Link>
                    </div>
                    <div className="sub-product-price">
                        <span>{formatPrice(product.price)}₫</span>
                        <span>{formatPrice(product.priceOriginal)}₫</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductSub
