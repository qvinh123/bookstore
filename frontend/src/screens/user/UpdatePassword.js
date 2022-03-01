import React, { useState } from 'react'

import { useAlert } from "react-alert"

import { useHistory } from 'react-router'

import * as UserAPI from "../../api/userAPI"

import Button from '../../components/Button/Button'
import MetaData from '../../components/MetaData/MetaData'
import Layout from '../../components/layout/Layout'
import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

import { useFormik } from 'formik'
import * as yup from "yup"

const UpdatePassword = () => {
    const alert = useAlert()
    const history = useHistory()

    const [loading, setLoading] = useState(false)

    const validationSchema = yup.object().shape({
        oldPassword: yup.string()
            .required("Mật khẩu cũ không được để trống"),
        newPassword: yup.string()
            .required("Mật khẩu mới không được để trống")
            .min(8, "Mật khẩu mới ít nhất 8 ký tự"),
        confirmNewPassword: yup.string()
            .required("Vui lòng xác nhận lại mật khẩu")
            .oneOf([yup.ref('newPassword'), null], 'Không đúng. Vui lòng xác nhận lại mật khẩu')
    })

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData()

            formData.append("oldPassword", values.oldPassword)
            formData.append("newPassword", values.newPassword)
            formData.append("confirmNewPassword", values.confirmNewPassword)

            setLoading(true)
            try {
                await UserAPI.updatePassword(formData)
                setLoading(false)
                alert.success("Cập nhật thành công")
                history.push("/profile")

            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
    })

    return (
        <>
            <MetaData title="Cập nhật mật khẩu" />
            {
                loading ? <Loader /> :
                    <Layout>
                        <div className="wrapper">
                            <div className="update-profile">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-lg-5">

                                        <form onSubmit={formik.handleSubmit} className="shadow-lg">
                                            <h2>Cập nhật mật khẩu</h2>
                                            <div className="form-group">
                                                <label htmlFor="passwordOld_field">Mật khẩu cũ</label>
                                                <input
                                                    type="password"
                                                    id="passwordOld_field"
                                                    className="form-control"
                                                    {...formik.getFieldProps('oldPassword')}
                                                />
                                                <ErrorMessage touched={formik.touched.oldPassword} errorValue={formik.errors.oldPassword} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="passwordNew_field">Mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    id="passwordNew_field"
                                                    className="form-control"
                                                    {...formik.getFieldProps('newPassword')}
                                                />
                                                <ErrorMessage touched={formik.touched.newPassword} errorValue={formik.errors.newPassword} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="confirmNewPassword_field">Nhập lại mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    id="confirmNewPassword_field"
                                                    className="form-control"
                                                    {...formik.getFieldProps('confirmNewPassword')}
                                                />
                                                <ErrorMessage touched={formik.touched.confirmNewPassword} errorValue={formik.errors.confirmNewPassword} />
                                            </div>

                                            <Button type="submit" width="100%">
                                                Cập nhật mật khẩu
                                            </Button>
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

export default UpdatePassword
