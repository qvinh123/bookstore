import React, { useEffect, useState } from 'react'

import { Link } from "react-router-dom"
import { useHistory } from "react-router"

import { useDispatch, useSelector } from "react-redux"
import { clearErrorUser, registerUser } from '../../redux/actions/authAction'
import { authSelector } from '../../redux/selectors/authSelector'

import { useAlert } from 'react-alert'

import { useFormik } from "formik"
import * as yup from "yup"

import ErrorMessage from "../../components/ErrorMessage/ErrorMessage"
import Figure from '../../components/Figure/Figure'
import Layout from '../../components/layout/Layout'
import MetaData from '../../components/MetaData/MetaData'

const Register = () => {
    const { loading, isAuthenticated, error } = useSelector(authSelector)

    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()

    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg")

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Tên tài khoản không được để trống")
            .max(30, "Tên tài khoản phải có dưới 30 ký tự"),
        password: yup.string()
            .required("Mật khẩu không được để trống")
            .min(8, "Mật khẩu ít nhất 8 ký tự"),
        email: yup.string()
            .email("Địa chỉ email không hợp lệ")
            .required("Email không được để trống"),
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
            email: ""
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData()

            formData.set("name", values.name)
            formData.set("password", values.password)
            formData.set("email", values.email)
            formData.set("avatar", avatar)

            const object = {};

            formData.forEach((value, key) => object[key] = value)
            const json = object

            dispatch(registerUser(json))
        }
    })

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrorUser())
        }

        if (isAuthenticated) {
            history.push("/")
        }

    }, [alert, error, isAuthenticated, history, dispatch])

    const onChangeUser = e => {
        const reader = new FileReader()
        const file = e.target.files[0]

        reader.onload = () => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert.error("Định dạng file không đúng")

            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }
        reader.readAsDataURL(file)
    }

    return (
        <>
            <MetaData title="Đăng kí" />
            <Layout>
                <div className="wrapper">
                    <div className="form-main">
                        <div className="user-form">
                            <h1>Đăng kí</h1>
                            <h3>Chúng ta đánh mất chính mình trong sách, chúng ta cũng tìm thấy chính mình ở đó</h3>
                            <form onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                                <div className="form-group">
                                    <label htmlFor="inputName">Tên tài khoản</label>
                                    <input {...formik.getFieldProps('name')} type="name" className="form-control" id="inputName" placeholder="Name" />
                                    <ErrorMessage touched={formik.touched.name} errorValue={formik.errors.name} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputEmail">Email</label>
                                    <input {...formik.getFieldProps('email')} type="email" className="form-control" id="inputEmail" placeholder="Email" />
                                    <ErrorMessage touched={formik.touched.email} errorValue={formik.errors.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="inputPassword">Mật khẩu</label>
                                    <input {...formik.getFieldProps('password')} type="password" className="form-control" id="inputPassword" placeholder="Mật khẩu" />
                                    <ErrorMessage touched={formik.touched.password} errorValue={formik.errors.password} />
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
                                                onChange={onChangeUser}
                                            />
                                            <label className='custom-file-label' htmlFor='inputImage'>
                                                Chọn ảnh
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button disabled={loading ? true : false} type="submit" className="btn">
                                    {loading ? <div className="spinner-border spinner-border-sm text-white"></div> : "Đăng kí"}
                                </button>
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
                                <h3>Nơi những cuốn sách là người bạn đồng hành tốt nhất</h3>
                                <Link to="/account/login" className="btn">Đăng nhập</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Register
