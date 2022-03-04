import React, { useEffect, useState } from 'react';

import { useAlert } from 'react-alert';

import { useDispatch, useSelector } from 'react-redux';


import { getCategories } from '../../../redux/actions/categoriesAction';

import { GET_CATEGORIES_SUCCESS } from '../../../redux/constants/categoriesConstant';

import { categoriesSelector } from '../../../redux/selectors/categoriesSelector';

import * as CategoriesAPI from "../../../api/categoriesAPI"

import MetaData from '../../../components/MetaData/MetaData';
import Loader from '../../../components/Loader/Loader';
import Modal from '../../../components/Modal/Modal';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';

const CategoriesList = () => {
    const { categories, error: errorCategories } = useSelector(categoriesSelector)

    const [loading, setLoading] = useState(false)

    const [isModalEdit, setIsModalEdit] = useState(false)
    const [isModalAdd, setIsModalAdd] = useState(false)

    const [categoryEdit, setCategoryEdit] = useState("")
    const [loadingEdit, setLoadingEdit] = useState(false)

    const [categoryAdd, setCategoryAdd] = useState("")
    const [loadingAdd, setLoadingAdd] = useState(false)

    const alert = useAlert()

    const dispatch = useDispatch()

    useEffect(() => {
        if (errorCategories) {
            alert.error(errorCategories)
        }
    }, [alert, errorCategories])


    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const { data } = await CategoriesAPI.getAllCategories()
                dispatch({ type: GET_CATEGORIES_SUCCESS, payload: data.data.categories })
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchCategories()

    }, [alert, dispatch])

    const updateCategoryHandler = async (id, data) => {
        setLoadingEdit(true)
        try {
            await CategoriesAPI.updateCategory(id, data)
            setLoadingEdit(false)
            setIsModalEdit(false)
            dispatch(getCategories())

        } catch (err) {
            setLoadingEdit(false)
            alert.error(err.response.data.message)
        }
    }


    const addCategoryHandler = async (data) => {
        setLoadingAdd(true)
        try {
            await CategoriesAPI.newCategory(data)
            setLoadingAdd(false)
            setCategoryAdd("")
            setIsModalAdd(false)
            dispatch(getCategories())

        } catch (err) {
            setLoadingAdd(false)
            alert.error(err.response.data.message)
        }
    }

    const renderAuthors = () => {
        return categories?.map((author) => {
            return (
                <tr className="row" key={author._id}>
                    <td className="col-4 py-4">{author._id}</td>
                    <td className="col-6 py-4">{author.name}</td>
                    <td className="col-2 py-4">
                        <button className="btn py-1 px-2" onClick={() => {
                            setIsModalEdit(true)
                            setCategoryEdit(author)
                        }}>
                            <i className="fa fa-edit me-0" style={{ fontSize: "16px" }}></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <MetaData title="Tất cả danh mục sản phẩm" />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        {
                            isModalEdit && <Modal loading={loadingEdit} submitHandler={() => updateCategoryHandler(categoryEdit._id, { name: categoryEdit.name })} width="30%" onConfirm={() => setIsModalEdit(false)} title="Cập nhật">
                                <h4>Cập nhật</h4>
                                <div className="form-group mt-4">
                                    <label htmlFor="nameAuthorEdit_field">Tên tác giả</label>
                                    <input
                                        type="text"
                                        name="nameAuthorEdit"
                                        id="nameAuthorEdit_field"
                                        className="form-control"
                                        value={categoryEdit.name}
                                        onChange={(e) => setCategoryEdit({ ...categoryEdit, name: e.target.value })}
                                    />
                                </div>
                            </Modal>
                        }

                        {
                            isModalAdd && <Modal loading={loadingAdd} submitHandler={() => addCategoryHandler({ name: categoryAdd })} width="30%" onConfirm={() => setIsModalAdd(false)} title="Thêm">
                                <h4>Thêm</h4>
                                <div className="form-group mt-4">
                                    <label htmlFor="nameAuthorAdd_field">Tên danh mục</label>
                                    <input
                                        type="text"
                                        name="nameAuthorAdd"
                                        id="nameAuthorAdd_field"
                                        className="form-control"
                                        value={categoryAdd}
                                        onChange={(e) => setCategoryAdd(e.target.value)}
                                    />
                                </div>
                            </Modal>
                        }

                        <h1 className="my-4">Tất cả danh mục sản phẩm ({categories.length})</h1>
                        <div className="d-flex justify-content-end">
                            <button onClick={() => setIsModalAdd(true)} className="d-flex align-items-center py-2 px-3 mb-4" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--white-color)', borderRadius: "3px", border: "none" }}>
                                <i className="fas fa-plus-circle"></i>
                                Thêm
                            </button>
                        </div>
                        <div className="table_admin">
                            {
                                categories.length === 0 ?
                                    <p>Không tìm thấy danh mục sản phẩm</p> :
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr className="row">
                                                <th className="col-4">ID</th>
                                                <th className="col-6">Tên danh mục</th>
                                                <th className="col-2"></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {renderAuthors()}
                                        </tbody>
                                    </table>
                            }
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
};

export default CategoriesList;
