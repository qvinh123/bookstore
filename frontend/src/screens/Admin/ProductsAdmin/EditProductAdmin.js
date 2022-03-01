import React, { useEffect, useState } from 'react';

import { useAlert } from 'react-alert';

import { useHistory, useParams } from 'react-router-dom';

import MetaData from '../../../components/MetaData/MetaData';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Button/Button';

import * as ProductAPI from "../../../api/productAPI"
import * as AuthorAPI from "../../../api/authorsAPI"
import * as CollectionBookAPI from "../../../api/seriesBookAPI"

import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';

import { useSelector } from 'react-redux';
import { categoriesSelector } from '../../../redux/selectors/categoriesSelector';
import { userSelector } from '../../../redux/selectors/userSelector';

const listObject = [
    "Nhà trẻ - mẫu giáo (0 - 6)",
    "Nhi đồng (6 - 11)",
    "Thiếu niên (11 - 15)",
    "Tuổi mới lớn (15 - 18)",
    "Cha mẹ đọc cùng con"
]


const EditProductAdmin = () => {
    const { id } = useParams()
    const history = useHistory()

    const alert = useAlert()

    const { user } = useSelector(userSelector)

    const [loading, setLoading] = useState(false)

    const [isChange, setIsChange] = useState(false)

    const [product, setProduct] = useState({
        name: "",
        priceOriginal: "",
        description: "",
        category: "",
        stock: "",
        tag: "",
        framework: "",
        numOfPage: "",
        authors: [],
        objects: [],
        images: [],
        weight: "",
        format: "",
        collectionBook: ""
    })

    const [imagesNew, setImageNew] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])

    const { categories } = useSelector(categoriesSelector)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const { data } = await ProductAPI.getDetailsProduct(id)

                setProduct({
                    name: data.product.name,
                    priceOriginal: data.product.priceOriginal,
                    description: data.product.description ? data.product.description : "",
                    stock: data.product.stock ? data.product.stock : "",
                    category: [data.product.category].map(item => ({
                        label: item.name,
                        value: item._id
                    })),
                    tag: data.product.tag || 0,
                    authors: data.product.authors ? data.product.authors.map(item => ({
                        label: item.name,
                        value: item._id
                    })) : "",
                    objects: data.product.object ? data.product.object.map(item => ({
                        label: item,
                        value: item
                    })) : "",
                    numOfPage: data.product.numOfPage ? data.product.numOfPage : "",
                    weight: data.product.weight ? data.product.weight : "",
                    framework: data.product.framework ? data.product.framework : "",
                    collectionBook: data.product.collectionBook ? [data.product.collectionBook].map(item => ({
                        label: item.name,
                        value: item._id
                    })) : "",
                    images: data.product.images,
                    format: data.product.format ? data.product.format : ""
                })
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
                history.push("/admin/products")
            }
        }

        if (id) {
            fetchProduct()
        }

    }, [alert, id, isChange, history])

    const fetchCollectionBook = async (searchQuery, loadedOptions, { page }) => {
        const arr = [
            {
                label: "Để trống",
                value: "",
            }
        ]
        let filteredOptions
        try {
            if (!searchQuery) {
                const { data } = await CollectionBookAPI.getAllCollectionBook(page, "name")
                data.data.collectionBook.forEach(item => {
                    arr.push({
                        label: item.name,
                        value: item._id,
                    })
                })
            } else {
                const { data } = await CollectionBookAPI.searchCollectionBook(searchQuery, page, "name")
                data.data.collectionBook.forEach(item => {
                    arr.push({
                        label: item.name,
                        value: item._id,
                    })
                })
            }

            filteredOptions = arr

            return {
                options: filteredOptions,
                hasMore: filteredOptions.length >= 1,
                additional: {
                    page: page + 1
                }
            }
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const fetchAuthors = async (searchQuery, loadedOptions, { page }) => {
        const arr = []
        let filteredOptions
        try {
            if (!searchQuery) {
                const { data } = await AuthorAPI.getAllAuthors(page, "name")
                data.data.authors.forEach(item => {
                    arr.push({
                        label: item.name,
                        value: item._id,
                    })
                })
            } else {
                const { data } = await AuthorAPI.searchAuthor(searchQuery, page, "name")
                data.data.authors.forEach(item => {
                    arr.push({
                        label: item.name,
                        value: item._id,
                    })
                })
            }

            filteredOptions = arr

            return {
                options: filteredOptions,
                hasMore: filteredOptions.length >= 1,
                additional: {
                    page: page + 1
                }
            }
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const onChangeImages = (e) => {
        const files = Array.from(e.target.files)

        setProduct({ ...product, images: [] })
        setImageNew([])
        setImagesPreview([])

        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImageNew(oldArray => [...oldArray, reader.result])
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const onChangeNormal = (e) => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleUpdateProduct = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.set("name", product.name)
        formData.set("description", product.description)
        formData.set("priceOriginal", product.priceOriginal)
        if (product.tag) {
            formData.set("price", ((100 - Number(product.tag)) / 100) * product.priceOriginal)
        } else {
            formData.set("price", product.priceOriginal)
        }
        formData.set("tag", Number(product.tag))
        if (product.authors.length > 0) {
            product.authors.forEach(a => {
                formData.append("authors", a.value)
            })
        } else {
            formData.append("authors", "")
        }
        formData.set("category", product.category[0].value)

        if (product.objects.length > 0) {
            product.objects.forEach(a => {
                formData.append("object", a.value)
            })
        } else {
            formData.append("object", "")
        }

        formData.set("numOfPage", Number(product.numOfPage))
        formData.set("format", product.format)
        formData.set("weight", Number(product.weight))
        formData.set("framework", product.framework)
        formData.set("stock", Number(product.stock))
        formData.set("user", user._id)
        imagesNew.forEach(image => {
            formData.append('images', image)
        })

        if (product.collectionBook) {
            formData.set("collectionBook", product.collectionBook[0].value)
        }

        setLoading(true)
        try {
            await ProductAPI.updateProductDetail(id, formData)
            setLoading(false)
            alert.success("Cập nhật thành công")
            setIsChange(!isChange)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
    }

    return (
        <>
            <MetaData title={'Chỉnh sửa sản phẩm'} />
            {loading ? <Loader /> :
                <LayoutAdmin>
                    <div className="wrapper">
                        <div className="row justify-content-center">
                            <form className="col-7 shadow-lg p-5" onSubmit={handleUpdateProduct} encType='multipart/form-data'>
                                <h1 className="mb-4">Sửa sản phẩm</h1>
                                <div className="form-group">
                                    <label htmlFor="name_field">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        name="name"
                                        className="form-control"
                                        value={product.name}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="priceOriginal_field">Giá gốc (VNĐ)</label>
                                    <input
                                        type="number"
                                        name="priceOriginal"
                                        id="priceOriginal_field"
                                        className="form-control"
                                        value={product.priceOriginal}
                                        onChange={onChangeNormal}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="description_field">Mô tả</label>
                                    <textarea
                                        className="form-control"
                                        id="description_field"
                                        rows="10"
                                        name="description"
                                        value={product.description}
                                        onChange={onChangeNormal}
                                    >
                                    </textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Danh mục sản phẩm</label>
                                    <Select
                                        id="category_field"
                                        name="category"
                                        value={product.category}
                                        onChange={option => setProduct(prev => (
                                            {
                                                ...prev,
                                                category: [option]
                                            }
                                        ))}
                                        options={categories?.map(category => (
                                            {
                                                label: category.name,
                                                value: category._id
                                            }
                                        ))}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="stock_field">Số lượng sản phẩm (quyển)</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        name="stock"
                                        className="form-control"
                                        value={product.stock}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tag_field">Thẻ giảm giá (%)</label>
                                    <input
                                        type="number"
                                        id="tag_field"
                                        name="tag"
                                        className="form-control"
                                        value={product.tag}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="authors_field">Tác giả</label>
                                    <AsyncPaginate
                                        value={product.authors}
                                        loadOptions={fetchAuthors}
                                        closeMenuOnSelect={true}
                                        onChange={option => setProduct(prev => (
                                            {
                                                ...prev,
                                                authors: option
                                            }
                                        ))}
                                        isMulti
                                        isSearchable={true}
                                        placeholder="Chọn tên tác giả"
                                        additional={{
                                            page: 1
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="object_field">Đối tượng phù hợp</label>
                                    <Select
                                        id="object_field"
                                        name="objects"
                                        value={product.objects}
                                        options={listObject?.map(item => ({
                                            label: item,
                                            value: item
                                        }))}
                                        onChange={option => setProduct(prev => (
                                            {
                                                ...prev,
                                                objects: option
                                            }
                                        ))}
                                        isMulti
                                        placeholder="Chọn đối tượng phù hợp"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="numOfPage_field">Tổng số trang (trang)</label>
                                    <input
                                        type="number"
                                        id="numOfPage_field"
                                        name="numOfPage"
                                        className="form-control"
                                        value={product.numOfPage}
                                        onChange={onChangeNormal}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="weight_field">Trọng lượng sách (gram)</label>
                                    <input
                                        type="number"
                                        id="weight_field"
                                        name="weight"
                                        className="form-control"
                                        value={product.weight}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="framework_field">Khổ sách(cm)</label>
                                    <input
                                        type="text"
                                        id="framework_field"
                                        className="form-control"
                                        name="framework"
                                        value={product.framework}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="format_field">Định dạng bìa sách</label>
                                    <input
                                        type="text"
                                        id="format_field"
                                        className="form-control"
                                        name="format"
                                        value={product.format}
                                        onChange={onChangeNormal}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="collectionBook_field">Bộ sách</label>
                                    <AsyncPaginate
                                        value={product.collectionBook}
                                        loadOptions={fetchCollectionBook}
                                        closeMenuOnSelect={true}
                                        onChange={option => setProduct(prev => (
                                            {
                                                ...prev,
                                                collectionBook: [option]
                                            }
                                        ))}
                                        isSearchable={true}
                                        placeholder="Chọn bộ sưu tập sách"
                                        additional={{
                                            page: 1
                                        }}
                                    />
                                </div>

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
                                        product.images?.map(img => (
                                            <img src={img.url} key={img._id} alt={`images-product ${img._id}`} className="mt-4 me-2" style={{ width: "80px", objectFit: "cover" }} />
                                        ))
                                    }

                                    {
                                        imagesPreview?.length > 0 && imagesPreview?.map((img, i) => (
                                            <img src={img} key={img} alt={`images-preview ${i}`} className="mt-4 me-2" style={{ width: "80px", objectFit: "cover" }} />
                                        ))
                                    }

                                </div>

                                <div className="text-end">
                                    <Button width="25%">
                                        Cập nhật
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </LayoutAdmin>
            }
        </>
    )
};

export default EditProductAdmin;
