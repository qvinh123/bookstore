import React, { useEffect, useState } from 'react'
import ImageMagnify from '../ImageMagnify/ImageMagnify';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const GalleryImage = ({ items }) => {
    const [width, setWidth] = useState(window.innerWidth)

    const renderItem = (arg) => {
        return <ImageMagnify image={arg} />
    }

    useEffect(() => {
        const handlerResize = () => {
            setWidth(window.innerWidth)
        }
        window.addEventListener("resize", handlerResize)

        return () => {
            window.removeEventListener("resize", handlerResize)
        }
    }, [])

    const properties = {
        thumbnailPosition: width >= 992 ? "left" : "bottom",
        showPlayButton: false,
        showFullscreenButton: false,
        renderItem,
        items: items
    };

    return <ImageGallery {...properties} />
}

export default GalleryImage
