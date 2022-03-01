import React, { useEffect, useState } from 'react'

import ListProductsSub from '../ListProductsSub/ListProductsSub'
import LoaderSmall from "../LoaderSmall/LoaderSmall"

import { Link, useHistory, useLocation } from 'react-router-dom'

import * as ProductAPI from '../../api/productAPI'

import { useAlert } from 'react-alert'


const Search = ({ display }) => {
    const history = useHistory()
    const { pathname } = useLocation()
    const alert = useAlert()

    const [value, setValue] = useState("")

    const onChange = (e) => {
        setValue(e.target.value)
    }

    const [produtsSearch, setProductsSearch] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState()

    const handlerSubmit = (e) => {
        e.preventDefault()

        if (value) {
            history.push(`/search/${value}`)
        }
    }

    useEffect(() => {
        setValue("")
    }, [pathname])

    useEffect(() => {
        if (error) {
            alert.error(error)
            setError("")
        }
    }, [alert, error])

    useEffect(() => {
        if (value === "") {
            setLoading(undefined)
            setProductsSearch([])
        }
    }, [value, loading])


    let resultSearch

    if (loading) {
        resultSearch = <div className="py-5"> <LoaderSmall /></div>
    }
    if (loading === false) {
        if (value && error) {
            resultSearch = <p className="mb-0 p-4">{error}</p>
        }
        if (value && produtsSearch?.length > 0) {
            resultSearch = <>
                <div className="p-3 pb-0 mb-0">
                    <h5>Sản phẩm: {produtsSearch?.length}</h5>
                    <Link to={`/search/${value}`} onClick={() => {
                        setValue("")
                    }}>
                        Xem thêm
                    </Link>
                </div>
                <div className="p-lg-3">
                    <ListProductsSub products={produtsSearch} />
                </div>
            </>
        }

        if (value && produtsSearch?.length === 0) {
            resultSearch = <p className="mb-0 p-4">No Found Search</p>
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {

            if (value) {
                const fetchProductSearch = async () => {
                    setLoading(true)
                    try {
                        const { data } = await ProductAPI.getProductSearch(value)
                        setProductsSearch(data.data.products)
                        setLoading(false)
                    } catch (err) {
                        setError(err.response.data.message)
                        setProductsSearch([])
                        setLoading(false)
                    }
                }
                fetchProductSearch()
            }
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [value])

    return (
        <form onSubmit={handlerSubmit} className={`header_search ${display ? display : ""}`}>
            <div className="input-group">
                <input value={value} onChange={onChange} className="form-control" type="text" placeholder="Tìm kiếm..." />
                <button type="button" className="btn" onClick={handlerSubmit}>
                    <i className="fas fa-search"></i>
                </button>
                <div className="listProductSearch">
                    {resultSearch}
                </div>
            </div>
        </form>
    )
}

export default Search
