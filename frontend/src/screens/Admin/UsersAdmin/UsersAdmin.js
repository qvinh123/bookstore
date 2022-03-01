import React, { useEffect, useState } from 'react';

import { useAlert } from 'react-alert';

import { usePagePagination } from '../../../hooks/usePagePagination';

import MetaData from '../../../components/MetaData/MetaData';
import LayoutAdmin from '../../../components/layout/LayoutAdmin';
import Loader from '../../../components/Loader/Loader';
import Paginate from '../../../components/Paginate/Paginate';
import SelectSort from '../../../components/SelectSort/SelectSort';

import * as UserAPI from "../../../api/userAPI"

const listSort = [
    {
        id: 1,
        name: "Mới nhất",
        value: "-createdAt"
    },
    {
        id: 2,
        name: "Cũ nhất",
        value: "createdAt"
    }
]

const roles = [
    {
        id: 1,
        value: "admin"
    },
    {
        id: 2,
        value: "user"
    }
]

const UsersAdmin = () => {
    const alert = useAlert()

    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])

    const [isDelete, setIsDelete] = useState(false)

    const [isUpdate, setIsUpdate] = useState(false)

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    const [valueSearch, setValueSearch] = useState("")
    const [sort, setSort] = useState("-createdAt")

    useEffect(() => {
        setCurrentPage(0)
    }, [valueSearch, setCurrentPage])

    useEffect(() => {
        if (valueSearch) {
            const fetchUserSearch = async () => {
                setLoading(true)
                try {
                    const { data } = await UserAPI.searchUser(valueSearch, currentPage + 1, sort)
                    setUsers(data)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            const timeout = setTimeout(() => {
                fetchUserSearch()
            }, 500)

            return () => clearTimeout(timeout)
        } else {
            const fetchUsers = async () => {
                setLoading(true)
                try {
                    const { data } = await UserAPI.getAllUsers(currentPage + 1, sort)
                    setLoading(false)
                    setUsers(data)
                } catch (err) {
                    setLoading(false)
                    alert.error(err.response.data.message)
                }
            }
            fetchUsers()
        }
    }, [alert, valueSearch, currentPage, isDelete, sort, isUpdate])

    const handlerDeleteUser = async (id) => {
        setLoading(true)
        try {
            await UserAPI.deleteUser(id)
            setLoading(false)
            alert.success("Xoá thành công")
            setIsDelete(!isDelete)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
    }

    const handlerUpdateUser = async (e, id) => {
        try {
            await UserAPI.updateUser(id, { role: e.target.value })
            alert.success("Cập nhật thành công")
            setIsUpdate(!isUpdate)
        } catch (err) {
            alert.error(err.response.data.message)
        }
    }

    const renderUsers = () => {
        return users?.data?.users?.map((user) => {
            return (
                <tr className="row" key={user._id}>
                    <td className="col-3 py-4">{user._id}</td>
                    <td className="col-3 py-4">{user.name}</td>
                    <td className="col-3 py-4">{user.email}</td>
                    <td className="col-2 py-4">
                        <select
                            className="form-select me-4"
                            name='role'
                            onChange={(e) => {
                                handlerUpdateUser(e, user._id)
                            }}
                        >
                            <option>{user.role}</option>
                            {
                                roles.filter(item => item.value !== user.role).map((item, i) => (
                                    <option key={i} value={item.value}>{item.value}</option>
                                ))
                            }
                        </select>
                    </td>
                    <td className="col-1 py-4 text-end">
                                <button className="btn py-1 px-2" onClick={() => { handlerDeleteUser(user._id) }}>
                                    <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                                </button>
                    </td>
                </tr>
            )
        })
    }

    return (
        <>
            <MetaData title="Tất cả người dùng - Admin" />
            {
                loading ? <Loader /> :
                    <LayoutAdmin>

                        <h1 className="my-4">Tất cả người dùng ({users.usersCount})</h1>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className='inputAdmin-search'>
                                <input
                                    onChange={(e) => setValueSearch(e.target.value)}
                                    placeholder='Tìm kiếm tên hoặc email người dùng...'
                                    value={valueSearch}
                                    spellCheck={false}
                                />
                                <span className='input-highlight'>
                                    {valueSearch.replace(/ /g, "\u00a0")}
                                </span>
                            </div>

                            <div className="col-md-6 col-12 text-lg-end">
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
                                users?.data?.users?.length === 0 ? <p>Không tìm thấy người dùng</p> :
                                    <>
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr className="row">
                                                    <th className="col-3">ID</th>
                                                    <th className="col-3">Tên người dùng</th>
                                                    <th className="col-3">Email</th>
                                                    <th className="col-2">Vai trò</th>
                                                    <th className="col-1"></th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {renderUsers()}
                                            </tbody>
                                        </table>

                                        {users.usersCount > users.resultPerPage && <Paginate resultPerPage={users.resultPerPage} currentPage={currentPage} arr={users.usersCount} setCurrentPageNo={setCurrentPageNo} />}
                                    </>
                            }
                        </div>
                    </LayoutAdmin>
            }
        </>
    )
};

export default UsersAdmin;
