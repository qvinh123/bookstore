import React from 'react'

import MetaData from '../../../components/MetaData/MetaData'
import Layout from "../../../components/layout/Layout"
import Banner from '../../../components/Banner/Banner'
import ProductItem from '../../../components/ProductItem/ProductItem'

const LastViews = () => {

    const lastViews = localStorage.getItem("lastViews") ? JSON.parse(localStorage.getItem("lastViews")) : []

    return (
        <Layout>
            <MetaData title="Sản phẩm đã xem" />

            <Banner color="var(--white-color)" title={"Sản phẩm đã xem"} />

            <div className="wrapper">
                <h5 style={{ marginBottom: "15px", textTransform: "uppercase" }}>Sản phẩm đã xem</h5>
                <div className="container-grid">
                    {
                        lastViews?.length > 0 ? lastViews?.map(product => (
                            <ProductItem key={product._id} product={product} />
                        )) : ""
                    }
                </div>
            </div>
        </Layout>
    )
}

export default LastViews
