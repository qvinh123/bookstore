import React from 'react'

import { Link } from "react-router-dom"

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ images }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed:4000,
        lazyLoad: true,
    };


    return (
        <div className="carousel">
            <Slider {...settings}>
                {
                    images.map(image => (
                        <Link key={image.public_id} to={`/products/${image.product.slugName}`}>
                            <img className="w-100" src={image.url} alt={image.public_id} />
                        </Link>
                    ))
                }
            </Slider>
        </div>
    )
}

export default Carousel
