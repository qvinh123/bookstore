import React, { useEffect, useState } from 'react';

import { Link } from "react-router-dom"

import { useAlert } from 'react-alert';

import MetaData from '../../../components/MetaData/MetaData';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Loader from '../../../components/Loader/Loader';
import Paginate from '../../../components/Paginate/Paginate';
import SelectSort from '../../../components/SelectSort/SelectSort';

import * as ProductAPI from "../../../api/productAPI"
import * as BannerAPI from "../../../api/bannerAPI"

import { formatPrice } from '../../../utils';

import { usePagePagination } from '../../../hooks/usePagePagination';
import Modal from '../../../components/Modal/Modal';

const ProductsAdmin = () => {
    const alert = useAlert()

    const [products, setProducts] = useState([])

    const [loading, setLoading] = useState(false)

    const [valueSearch, setValueSearch] = useState("")

    const [sort, setSort] = useState("-createdAt")

    const [isDelete, setIsDelete] = useState(false)

    const { currentPage, setCurrentPage, setCurrentPageNo } = usePagePagination()

    const [isModal, setIsModal] = useState(false)
    const [productId, setProductId] = useState("")
    const [loadingUpload, setLoadingUpload] = useState(false)
    const [image, setImage] = useState()

    useEffect(() => {
        if (valueSearch) setCurrentPage(0)
    }, [valueSearch, setCurrentPage])

    useEffect(() => {
        const fetchBannerDetails = async () => {
            try {
                const { data } = await BannerAPI.getBannerDetails(productId)
                setImage(data.banner)
            } catch (err) {
                alert.error(err.response.data.message)
            }
        }
        if (isModal) {
            fetchBannerDetails()
        }
    }, [alert, productId, isModal])

    useEffect(() => {
        if (valueSearch) {
            const timeout = setTimeout(() => {
                const fetchProductSearch = async () => {
                    setLoading(true)
                    try {
                        const { data } = await ProductAPI.getProductSearch(valueSearch, currentPage + 1, sort)
                        setLoading(false)
                        setProducts(data)
                    } catch (err) {
                        setLoading(false)
                        setProducts([])
                        alert.error(err.response.data.message)
                    }
                }
                fetchProductSearch()
            }, 500)

            return () => {
                clearTimeout(timeout)
            }
        } else {
            const fecthProducts = async () => {
                setLoading(true)
                try {
                    const { data } = await ProductAPI.getAllProducts(currentPage + 1, "", "", "", sort)
                    setLoading(false)
                    setProducts(data)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            fecthProducts()
        }

    }, [valueSearch, alert, isDelete, currentPage, sort])

    const deleteProductAdmin = async (id) => {
        setLoading(true)
        try {
            await ProductAPI.deleteProduct(id)
            setLoading(false)
            setIsDelete(!isDelete)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
    }

    const renderProducts = () => (
        products?.data?.products?.map((product) => (
            <tr className="row text-center" key={product._id}>
                <td className="col-3" style={{ whiteSpace: 'nowrap', textOverflow: "ellipsis", overflow: "hidden" }}>{product._id}</td>
                <td className="col-5">{product.name}</td>
                <td className="col-1">{formatPrice(product.price)}₫</td>
                <td className="col-1">{product.stock}</td>
                <td className="col-2">
                    <Link to={`/admin/products/${product.slugName}`} className="py-1 px-2">
                        <i className="fa fa-edit me-0" style={{ fontSize: "16px" }}></i>
                    </Link>
                    <Link to={{ pathname: `/admin/product/reviews/${product.slugName}`, state: { product: product } }} className="py-1 px-2">
                        <i className="fas fa-comments me-0" style={{ fontSize: "16px" }}></i>
                    </Link>
                    <button className="btn py-1 px-2" onClick={() => {
                        setIsModal(true)
                        setProductId(product._id)
                    }}>
                        <i className="fa fa-upload me-0" style={{ fontSize: "16px" }}></i>
                    </button>
                    <button className="btn py-1 px-2" onClick={() => deleteProductAdmin(product._id)}>
                        <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                    </button>
                </td>
            </tr>
        )
        )
    )

    const onChangeImages = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()

        reader.onload = () => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert.error("Định dạng file không đúng")

            if (reader.readyState === 2) {
                setImage(reader.result)
            }
        }

        reader.readAsDataURL(file)
    }

    const addUploadHandler = async (data) => {
        setLoadingUpload(true)
        try {
            await BannerAPI.uploadBanner(data)
            setImage("")
            setIsModal(false)
            setLoadingUpload(false)
        } catch (err) {
            setLoadingUpload(false)
            alert.error(err.response.data.message)
        }
    }

    return (
        <>
            <MetaData title={'Tất cả sản phẩm'} />
            {!loading ?
                <LayoutAdmin>
                    {
                        isModal ?
                            <Modal
                                loading={loadingUpload}
                                submitHandler={() => addUploadHandler({ banner: image, productId })}
                                width="30%"
                                onConfirm={() => {
                                    if (!loadingUpload) {
                                        setIsModal(false)
                                    }
                                }}
                                title="Cập nhật">
                                <h4>Thêm Banner</h4>
                                <div className='form-group'>
                                    <label>Hình ảnh (*jpg, *png)</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='product_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChangeImages}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Chọn hình ảnh
                                        </label>
                                    </div>

                                    {
                                        image && <img src={image} key={image} alt={`images-product ${image}`} className="mt-4 me-2" style={{ width: "80px", objectFit: "cover" }} />
                                    }

                                </div>
                            </Modal> :
                            ""}
                    <h1 className="my-4">Tất cả sản phẩm ({products?.productsCount})</h1>
                    <div className="d-flex justify-content-between align-items-start">
                        <div className='inputAdmin-search'>
                            <input
                                onChange={(e) => setValueSearch(e.target.value)}
                                placeholder='Tìm kiếm tên sản phẩm...'
                                value={valueSearch}
                                spellCheck={false}
                            />
                            <span className='input-highlight'>
                                {valueSearch.replace(/ /g, "\u00a0")}
                            </span>
                        </div>

                        <Link to="/admin/product/new" className="d-flex align-items-center py-2 px-3" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--white-color)', borderRadius: "3px" }}>
                            <i className="fas fa-plus-circle"></i>
                            Thêm
                        </Link>
                    </div>

                    <div className="text-end">
                        <SelectSort value={sort} handle={(e) => {
                            setSort(e.target.value)
                            setCurrentPage(0)
                        }}
                        />
                    </div>
                    <div className="table_admin mt-4">
                        {
                            products?.data?.products?.length === 0 ? <p>Không tìm thấy sản phẩm</p> :
                                <>
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr className="row text-center">
                                                <th className="col-3">ID</th>
                                                <th className="col-5">Tên</th>
                                                <th className="col-1">Giá</th>
                                                <th className="col-1">Số lượng</th>
                                                <th className="col-2"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {renderProducts()}
                                        </tbody>
                                    </table>

                                    {products?.productsCount > products?.resultPerPage && <Paginate resultPerPage={products?.resultPerPage} currentPage={currentPage} arr={products?.productsCount} setCurrentPageNo={setCurrentPageNo} />}
                                </>
                        }
                    </div>
                </LayoutAdmin> : <Loader />
            }
        </>
    )
};

export default ProductsAdmin;
