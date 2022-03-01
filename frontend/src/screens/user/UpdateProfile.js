import React, { useEffect, useState } from 'react'

import { useAlert } from 'react-alert'

import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from '../../redux/actions/userAction'
import { userSelector } from '../../redux/selectors/userSelector'

import { useHistory } from 'react-router'

import Button from '../../components/Button/Button'
import Figure from '../../components/Figure/Figure'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import Loader from '../../components/Loader/Loader'
import MetaData from '../../components/MetaData/MetaData'
import Layout from '../../components/layout/Layout'

import * as UserAPI from "../../api/userAPI"

import { useFormik } from "formik"
import * as yup from "yup"


const UpdateProfile = () => {
    const { user } = useSelector(userSelector)

    const alert = useAlert()
    const dispatch = useDispatch()
    const history = useHistory()

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Tên tài khoản không được để trống")
            .max(30, "Tên tài khoản phải có dưới 30 ký tự"),
        email: yup.string()
            .email("Địa chỉ email không hợp lệ")
            .required("Email không được để trống"),
    })

    const formik = useFormik({
        initialValues: {
            name: user?.name,
            email: user?.email
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            formData.set("name", values.name)
            formData.set("email", values.email)
            formData.set("avatar", avatar)

            const object = {};

            formData.forEach((value, key) => object[key] = value)
            const json = object

            setLoading(true)
            try {
                await UserAPI.updatedProfile(json)

                setLoading(false)
                alert.success("Cập nhật thành công")
                dispatch(loadUser())
                history.push("/profile")
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
    })

    const [loading, setLoading] = useState(false)

    const [avatar, setAvatar] = useState("")

    useEffect(() => {
        if (user) {
            setAvatar(user.avatar?.url)
        }
    }, [dispatch, user])

    const onChange = (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0]
            const reader = new FileReader()

            reader.onload = () => {
                if (file.type !== "image/png" && file.type !== "image/jpeg") {
                    return alert.error("Định dạng file ảnh không phù hợp.")
                }
                if (reader.readyState === 2) {
                    setAvatar(reader.result)
                }
            }

            reader?.readAsDataURL(file)
        }
    }

    return (
        <>
            <MetaData title="Cập nhật hồ sơ" />
            {
                loading ? <Loader /> :
                    <Layout>
                        <div className="wrapper">
                            <div className="update-profile">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-lg-5">

                                        <form onSubmit={formik.handleSubmit} className="shadow-lg" encType='multipart/form-data'>
                                            <h2>Cập nhật hồ sơ</h2>
                                            <div className="form-group">
                                                <label htmlFor="name_field">Họ tên</label>
                                                <input
                                                    type="name"
                                                    id="name_field"
                                                    name="name"
                                                    className="form-control"
                                                    {...formik.getFieldProps('name')}
                                                />
                                                <ErrorMessage touched={formik.touched.name} errorValue={formik.errors.name} />

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="email_field">Email</label>
                                                <input
                                                    type="email"
                                                    id="email_field"
                                                    name="email"
                                                    className="form-control"
                                                    {...formik.getFieldProps('email')}
                                                />
                                                <ErrorMessage touched={formik.touched.email} errorValue={formik.errors.email} />

                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="avatar_upload">Avatar</label>
                                                <div className="row align-items-center">
                                                    <div className="col-3 col-md-2">
                                                        <Figure width="3rem" height="3rem" image={avatar} />
                                                    </div>
                                                    <div className="col-9 col-md-10">
                                                        <div className='custom-file'>
                                                            <input
                                                                type='file'
                                                                name='avatar'
                                                                className='form-control custom-file-input'
                                                                id='customFile'
                                                                onChange={onChange}
                                                                accept="image/*"
                                                            />
                                                            <label className='custom-file-label' htmlFor='customFile'>
                                                                Chọn ảnh đại diện
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="update-profile-action mt-4">
                                                <Button type="submit">
                                                    Cập nhật
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout>
            }
        </>
    )
}

export default UpdateProfile
