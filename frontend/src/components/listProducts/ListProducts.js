import React from 'react'
import Slider from "react-slick";
import ProductItem from '../ProductItem/ProductItem'
import { Link } from "react-router-dom"

const ListProducts = ({ products, title, path, loading }) => {
    const settings = {
        dots: false,
        infinite: products && products.length > 5 ? true : false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="products">
            <div className="wrapper">
                <div className="product_title">
                    <h3>
                        {title}
                    </h3>
                </div>
                <div className="product_list">
                    <Slider {...settings}>
                        {products.map(product => (
                            <div key={product._id} className="px-2">
                                <ProductItem product={product} />
                            </div>
                        ))}
                    </Slider>
                </div>

                {!loading &&
                    <div className="more">
                        <Link to={path}>Xem thêm &gt;&gt;</Link>
                    </div>}
            </div>
        </div>
    )
}

export default ListProducts
