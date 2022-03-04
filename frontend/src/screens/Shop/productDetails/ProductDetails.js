import React, { useEffect, useState, useCallback } from 'react'

import { useParams } from 'react-router'
import { useAlert } from 'react-alert'

import Layout from '../../../components/layout/Layout'
import MetaData from '../../../components/MetaData/MetaData'
import GalleryImage from '../../../components/GalleryImage/GalleryImage'
import Loader from '../../../components/Loader/Loader'
import ListProducts from '../../../components/listProducts/ListProducts'
import TagSale from '../../../components/TagSale/TagSale'
import Button from '../../../components/Button/Button'
import Breadcrumb from '../../../components/Breadcrumb/Breadcrumb'
import ListProductsSub from '../../../components/ListProductsSub/ListProductsSub'
import ProductDetailsContent from './ProductDetailsContent'
import ProductDetailsComment from './ProductDetailsComment'

import * as SeriesBookAPI from "../../../api/seriesBookAPI"
import * as AuthorAPI from "../../../api/authorsAPI"
import * as CategoryAPI from "../../../api/categoriesAPI"
import * as ProductAPI from "../../../api/productAPI"

const ProductDetails = () => {
    const { slugName } = useParams()

    const alert = useAlert()

    const [flag, setFlag] = useState(false)

    const [loading, setLoading] = useState(false)

    const [productDetails, setProductDetails] = useState({})

    const [productsOfCategory, setProductsOfCategory] = useState([])

    const [productsOfAuthor, setProductsOfAuthor] = useState([])

    const [productsOfCollectionBook, setProductsOfCollectionBook] = useState([])

    const [loadingProductsRelated, setLoadingProductsRelated] = useState(false)

    const arrLastViews = JSON.parse(localStorage.getItem("lastViews"))

    const handleFlag = (f) => {
        setFlag(f)
    }

    const fetchProductsRelated = useCallback(async (product) => {

        const fetchProductsAuthor = async () => {
            setLoadingProductsRelated(true)
            try {
                const { data } = await AuthorAPI.getProductsOfAuthorDetail(product?.authors[0]?.slugName)
                setProductsOfAuthor(data.data.products)
                setLoadingProductsRelated(false)
            } catch (err) {
                setLoadingProductsRelated(false)
                alert.error(err.response.data.message)
            }
        }

        if (product?.authors[0]?.slugName) {
            fetchProductsAuthor()
        }

        const fetchProductsCategory = async () => {
            setLoadingProductsRelated(true)
            try {
                const { data } = await CategoryAPI.getProductsOfCategoryDetail(product?.category?.slugName)
                setProductsOfCategory(data.data.products)
                setLoadingProductsRelated(false)
            } catch (err) {
                setLoadingProductsRelated(false)
                alert.error(err.response.data.message)
            }
        }

        if (product?.category?.slugName) {
            fetchProductsCategory()
        }

        const fetchProductCollectionBook = async () => {
            setLoadingProductsRelated(true)
            try {
                const { data } = await SeriesBookAPI.getProductsOfCollectionBookDetail(product?.collectionBook?.slugName)
                setProductsOfCollectionBook(data.data.products)
                setLoadingProductsRelated(false)
            } catch (err) {
                setLoadingProductsRelated(false)
                alert.error(err.response.data.message)
            }
        }

        if (product?.collectionBook?.slugName) {
            fetchProductCollectionBook()
        }
    }, [alert]
    )

    useEffect(() => {
        const fetchDetailsProduct = async () => {
            setLoading(true)
            try {
                const { data } = await ProductAPI.getDetailsProduct(slugName)
                setProductDetails(data?.product)
                await fetchProductsRelated(data?.product)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                alert.error(error.response.data.message)
            }
        }
        fetchDetailsProduct()

    }, [slugName, alert, fetchProductsRelated, flag])

    const arrImage = []
    productDetails?.images?.length > 0 && productDetails?.images?.map(product => {
        return arrImage.push({
            original: product.url,
            thumbnail: product.url,
            originalHeight: "500px"
        })
    })

    const productsFilter = (products) => products.filter(product => product._id !== productDetails?._id)

    return (
        <>
            <MetaData title={productDetails?.name} />

            {loading || loadingProductsRelated ? <Loader /> :
                <Layout>
                    <div className="product-details">
                        <div className="wrapper">
                            <div className="breadcrumb-details mt-lg-4">
                                <Breadcrumb category={productDetails?.category?.name || ""} slugCategory={productDetails?.category?.slugName || ""} name={productDetails?.name} color="var(--text-color)" />
                            </div>

                            <div className="content-details">
                                <div className="row">
                                    <div className="col-lg-5">
                                        <div className="details-img">
                                            <GalleryImage items={arrImage} />
                                            <TagSale value={productDetails?.tag} top="10" right="10" />
                                            <div id="imageZoomPortal" />
                                        </div>
                                    </div>
                                    <div className="col-lg-7">
                                        <ProductDetailsContent productDetails={productDetails} />
                                    </div>
                                </div>
                            </div>

                            <div className="tab-detail">
                                <div className="row">
                                    <div className={`${productsFilter(productsOfAuthor).length <= 0 ? "col-lg-12" : "col-lg-9"} p-lg-0 col-12`}>
                                        <ul className="nav-details nav nav-pills" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link-details nav-link active" id="pills-description-tab" data-bs-toggle="pill" data-bs-target="#pills-description" type="button" role="tab" aria-controls="pills-description" aria-selected="true">Mô tả - Đánh giá</button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button className="nav-link-details nav-link" id="pills-comment-tab" data-bs-toggle="pill" data-bs-target="#pills-comment" type="button" role="tab" aria-controls="pills-comment" aria-selected="false">Bình luận</button>
                                            </li>
                                        </ul>


                                        <div className="tab-content" id="pills-tabContent" style={{ padding: "15px", border: "1px solid #e6e6e6" }}>

                                            <div className="tab-pane fade show active" id="pills-description" role="tabpanel" aria-labelledby="pills-description-tab">
                                                {
                                                    productDetails?.description?.split("\n").map((str, i) => (
                                                        <p key={i}>{str}</p>
                                                    ))
                                                }
                                            </div>

                                            <div className="tab-pane fade" id="pills-comment" role="tabpanel" aria-labelledby="pills-comment-tab">
                                                <ProductDetailsComment handle={handleFlag} flag={flag} productsOfAuthor={productsFilter(productsOfAuthor)} productDetails={productDetails} />
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        productsFilter(productsOfAuthor).length === 0 ? "" :
                                            <div className="col-lg-3 col-12">
                                                <div className="related-products">
                                                    <div className="related-products-head">
                                                        <h6>Sách cùng tác giả</h6>
                                                    </div>
                                                    <div style={{ padding: "15px" }}>
                                                        <ListProductsSub products={productsFilter(productsOfAuthor)} />
                                                    </div>

                                                    {
                                                        productsFilter(productsOfAuthor).length > 4 &&
                                                        <div className="related-products-more">
                                                            <Button width="auto" to={`/authors/${productDetails?.authors[0]?.slugName}`}>Xem thêm</Button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            productsFilter(productsOfCategory).length > 0 ?
                                <ListProducts title="Sách cùng thể loại" products={productsFilter(productsOfCategory)} loading={loadingProductsRelated} path={`/categories/${productDetails?.category?.slugName}`} /> : ""
                        }

                        {
                            productsFilter(productsOfCollectionBook).length > 0 ?
                                <ListProducts title="sách cùng bộ" products={productsFilter(productsOfCollectionBook)} loading={loadingProductsRelated} path={`/seriesbook/${productDetails?.collectionBook?.slugName}`} />
                                : ""
                        }

                        {
                            arrLastViews?.length > 0 ?
                                <ListProducts title="sản phẩm đã xem" products={arrLastViews} loading={loadingProductsRelated} path={`/pages/san-pham-da-xem`} />
                                : ""
                        }
                    </div>
                </Layout>
            }
        </>
    )
}

export default ProductDetails