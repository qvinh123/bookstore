import React, { useEffect, useState } from 'react';

import { useAlert } from "react-alert"

import MetaData from '../../../components/MetaData/MetaData';
import Loader from '../../../components/Loader/Loader';
import Paginate from '../../../components/Paginate/Paginate';
import Modal from '../../../components/Modal/Modal';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Figure from '../../../components/Figure/Figure';
import SelectSort from '../../../components/SelectSort/SelectSort';

import * as AuthorAPI from "../../../api/authorsAPI"

import { usePagePagination } from '../../../hooks/usePagePagination';

const listSort = [
    {
        id: 2,
        name: "Tên A-Z",
        value: "name"
    },
    {
        id: 3,
        name: "Tên Z-A",
        value: "-name"
    },
]

const AuthorsList = () => {
    const [loading, setLoading] = useState(false)

    const [valueSearch, setValueSearch] = useState("")

    const [sort, setSort] = useState("name")

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    const [isChange, setIsChange] = useState(false)

    const [isModalEdit, setIsModalEdit] = useState(false)
    const [isModalAdd, setIsModalAdd] = useState(false)

    const [authorEdit, setAuthorEdit] = useState("")
    const [loadingAuthorEdit, setLoadingAuthorEdit] = useState(false)

    const [authorAdd, setAuthorAdd] = useState("")
    const [loadingAuthorAdd, setLoadingAuthorAdd] = useState(false)

    const [authors, setAuthors] = useState([])
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg")
    const [description, setDescription] = useState("")

    const alert = useAlert()

    useEffect(() => {
        if (authorEdit) {
            setAvatarPreview(authorEdit.avatar.url)
        }
    }, [authorEdit])

    useEffect(() => {
        setCurrentPage(0)
    }, [valueSearch, setCurrentPage])

    useEffect(() => {
        if (valueSearch) {
            const fetcAuthorSearch = async () => {
                setLoading(true)
                try {
                    const { data } = await AuthorAPI.searchAuthor(valueSearch, currentPage + 1, sort)
                    setAuthors(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            const timeout = setTimeout(() => {
                fetcAuthorSearch()
            }, 500)

            return () => clearTimeout(timeout)
        } else {
            const fetchAuthors = async () => {
                setLoading(true)
                try {
                    const { data } = await AuthorAPI.getAllAuthors(currentPage + 1, sort)
                    setAuthors(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            fetchAuthors()
        }
    }, [alert, valueSearch, currentPage, sort, isChange])

    const deleteAuthor = async (id) => {
        setLoading(true)
        try {
            await AuthorAPI.deleteAuthor(id)
            setIsChange(!isChange)
            setLoading(false)
        } catch (err) {
            alert.error(err.response.data.message)
            setLoading(false)
        }
    }

    const updateAuthorHandler = async (id, data) => {
        setLoadingAuthorEdit(true)
        try {
            await AuthorAPI.updateAuthor(id, data)
            setLoadingAuthorEdit(false)
            setIsModalEdit(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoadingAuthorEdit(false)
            alert.error(err.response.data.message)
        }
    }

    const onChangeImages = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()

        reader.onload = () => {
            if (file.type !== "image/png" && file.type !== "image/jpeg") {
                alert.error("Định dạng file ảnh không phù hợp.")

                return
            }

            if (reader.readyState === 2) {
                setAvatar(reader.result)
                setAvatarPreview(reader.result)
            }
        }

        reader.readAsDataURL(file)
    }


    const addAuthorHandler = async (data) => {
        setLoadingAuthorAdd(true)
        try {
            await AuthorAPI.newAuthor(data)
            setLoadingAuthorAdd(false)
            setAuthorAdd("")
            setIsModalAdd(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoadingAuthorAdd(false)
            alert.error(err.response.data.message)
        }
    }

    const renderAuthors = () => {
        return authors?.data?.authors?.map((author) => {
            return (
                <tr className="row" key={author._id}>
                    <td className="col-4 py-4">{author._id}</td>
                    <td className="col-2 py-4">
                        <img style={{ width: "100%", objectFit: "cover" }} src={author.avatar.url} alt={author.avatar.url} />
                    </td>
                    <td className="col-4 py-4">{author.name}</td>
                    <td className="col-2 py-4">
                        <button className="btn py-1 px-2" onClick={() => {
                            setIsModalEdit(true)
                            setAuthorEdit(author)
                        }}>
                            <i className="fa fa-edit me-0" style={{ fontSize: "16px" }}></i>
                        </button>
                        <button className="btn py-1 px-2" onClick={() => deleteAuthor(author._id)}>
                            <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                        </button>

                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <MetaData title="Tất cả tác giả - Admin" />

            {
                isModalEdit && <Modal
                    loading={loadingAuthorEdit}
                    submitHandler={() => updateAuthorHandler(authorEdit._id, { name: authorEdit.name, description: authorEdit.description, avatar: avatar })}
                    width="30%"
                    onConfirm={() => {
                        if (!loadingAuthorEdit) {
                            setIsModalEdit(false)
                        }
                    }}
                    title="Cập nhật">
                    <h4>Cập nhật</h4>
                    <div className="form-group mt-4">
                        <label htmlFor="nameAuthorEdit_field">Tên tác giả</label>
                        <input
                            type="text"
                            name="nameAuthorEdit"
                            id="nameAuthorEdit_field"
                            className="form-control"
                            value={authorEdit.name}
                            onChange={(e) => setAuthorEdit({ ...authorEdit, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description_field">Mô tả</label>
                        <textarea
                            className="form-control"
                            id="description_field"
                            rows="8"
                            name="description"
                            value={authorEdit.description}
                            onChange={(e) => { setAuthorEdit({ ...authorEdit, description: e.target.value }) }}
                        >
                        </textarea>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputImage'>Ảnh đại diện <span style={{ fontSize: '12px' }}>(không bắt buộc)</span></label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <Figure width="3rem" height="3rem" image={avatarPreview} />
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input form-control'
                                    id='inputImage'
                                    onChange={onChangeImages}
                                />
                                <label className='custom-file-label' htmlFor='inputImage'>
                                    Chọn ảnh
                                </label>
                            </div>
                        </div>
                    </div>
                </Modal>
            }

            {
                isModalAdd && <Modal
                    loading={loadingAuthorAdd}
                    submitHandler={() => addAuthorHandler({ name: authorAdd, description: description, avatar: avatar })}
                    width="30%"
                    onConfirm={() => {
                        if (!loadingAuthorAdd) {
                            setIsModalAdd(false)
                        }
                    }}
                    title="Thêm">
                    <h4>Thêm</h4>
                    <div className="form-group mt-4">
                        <label htmlFor="nameAuthorAdd_field">Tên tác giả</label>
                        <input
                            type="text"
                            name="nameAuthorAdd"
                            id="nameAuthorAdd_field"
                            className="form-control"
                            value={authorAdd}
                            onChange={(e) => setAuthorAdd(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description_field">Mô tả</label>
                        <textarea
                            className="form-control"
                            id="description_field"
                            rows="8"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputImage'>Ảnh đại diện <span style={{ fontSize: '12px' }}>(không bắt buộc)</span></label>
                        <div className='d-flex align-items-center'>
                            <div>
                                <Figure width="3rem" height="3rem" image={avatarPreview} />
                            </div>
                            <div className='custom-file'>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='custom-file-input form-control'
                                    id='inputImage'
                                    onChange={onChangeImages}
                                />
                                <label className='custom-file-label' htmlFor='inputImage'>
                                    Chọn ảnh
                                </label>
                            </div>
                        </div>
                    </div>
                </Modal>
            }

            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        <h1 className="my-4">Tất cả tác giả ({authors.authorsCount})</h1>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className='inputAdmin-search'>
                                <input
                                    onChange={(e) => setValueSearch(e.target.value)}
                                    placeholder='Tìm kiếm tên tác giả...'
                                    value={valueSearch}
                                    spellCheck={false}
                                />
                                <span className='input-highlight'>
                                    {valueSearch.replace(/ /g, "\u00a0")}
                                </span>
                            </div>

                            <div>
                                <button
                                    onClick={() => setIsModalAdd(true)}
                                    className="d-flex align-items-center py-2 px-3 mb-4"
                                    style={{ backgroundColor: 'var(--primary-color)', color: 'var(--white-color)', borderRadius: "3px", border: "none" }}>
                                    <i className="fas fa-plus-circle"></i>
                                    Thêm tác giả
                                </button>
                                <SelectSort
                                    value={sort}
                                    sorts={listSort}
                                    handle={(e) => {
                                        setSort(e.target.value)
                                        setCurrentPage(0)
                                    }} />
                            </div>
                        </div>
                        <div className="table_admin">
                            {
                                authors?.data?.authors?.length === 0 ?
                                    <p>Không tìm thấy người dùng</p> :
                                    <>
                                        <table className="table table-striped table-hover text-center">
                                            <thead>
                                                <tr className="row">
                                                    <th className="col-4">ID</th>
                                                    <th className="col-2">Hình ảnh</th>
                                                    <th className="col-4">Tên tác giả</th>
                                                    <th className="col-2"></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {renderAuthors()}
                                            </tbody>
                                        </table>

                                        {
                                            authors.authorsCount > authors.resultPerPage && <Paginate resultPerPage={authors.resultPerPage} currentPage={currentPage} arr={authors.authorsCount} setCurrentPageNo={setCurrentPageNo} />
                                        }
                                    </>
                            }
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
}

export default AuthorsList;
