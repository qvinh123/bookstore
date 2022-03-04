import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { usePagePagination } from '../../../hooks/usePagePagination'

import ProductItem from '../../../components/ProductItem/ProductItem'
import Banner from '../../../components/Banner/Banner'
import Paginate from '../../../components/Paginate/Paginate'
import Filter from '../../../components/Filter/Filter'
import Layout from '../../../components/layout/Layout'
import MetaData from '../../../components/MetaData/MetaData'
import Ratings from '../../../components/Ratings/Ratings'
import LoaderSmall from '../../../components/LoaderSmall/LoaderSmall'
import SelectSort from '../../../components/SelectSort/SelectSort'

import { useAlert } from 'react-alert'

import * as CategoriesAPI from "../../../api/categoriesAPI"
import * as ProductAPI from "../../../api/productAPI"

const listFilterPrice = [
    {
        id: 1,
        label: "Tất cả",
        value: [0, 1000000000]
    },
    {
        id: 2,
        label: "Nhỏ hơn 100,000₫",
        value: [1, 100000]
    },
    {
        id: 3,
        label: "Từ 100,000₫ - 200,000₫",
        value: [100000, 200000]
    },
    {
        id: 4,
        label: "Từ 200,000₫ - 300,000₫",
        value: [200000, 300000]
    },
    {
        id: 5,
        label: "Từ 300,000₫ - 400,000₫",
        value: [300000, 400000]
    },
    {
        id: 6,
        label: "Từ 400,000₫ - 500,000₫",
        value: [400000, 500000]
    },
    {
        id: 7,
        label: "Trên 500,000₫",
        value: [500000, 100000000]
    }
]

const listObject = [
    "Nhà trẻ - mẫu giáo (0 - 6)",
    "Nhi đồng (6 - 11)",
    "Thiếu niên (11 - 15)",
    "Tuổi mới lớn (15 - 18)",
    "Cha mẹ đọc cùng con"
]

const Collections = () => {
    const { slug } = useParams()

    const alert = useAlert()

    const [collection, setCollection] = useState({})
    const [loading, setLoading] = useState(false)

    const [price, setPrice] = useState("")
    const [sort, setSort] = useState("-createdAt")

    const [rating, setRating] = useState("")
    const [objects, setObjects] = useState([])

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                let data
                if (slug) {
                    data = await CategoriesAPI.getProductsOfCategoryDetail(slug, currentPage + 1, price, rating, objects, sort)
                } else {
                    data = await ProductAPI.getAllProducts(currentPage + 1, price, rating, objects, sort)
                }

                setLoading(false)
                setCollection(data.data)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchProducts()

        return () => {
            window.scrollTo({
                top: 200,
                left: 0,
                behavior: "smooth"
            })
        }

    }, [price, currentPage, rating, objects, sort, alert])

    useEffect(() => {
        return () => {
            setSort("-createdAt")
            setPrice("")
            setRating("")
            setObjects([])
        }
    }, [slug])

    return (
        <>
            <MetaData title={collection?.data?.name} />
            <Layout>
                <div className="collection">
                    <Banner color="var(--white-color)" title={collection?.data?.name} />
                    <div className="wrapper">
                        <div className="row">
                            <div className="col-lg-3 col-12 order-2 order-lg-1">
                                <div className="collection-sidebar">
                                    <div className="collection-sidebar-filter">
                                        <div className="row">
                                            <div className="col-12 col-md-6 col-lg-12">
                                                <Filter title="khoảng giá">
                                                    {
                                                        listFilterPrice.map(pricePr => (
                                                            <li key={pricePr.id}>
                                                                <label>
                                                                    <input
                                                                        value={price}
                                                                        onChange={() => {
                                                                            setPrice(pricePr.value)
                                                                            setCurrentPage(0)
                                                                        }}
                                                                        checked={price === pricePr.value ? true : false}
                                                                        type="radio"
                                                                        name="price-filter" />
                                                                    <span>{pricePr.label}</span>
                                                                </label>
                                                            </li>
                                                        ))}
                                                </Filter>
                                            </div>


                                            <div className="col-12 col-md-6 col-lg-12">
                                                <Filter title="Đánh giá">
                                                    {
                                                        [5, 4, 3, 2, 1].map(option => {
                                                            return (
                                                                <li key={option}>
                                                                    <label style={{ fontSize: "10px", fontStyle: "italic" }}>
                                                                        <input
                                                                            value={rating}
                                                                            onChange={() => {
                                                                                setRating(option)
                                                                                setCurrentPage(0)
                                                                            }}
                                                                            checked={option === rating ? true : false}
                                                                            type="radio"
                                                                            name="rating-filter" />
                                                                        <Ratings color="#fdcc0d" fontSize="14px" value={option} />
                                                                        ({option} sao)
                                                                    </label>
                                                                </li>
                                                            )
                                                        })}
                                                </Filter>
                                            </div>

                                            <div className="col-12 col-md-6 col-lg-12">
                                                <Filter title="Đối tượng">
                                                    {
                                                        listObject?.sort((a, b) => a > b ? 1 : -1)
                                                            .map(option => {
                                                                return (
                                                                    <li key={option}>
                                                                        <label>
                                                                            <input
                                                                                onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setObjects([...objects, option])
                                                                                    } else {
                                                                                        setObjects([...objects].filter((id) => id !== option))
                                                                                    }
                                                                                    setCurrentPage(0)
                                                                                }}
                                                                                type="checkbox"
                                                                                name="options2-filter" />
                                                                            <span>{option}</span>
                                                                        </label>
                                                                    </li>
                                                                )
                                                            })}
                                                </Filter>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9 col-12 order-1 order-lg-2">
                                <div className="collection_head">
                                    <div className="row">
                                        <div className="col-lg-6 col-12">
                                            <h5>{collection?.data?.name}</h5>
                                        </div>
                                        <div className="col-md-6 col-12 text-lg-end">
                                            <SelectSort value={sort} handle={(e) => setSort(e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {
                                    <div className="collection_body">
                                        <div className="row">
                                            {
                                                loading ? <LoaderSmall /> : collection?.data?.products?.length === 0 ? <p>Không có sản phẩm phù hợp với yêu cầu</p> :
                                                    <>
                                                        {collection?.data?.products?.map(product => (
                                                            <div key={product._id} className="col-lg-3 col-md-4 col-6">
                                                                <ProductItem key={product._id} product={product} />
                                                            </div>
                                                        ))}

                                                        {collection.productsCount > collection.resultPerPage &&
                                                            <Paginate currentPage={currentPage} arr={collection.productsCount} setCurrentPageNo={setCurrentPageNo} resultPerPage={collection.resultPerPage} />
                                                        }
                                                    </>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Collections
