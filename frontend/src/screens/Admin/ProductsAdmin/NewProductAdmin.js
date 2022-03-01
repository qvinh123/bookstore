import React, { useState } from 'react';

import MetaData from '../../../components/MetaData/MetaData';
import Button from '../../../components/Button/Button';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';

import Select from "react-select"

import { useAlert } from 'react-alert';
import { AsyncPaginate } from 'react-select-async-paginate';

import { useSelector } from 'react-redux';
import { categoriesSelector } from '../../../redux/selectors/categoriesSelector';

import * as CollectionBookAPI from "../../../api/seriesBookAPI"
import * as AuthorAPI from "../../../api/authorsAPI"
import * as ProductAPI from "../../../api/productAPI"

const listObject = [
    "Nhà trẻ - mẫu giáo (0 - 6)",
    "Nhi đồng (6 - 11)",
    "Thiếu niên (11 - 15)",
    "Tuổi mới lớn (15 - 18)",
    "Cha mẹ đọc cùng con"
]

const NewProductAdmin = () => {
    const alert = useAlert()

    const { categories } = useSelector(categoriesSelector)

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
        weight: "",
        format: "",
        collectionBook: ""
    })

    const [loading, setLoading] = useState(false)

    const [nameAddAuthor, setNameAddAuthor] = useState("")
    const [loadingAddAuthor, setLoadingAddAuthor] = useState(false)

    const [nameAddCollectionBook, setNameAddCollectionBook] = useState("")
    const [loadingAddCollectionBook, setLoadingAddCollectionBook] = useState(false)

    const [images, setImages] = useState([])

    const onChangeNormal = (e) => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const onChangeImages = (e) => {
        const files = Array.from(e.target.files)

        setImages([])

        files.forEach(img => {
            const reader = new FileReader()

            reader.onload = () => {
                if (img.type !== "image/png" && img.type !== "image/jpeg") {
                    return alert.error("Định dạng file ảnh không phù hợp.")
                }

                if (reader.readyState === 2) {
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(img)
        })
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData()

        formData.set("name", product.name)
        if (product.description) {
            formData.set("description", product.description)
        }
        formData.set("priceOriginal", product.priceOriginal)
        if (product.tag) {
            formData.set("price", ((100 - Number(product.tag)) / 100) * product.priceOriginal)
        } else {
            formData.set("price", product.priceOriginal)
        }
        if (product.tag) {
            formData.set("tag", product.tag)
        }
        product.authors.forEach(a => {
            formData.append("authors", a.value)
        })
        formData.set("category", product.category.value)
        product.objects.forEach(a => {
            formData.append("object", a.value)
        })
        if (product.numOfPage) {
            formData.set("numOfPage", product.numOfPage)
        }
        if (product.format) {
            formData.set("format", product.format)
        }
        if (product.weight) {
            formData.set("weight", product.weight)
        }
        if (product.framework) {
            formData.set("framework", product.framework)
        }
        if (product.stock) {
            formData.set("stock", product.stock)
        }
        images.forEach(image => {
            formData.append('images', image)
        })
        if (product.collectionBook) {
            formData.set("collectionBook", product.collectionBook.value)
        }

        setLoading(true)
        try {
            await ProductAPI.newProduct(formData)

            setProduct({
                ...product,
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
                weight: "",
                format: "",
                collectionBook: ""
            })
            setImages([])
            setLoading(false)
            alert.success("Thêm thành công")
        } catch (err) {
            setLoading(false)
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

    const fetchCollectionBook = async (searchQuery, loadedOptions, { page }) => {
        const arr = []
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


    const handleAddAuthor = async () => {
        setLoadingAddAuthor(true)
        try {
            await AuthorAPI.newAuthor({ name: nameAddAuthor })
            setNameAddAuthor("")
            setLoadingAddAuthor(false)
            alert.success("Thêm tác giả thành công")
        } catch (err) {
            setLoadingAddAuthor(false)
            alert.error(err.response.data.message)
        }
    }

    const handleAddCollectionBook = async () => {
        setLoadingAddCollectionBook(true)
        try {
            await CollectionBookAPI.newCollectionBook({ name: nameAddCollectionBook })
            setNameAddCollectionBook("")
            setLoadingAddCollectionBook(false)
            alert.success("Thêm bộ sách thành công")
        } catch (err) {
            setLoadingAddCollectionBook(false)
            alert.error(err.response.data.message)
        }
    }

    return (
        <LayoutAdmin>
            <MetaData title={'Thêm sản phẩm'} />

            <div className="row justify-content-between">
                <form className="col-7 shadow-lg p-md-4 p-lg-5" onSubmit={handleAddProduct}>
                    <h1 className="mb-4">Thêm sản phẩm</h1>
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
                            placeholder="Chọn danh mục sản phẩm"
                            onChange={option => setProduct(prev => (
                                {
                                    ...prev,
                                    category: option
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
                                    collectionBook: option
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

                        {images.length > 0 && images?.map(img => (
                            <img src={img} key={img} alt={`images-product ${img}`} className="mt-4 me-2" style={{ width: "80px", objectFit: "cover" }} />
                        ))}

                    </div>

                    <div className="text-end">
                        <Button width="25%" disabled={loading} loading={loading} >
                            Thêm
                        </Button>
                    </div>
                </form>

                <div className="col-lg-4 col-md-5">
                    <div className="form-group mb-5">
                        <label htmlFor="nameAddAuthor_field">Tên tác giả</label>
                        <input
                            type="text"
                            id="nameAddAuthor_field"
                            className="form-control mb-2"
                            name="nameAddAuthor"
                            value={nameAddAuthor}
                            onChange={(e) => setNameAddAuthor(e.target.value)}
                        />

                        <Button disabled={loadingAddAuthor} loading={loadingAddAuthor} width="100%" onClick={handleAddAuthor}>
                            Thêm tác giả
                        </Button>
                    </div>

                    <div className="form-group mb-5">
                        <label htmlFor="nameAddCollectionBook_field">Tên bộ sách</label>
                        <input
                            type="text"
                            id="nameAddCollectionBook_field"
                            className="form-control mb-2"
                            name="nameAddCollectionBook"
                            value={nameAddCollectionBook}
                            onChange={(e) => setNameAddCollectionBook(e.target.value)}
                        />

                        <Button disabled={loadingAddCollectionBook} loading={loadingAddCollectionBook} width="100%" onClick={handleAddCollectionBook}>
                            Thêm bộ sách
                        </Button>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
};

export default NewProductAdmin;