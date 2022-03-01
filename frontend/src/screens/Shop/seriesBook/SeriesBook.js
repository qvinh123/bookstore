import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'

import MetaData from '../../../components/MetaData/MetaData'
import Loader from '../../../components/Loader/Loader'
import Layout from "../../../components/layout/Layout"
import Banner from '../../../components/Banner/Banner'
import ProductItem from '../../../components/ProductItem/ProductItem'
import SelectSort from '../../../components/SelectSort/SelectSort'
import Paginate from '../../../components/Paginate/Paginate'

import * as SeriesBookAPI from '../../../api/seriesBookAPI.js'

import { usePagePagination } from '../../../hooks/usePagePagination'


const SeriesBook = () => {
    const { slug } = useParams()
    const alert = useAlert()

    const [seriesBook, setSeriesBook] = useState({})
    const [loading, setLoading] = useState(false)

    const [sort, setSort] = useState("-createdAt")

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    useEffect(() => {
        const fetchProductsAuthor = async () => {
            setLoading(true)
            try {
                const { data } = await SeriesBookAPI.getProductsOfCollectionBookDetail(slug, currentPage + 1, sort)
                setSeriesBook(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchProductsAuthor()
    }, [alert, slug, currentPage, sort])

    const img = 'https://www.fahasa.com/skin/frontend/ma_vanese/fahasa/images/label_Bo.svg'

    const title =
        <>
            <span
                style={{
                    height: "2.3rem",
                    width: "2.3rem",
                    marginRight: "5px",
                    display: "inline-block",
                    verticalAlign: "middle",
                    position: "relative"
                }}
                className="fhs-series-label">
                <i style={{
                    position: "absolute",
                    backgroundImage: `url(${img})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    height: "100%",
                    width: "100%",
                    display: "inline-block",
                    marginTop: "-0.1rem",
                }}>
                </i>
            </span>
            {seriesBook?.data?.name}
        </>


    return (
        <>
            <MetaData title={seriesBook?.data?.name} />
            {
                loading ? <Loader /> :
                    <Layout>
                        <Banner color="var(--white-color)" title={seriesBook?.data?.name} />
                        <div className="wrapper">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 style={{ marginBottom: "15px", textTransform: "uppercase" }}>{title}</h5>
                                {
                                    seriesBook?.data?.products?.length > 1 ?
                                        <SelectSort value={sort}
                                            handle={(e) => {
                                                setSort(e.target.value)
                                                setCurrentPage(0)
                                            }}
                                        />
                                        : ""
                                }
                            </div>
                            <div className="container-grid">
                                {
                                    seriesBook?.data?.products?.length > 0 ? seriesBook?.data?.products?.map(product => (
                                        <ProductItem key={product._id} product={product} />
                                    )) : ""
                                }
                            </div>
                        </div>

                        {
                            seriesBook.productsCount > seriesBook.resultPerPage &&
                            <Paginate
                                currentPage={currentPage}
                                arr={seriesBook.productsCount}
                                setCurrentPageNo={setCurrentPageNo}
                                resultPerPage={seriesBook.resultPerPage} />
                        }
                    </Layout>
            }
        </>
    )
}

export default SeriesBook

