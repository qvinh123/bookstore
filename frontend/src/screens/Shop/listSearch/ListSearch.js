import React, { useEffect, useState } from 'react'

import { useAlert } from 'react-alert'

import { useDispatch } from 'react-redux'

import { usePagePagination } from '../../../hooks/usePagePagination'

import { useParams } from 'react-router'

import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb'
import Loader from '../../../components/Loader/Loader'
import Paginate from '../../../components/Paginate/Paginate'
import Layout from '../../../components/layout/Layout'
import ProductItem from '../../../components/ProductItem/ProductItem'
import MetaData from '../../../components/MetaData/MetaData'

import * as ProductAPI from '../../../api/productAPI'


const ListSearch = () => {
    const alert = useAlert()

    const { keyword } = useParams()

    const [productsSearch, setProductsSearch] = useState(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const { currentPage, setCurrentPageNo } = usePagePagination()

    useEffect(() => {
        const fetchProductSearch = async () => {
            setLoading(true)
            try {
                if (keyword) {
                    const { data } = await ProductAPI.getProductSearch(keyword, currentPage + 1)
                    setProductsSearch(data)
                    setLoading(false)
                }
            } catch (err) {
                alert.error(err.response.data.message)
                setProductsSearch(null)
                setLoading(false)
            }
        }
        fetchProductSearch()
    }, [dispatch, keyword, currentPage, alert])

    const listProductsSearch = productsSearch?.data?.products?.map(product => (
        <ProductItem key={product._id} product={product} />
    ))

    return (
        <>
            <MetaData title="Kết quả tìm kiếm" />
            {loading ? <Loader /> :
                <Layout>
                    <div className="wrapper">
                        <Breadcrumb color="var(--text-color)" name="Tìm kiếm" />

                        <div className="products-search" style={{ paddingTop: "30px" }}>
                            <h5 style={{ textTransform: "uppercase", marginBottom: "60px", textAlign: "center" }}>KẾT QUẢ TÌM KIẾM: {keyword}</h5>

                            <div className="search-title">
                                <h4 style={{ textTransform: "uppercase" }}>{productsSearch?.productsCount === 0 ? "Không có sản phẩm phù hợp với yêu cầu" : 'SẢN PHẨM PHÙ HỢP'}</h4>
                            </div>

                            <div className="container-grid">
                                {listProductsSearch}

                                {productsSearch?.productsCount > productsSearch?.resultPerPage &&
                                    <Paginate currentPage={currentPage} arr={productsSearch?.productsCount} resultPerPage={productsSearch?.resultPerPage} setCurrentPageNo={setCurrentPageNo} />
                                }
                            </div>
                        </div>
                    </div>
                </Layout>
            }
        </>
    )
}

export default ListSearch
