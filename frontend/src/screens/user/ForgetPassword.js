import React, { useState } from 'react'

import { useAlert } from "react-alert"

import Button from '../../components/Button/Button'
import Loader from '../../components/Loader/Loader'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import MetaData from '../../components/MetaData/MetaData'
import Layout from '../../components/layout/Layout'

import * as UserAPI from "../../api/userAPI"

import { useFormik } from "formik"
import * as yup from "yup"

const ForgetPassword = () => {
    const alert = useAlert()

    const [loading, setLoading] = useState(false)

    const validationSchema = yup.object().shape({
        email: yup.string()
            .required("Địa chỉ email không được bỏ trống")
            .email("Địa chỉ email không hợp lệ")
    })

    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append("email", values.email)

            setLoading(true)
            try {
                const { data } = await UserAPI.forgetPassword(formData)
                setLoading(false)
                formik.setFieldValue("email", "")
                alert.success(data.message)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
    })

    return (
        <>
            <MetaData title="Quên mật khẩu" />
            {
                loading ? <Loader /> :
                    <Layout>
                        <div className="wrapper">
                            <div className="update-profile">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-lg-5">
                                        <form onSubmit={formik.handleSubmit} className="shadow-lg">
                                            <div className="form-group">
                                                <label htmlFor="inputForgetPassword">E-mail </label>
                                                <input {...formik.getFieldProps("email")} name="email" type="email" className="form-control" id="inputForgetPassword" placeholder="E-mail" />
                                                <ErrorMessage touched={formik.touched.email} errorValue={formik.errors.email} />
                                            </div>

                                            <Button width="100%%" type="submit">
                                                Gửi
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

export default ForgetPassword
