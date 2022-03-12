import React, { useEffect } from 'react'

import { Link } from "react-router-dom"
import { useHistory } from "react-router"

import { useDispatch, useSelector } from "react-redux"
import { clearErrorUser, loginUser } from '../../redux/actions/authAction'
import { authSelector } from '../../redux/selectors/authSelector'

import { useAlert } from 'react-alert'

import { useFormik } from "formik"
import * as yup from "yup"

import ErrorMessage from "../../components/ErrorMessage/ErrorMessage"

import Layout from '../../components/layout/Layout'
import MetaData from '../../components/MetaData/MetaData'

const Login = () => {
    const { loading, isAuthenticated, error } = useSelector(authSelector)

    const dispatch = useDispatch()
    const alert = useAlert()
    const history = useHistory()

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Địa chỉ email không hợp lệ")
            .required("Email không được để trống"),
        password: yup
            .string()
            .required("Mật khẩu không được bỏ trống")
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(loginUser(values))
        }
    })

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrorUser())
            formik.setFieldValue("password", "")
        }

        if (isAuthenticated) {
            history.goBack()
        }

    }, [alert, error, isAuthenticated, history, dispatch, formik])

    return (
        <>
            <MetaData title="Đăng nhập" />
            <Layout>
                <div className="wrapper">
                    <div className="form-main">
                        <div className="user-form">
                            <h1>Đăng nhập</h1>
                            <h3>Bạn không bao giờ cô đơn khi bạn đang đọc một cuốn sách</h3>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" name="email" {...formik.getFieldProps('email')} type="email" className="form-control" placeholder="Email" />
                                    <ErrorMessage touched={formik.touched.email} errorValue={formik.errors.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input name="password" id="password" {...formik.getFieldProps('password')} type="password" className="form-control" placeholder="Mật khẩu" />
                                    <ErrorMessage touched={formik.touched.password} errorValue={formik.errors.password} />
                                </div>
                                <button disabled={loading ? true : false} type="submit" className="btn">
                                    {loading ? <div className="spinner-border spinner-border-sm text-white"></div> : "Đăng nhập"}
                                </button>
                                <Link to="/password/forget" className="float-end mt-3">Quên mật khẩu?</Link>
                                <Link to="/account/register" className="float-start mt-3">Đăng kí</Link>
                            </form>
                        </div>

                        <div className="d-none d-lg-block">
                            <svg width="67px" height="578px" viewBox="0 0 67 578" version="1.1"
                                xmlns="http://www.w3.org/2000/svg">
                                <title>Path</title>
                                <desc>Created with Sketch.</desc>
                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <path d="M11.3847656,-5.68434189e-14 C-7.44726562,36.7213542 5.14322917,126.757812 49.15625,270.109375 C70.9827986,341.199016 54.8877465,443.829224 0.87109375,578 L67,578 L67,-5.68434189e-14 L11.3847656,-5.68434189e-14 Z" id="Path" fill="#d51c24"></path>
                                </g>
                            </svg>
                        </div>
                        <div className="form-welcome d-none d-lg-block">
                            <div className="sec-content">
                                <h2>VbOOKS</h2>
                                <h3>Tận hưởng một thế giới mới bên trong một cuốn sách</h3>
                                <Link to="/account/register" className="btn">Đăng kí</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Login
