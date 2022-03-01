import React, { useState, useEffect } from 'react'

import { useAlert } from 'react-alert'

import { useHistory, useParams } from 'react-router'

import Button from '../../components/Button/Button'
import MetaData from '../../components/MetaData/MetaData'
import Layout from '../../components/layout/Layout'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import Loader from '../../components/Loader/Loader'

import { useSelector } from "react-redux"
import { userSelector } from '../../redux/selectors/userSelector'

import * as UserAPI from "../../api/userAPI"

import { useFormik } from 'formik'
import * as yup from "yup"


const NewPassword = () => {
    const { token } = useParams()
    const { user } = useSelector(userSelector)
    const history = useHistory()
    const alert = useAlert()

    const [loading, setLoading] = useState(false)

    const validationSchema = yup.object().shape({
        password: yup.string()
            .required("Mật khẩu không được để trống")
            .min(8, "Mật khẩu ít nhất 8 ký tự"),
        confirmPassword: yup.string()
            .required("Vui lòng xác nhận lại mật khẩu")
            .oneOf([yup.ref("password"), null], 'Không đúng. Vui lòng xác nhận lại mật khẩu')
    })

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            formData.append("password", values.password)
            formData.append("confirmPassword", values.confirmPassword)
            setLoading(true)
            try {
                await UserAPI.newPassword(token, formData)
                setLoading(false)
                alert.success("Cập nhật thành công")
                history.push("/account/login")
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
    })

    useEffect(() => {
        if (user) {
            history.push("/")
        }
    }, [user, history])

    return (
        <>
            <MetaData title="Tạo mật khẩu mới" />
            {

                loading ? <Loader /> :
                    <Layout>
                        <div className="wrapper">
                            <div className="update-profile">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-lg-5">

                                        <form onSubmit={formik.handleSubmit} className="shadow-lg">
                                            <h2>Mật khẩu mới</h2>

                                            <div className="form-group">
                                                <label htmlFor="password_field">Mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    id="password_field"
                                                    className="form-control"
                                                    {...formik.getFieldProps("password")}
                                                />
                                                <ErrorMessage touched={formik.touched.password} errorValue={formik.errors.password} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="confirmPassword_field">Nhập lại mật khẩu mới</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword_field"
                                                    className="form-control"
                                                    {...formik.getFieldProps("confirmPassword")}
                                                />
                                                <ErrorMessage touched={formik.touched.confirmPassword} errorValue={formik.errors.confirmPassword} />
                                            </div>

                                            <Button width="100%" type="submit">
                                                Tạo mật khẩu
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

export default NewPassword
