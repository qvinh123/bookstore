import React, { useEffect, useState } from 'react'

import Carousel from '../../../components/carousel/Carousel'
import ListProducts from '../../../components/listProducts/ListProducts'

import { useAlert } from 'react-alert'

import * as ProductAPI from '../../../api/productAPI'
import * as BannerAPI from '../../../api/bannerAPI'

import Layout from '../../../components/layout/Layout'
import MetaData from '../../../components/MetaData/MetaData'
import Loader from '../../../components/Loader/Loader'

const Home = () => {
    const alert = useAlert()
    const [products, setProducts] = useState(null)
    const [loading, setLoading] = useState(false)

    const [images, setImages] = useState([])

    useEffect(() => {
        const fetchProductsHome = async () => {
            setLoading(true)
            return Promise.all([ProductAPI.getAllProducts(), await BannerAPI.getBanners()])
                .then(value => {
                    setProducts(value[0].data.data)
                    setImages(value[1].data.banners)
                    setLoading(false)
                }).catch(err => {
                    alert.error(err.response.data.message)
                })
        }
        fetchProductsHome()
    }, [alert])

    return (
        <>
            <MetaData />
            {loading ? <Loader /> :
                <Layout>
                    <Carousel images={images} />

                    <ListProducts loading={loading} title={products?.name} products={products?.products || []} path="/tat-ca-san-pham" />

                </Layout>
            }
        </>
    )
}

export default Home
