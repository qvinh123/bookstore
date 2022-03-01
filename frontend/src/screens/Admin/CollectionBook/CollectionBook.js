import React, { useState, useEffect } from 'react';

import { useAlert } from 'react-alert';

import { usePagePagination } from '../../../hooks/usePagePagination';

import * as CollectionBookAPI from "../../../api/seriesBookAPI"

import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import MetaData from '../../../components/MetaData/MetaData';
import Modal from '../../../components/Modal/Modal';
import Paginate from '../../../components/Paginate/Paginate';
import Loader from '../../../components/Loader/Loader';
import SelectSort from '../../../components/SelectSort/SelectSort';

const listSort = [
    {
        id: 1,
        name: "Tên A-Z",
        value: "name"
    },
    {
        id: 2,
        name: "Tên Z-A",
        value: "-name"
    },
]

const CollectionBook = () => {
    const [loading, setLoading] = useState(false)

    const [valueSearch, setValueSearch] = useState("")

    const [sort, setSort] = useState("name")

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    const [isChange, setIsChange] = useState(false)

    const [isModalEdit, setIsModalEdit] = useState(false)
    const [isModalAdd, setIsModalAdd] = useState(false)

    const [collectionBookEdit, setCollectionBookEdit] = useState("")
    const [loadingCollectionEdit, setLoadingCollectionEdit] = useState(false)

    const [collectionBookAdd, setCollectionBookAdd] = useState("")
    const [loadingCollectionAdd, setLoadingCollectionAdd] = useState(false)

    const alert = useAlert()

    const [collectionBook, setCollectionBook] = useState([])

    useEffect(() => {
        setCurrentPage(0)
    }, [valueSearch, setCurrentPage])

    useEffect(() => {
        if (valueSearch) {
            const fetchCollectionBooksSearch = async () => {
                setLoading(true)
                try {
                    const { data } = await CollectionBookAPI.searchCollectionBook(valueSearch, currentPage + 1, sort)
                    setCollectionBook(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            const timeout = setTimeout(() => {
                fetchCollectionBooksSearch()
            }, 500)

            return () => clearTimeout(timeout)
        } else {
            const fetchCollectionBooks = async () => {
                setLoading(true)
                try {
                    const { data } = await CollectionBookAPI.getAllCollectionBook(currentPage + 1, sort)
                    setCollectionBook(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            fetchCollectionBooks()
        }
    }, [alert, valueSearch, currentPage, sort, isChange])

    const deleteAuthor = async (id) => {
        setLoading(true)
        try {
            await CollectionBookAPI.deleteCollectionBook(id)
            setLoading(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
    }

    const updateAuthorHandler = async (id, data) => {
        setLoadingCollectionEdit(true)
        try {
            await CollectionBookAPI.updateCollectionBook(id, data)
            setLoadingCollectionEdit(false)
            setIsModalEdit(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoadingCollectionEdit(false)
            alert.error(err.response.data.message)
        }
    }

    const addAuthorHandler = async (data) => {
        setLoadingCollectionAdd(true)
        try {
            await CollectionBookAPI.newCollectionBook(data)
            setLoadingCollectionAdd(false)
            setIsModalAdd(false)
            setIsChange(!isChange)
        } catch (err) {
            setLoadingCollectionAdd(false)
            alert.error(err.response.data.message)
        }
    }

    const renderAuthors = () => {
        return collectionBook?.data?.collectionBook?.map((c) => {
            return (
                <tr className="row" key={c._id}>
                    <td className="col-4 py-4">{c._id}</td>
                    <td className="col-6 py-4">{c.name}</td>
                    <td className="col-2 py-4">
                        <button className="btn py-1 px-2" onClick={() => {
                            setIsModalEdit(true)
                            setCollectionBookEdit(c)
                        }}>
                            <i className="fa fa-edit me-0" style={{ fontSize: "16px" }}></i>
                        </button>
                        <button className="btn py-1 px-2" onClick={() => deleteAuthor(c._id)}>
                            <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                        </button>

                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <MetaData title="Tất cả bộ sách - Admin" />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        {
                            isModalEdit && <Modal
                                loading={loadingCollectionEdit}
                                submitHandler={() => updateAuthorHandler(collectionBookEdit._id, { name: collectionBookEdit.name })}
                                width="30%"
                                onConfirm={() => setIsModalEdit(false)}
                                title="Cập nhật">
                                <h4>Cập nhật</h4>
                                <div className="form-group mt-4">
                                    <label htmlFor="nameAuthorEdit_field">Tên bộ sách</label>
                                    <input
                                        type="text"
                                        name="nameAuthorEdit"
                                        id="nameAuthorEdit_field"
                                        className="form-control"
                                        value={collectionBookEdit.name}
                                        onChange={(e) => setCollectionBookEdit({ ...collectionBookEdit, name: e.target.value })}
                                    />
                                </div>
                            </Modal>
                        }

                        {
                            isModalAdd && <Modal
                                loading={loadingCollectionAdd}
                                submitHandler={() => addAuthorHandler({ name: collectionBookAdd })}
                                width="30%"
                                onConfirm={() => setIsModalAdd(false)}
                                title="Thêm">
                                <h4>Thêm</h4>
                                <div className="form-group mt-4">
                                    <label htmlFor="nameAuthorAdd_field">Tên bộ sách</label>
                                    <input
                                        type="text"
                                        name="nameAuthorAdd"
                                        id="nameAuthorAdd_field"
                                        className="form-control"
                                        value={collectionBookAdd}
                                        onChange={(e) => setCollectionBookAdd(e.target.value)}
                                    />
                                </div>
                            </Modal>
                        }

                        <h1 className="my-4">Tất cả bộ sách ({collectionBook.collectionBookCount})</h1>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className='inputAdmin-search'>
                                <input
                                    onChange={(e) => setValueSearch(e.target.value)}
                                    placeholder='Tìm kiếm tên bộ sách...'
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
                                    Thêm
                                </button>
                                <SelectSort value={sort} sorts={listSort} handle={(e) => {
                                    setSort(e.target.value)
                                    setCurrentPage(0)
                                }} />
                            </div>
                        </div>
                        <div className="table_admin">
                            {
                                collectionBook?.data?.collectionBook?.length === 0 ?
                                    <p>Không tìm thấy người dùng</p> :
                                    <>
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr className="row">
                                                    <th className="col-4">ID</th>
                                                    <th className="col-6">Tên bộ sách</th>
                                                    <th className="col-2"></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {renderAuthors()}
                                            </tbody>
                                        </table>

                                        {collectionBook.collectionBookCount > collectionBook.resultPerPage && <Paginate resultPerPage={collectionBook.resultPerPage} currentPage={currentPage} arr={collectionBook.collectionBookCount} setCurrentPageNo={setCurrentPageNo} />}
                                    </>
                            }
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
};

export default CollectionBook;
