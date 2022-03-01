import React from 'react'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

const Banner = ({ title, color }) => {
    return (
        <div className="banner">
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <div className="wrapper">
                    <div className="breadcrumb-big">
                        <h2>
                            {title}
                        </h2>
                    </div>
                    <Breadcrumb name={title} color={color} />
                </div>
            </div>
        </div>
    )
}

export default Banner
