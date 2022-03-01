import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'

import MetaData from '../../../components/MetaData/MetaData'
import Loader from '../../../components/Loader/Loader'
import Paginate from '../../../components/Paginate/Paginate'
import Layout from '../../../components/layout/Layout'
import ProductItem from '../../../components/ProductItem/ProductItem'
import Banner from '../../../components/Banner/Banner'
import SelectSort from "../../../components/SelectSort/SelectSort"

import * as AuthorAPI from '../../../api/authorsAPI'

import { usePagePagination } from '../../../hooks/usePagePagination'


const ProductsAuthor = () => {

    const [author, setAuthor] = useState({})
    const [loading, setLoading] = useState(false)

    const [sort, setSort] = useState("-createdAt")

    const [isShowMore, setIsShowMore] = useState(false)

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    const { slug } = useParams()

    const alert = useAlert()

    useEffect(() => {
        const fetchProductsAuthor = async () => {
            setLoading(true)
            try {
                const { data } = await AuthorAPI.getProductsOfAuthorDetail(slug, currentPage + 1, sort)
                setAuthor(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchProductsAuthor()
    }, [alert, slug, currentPage, sort])


    return (
        <>
            <MetaData title={author.data?.name} />
            {
                loading ? <Loader /> :
                    <Layout>
                        <Banner color="var(--white-color)" title={author?.data?.name} />
                        <div className="wrapper">
                            <div className="row mb-5">
                                <div className="col-lg-2 col-12 d-flex align-self-start">
                                    <img
                                        style={{ width: '100%', height: '100%', objectFit: "contain" }}
                                        src={author?.data?.avatar.url}
                                        alt={author?.data?.name} />
                                </div>
                                <div className="col-lg-10 col-12" style={{ position: "relative" }}>
                                    <h4
                                        style={{ textTransform: "uppercase", fontWeight: "400", borderBottom: '1px solid var(--secondary-color)', paddingBottom: '15px', marginBottom: "20px" }}>
                                        {author?.data?.name}
                                    </h4>
                                    {
                                        author?.data?.description ?
                                            isShowMore ?
                                                author?.data?.description?.split("\n").map((str, i) => (
                                                    <p key={i}>{str}</p>
                                                ))
                                                :
                                                author?.data?.description?.split("\n").slice(0, 2).map((str, i) => (
                                                    <p key={i}>{str}</p>
                                                ))
                                            : ""
                                    }
                                    {
                                        author?.data?.description ?
                                            !isShowMore ?
                                                <div className="showMore" style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    width: "100%",
                                                    paddingTop: "50px",
                                                    textAlign: "center",
                                                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.91) 50%, #fff 55%)'
                                                }}>
                                                    <button className="showMoreLess" onClick={() => setIsShowMore(true)}>
                                                        Xem thêm
                                                        <i className="fa fa-angle-down"></i>
                                                    </button>
                                                </div> :
                                                <div className="showLess text-center">
                                                    <button className="showMoreLess" onClick={() => setIsShowMore(false)}>
                                                        Thu gọn
                                                        <i className="fa fa-angle-up"></i>
                                                    </button>
                                                </div> : ""
                                    }
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 style={{ marginBottom: "15px", textTransform: "uppercase" }}>{`Tác phẩm của ${author.data?.name}`}</h5>
                                {
                                    author?.data?.products?.length > 1 ? <SelectSort value={sort}
                                        handle={(e) => {
                                            setSort(e.target.value)
                                            setCurrentPage(0)
                                        }}
                                    /> : ""
                                }
                            </div>
                            <div className="container-grid">
                                {
                                    author?.data?.products?.length > 0 ? author?.data?.products?.map(product => (
                                        <ProductItem key={product._id} product={product} />
                                    )) : ""
                                }
                            </div>
                        </div>

                        {
                            author.productsCount > author.resultPerPage &&
                            <Paginate currentPage={currentPage} arr={author.productsCount} setCurrentPageNo={setCurrentPageNo} resultPerPage={author.resultPerPage} />
                        }
                    </Layout>
            }
        </>
    )
}

export default ProductsAuthor
