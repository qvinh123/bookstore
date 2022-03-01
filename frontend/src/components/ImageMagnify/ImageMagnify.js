import React from 'react'
import ReactImageMagnify from 'react-image-magnify'

const ImageMagnify = (props) => {
    return (
        <ReactImageMagnify
            {...{
                smallImage: {
                    alt: "Image Book",
                    isFluidWidth: true,
                    src: props.image.original
                },
                largeImage: {
                    src: props.image.original,
                    width: 700,
                    height: 1200
                },
                enlargedImagePortalId: "imageZoomPortal",
                enlargedImageContainerStyle: {
                    zIndex: "1500",
                    border: "4px solid #666666"
                },

                enlargedImageContainerDimensions: {
                    width: "110%",
                    height: "85%"
                }}
            }
        />
    )
}

export default ImageMagnify
