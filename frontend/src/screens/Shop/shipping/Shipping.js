import React, { useEffect, useState } from 'react'

import { useAlert } from "react-alert"
import { useHistory } from 'react-router-dom'

import Button from '../../../components/Button/Button'
import CheckoutStep from '../../../components/CheckoutStep/CheckoutStep'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import MetaData from '../../../components/MetaData/MetaData'
import Layout from '../../../components/layout/Layout'

import { useFormik } from "formik"
import * as yup from "yup"

import * as ProvinceAPI from "../../../api/provinceAPI"

const Shipping = () => {
    const [provinces, setProvinces] = useState([])

    const alert = useAlert()
    const history = useHistory()

    const validationSchema = yup.object().shape({
        address: yup
            .string()
            .required("Không được để trống"),
        phone: yup
            .string()
            .required("Không được để trống")
            .matches(/^[0-9]+$/, "Số điện thoại phải từ 0-9"),
        province: yup
            .string()
            .required("Không được để trống"),
        district: yup
            .string()
            .required("Không được để trống"),
        wards: yup
            .string()
            .required("Không được để trống")
    })

    const formik = useFormik({
        initialValues: {
            address: "",
            phone: "",
            province: "",
            district: "",
            wards: ""
        },
        validationSchema,
        onSubmit: (values) => {
            localStorage.setItem("shippingInfo", JSON.stringify(values))
            history.push("/cofirmOrder")
        }
    })

    useEffect(() => {
        const fetchProvince = async () => {
            try {
                const { data } = await ProvinceAPI.getProvince()
                setProvinces(data)
            } catch (err) {
                alert.error(err.response.data.message)
            }
        }
        fetchProvince()

        return () => {
            setProvinces([])
        }
    }, [alert])

    const renderProvince = (provinces) => {
        return provinces.sort((a, b) => a.name.localeCompare(b.name)).map(province =>
            <option onChange={() => formik.setFieldValue("province", province.name)} key={province.code} value={province.name}>{province.name}</option>
        )
    }

    let districts
    const renderDistrict = (provinces) => {
        return provinces.filter(province => province.name === formik.values.province).map(province => {
            districts = province.districts
            return province.districts.sort((a, b) => a.name.localeCompare(b.name)).map(district => (
                <option onChange={() => formik.setFieldValue("district", district.name)} key={district.code} value={district.name}>{district.name}</option>
            ))
        })
    }

    const renderWards = (districts) => {
        return districts?.filter(district => district.name === formik.values.district).map(district => (
            district.wards.sort((a, b) => a.name.localeCompare(b.name)).map(ward => (
                <option onChange={() => formik.setFieldValue("wards", ward.name)} key={ward.code} value={ward.name}>{ward.name}</option>
            )))
        )
    }

    return (
        <>
            <MetaData title={'Thông tin đơn hàng'} />
            <Layout>
                <div className="wrapper">
                    <CheckoutStep shipping />

                    <div className="row justify-content-center mt-5">
                        <div className="col-12 col-lg-5">
                            <form onSubmit={formik.handleSubmit} className="shadow-lg p-lg-5 p-3">
                                <h3 className="mb-4">Thông tin đơn hàng</h3>
                                <div className="form-group">
                                    <label htmlFor="address_flied">Địa chỉ</label>
                                    <input name="address" onBlur={formik.handleBlur} value={formik.values.address} onChange={formik.handleChange} type="text" id="address_flied" className="form-control" />
                                    <ErrorMessage touched={formik.touched.address} errorValue={formik.errors.address} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone_flied">Điện thoại</label>
                                    <input name="phone" onBlur={formik.handleBlur} value={formik.values.phone} onChange={formik.handleChange} type="text" id="phone_flied" className="form-control" />
                                    <ErrorMessage touched={formik.touched.phone} errorValue={formik.errors.phone} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="province_flied">Tỉnh</label>
                                    <select name="province" onBlur={formik.handleBlur} value={formik.values.province} onChange={formik.handleChange} className="form-select" id="province_flied">
                                        <option>Chọn tỉnh thành</option>
                                        {renderProvince(provinces)}
                                    </select>
                                    <ErrorMessage touched={formik.touched.province} errorValue={formik.errors.province} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="district_flied">Quận/Huyện</label>
                                    <select name="district" onBlur={formik.handleBlur} value={formik.values.district} onChange={formik.handleChange} className="form-select" id="district_flied">
                                        <option>Chọn Quận Huyện</option>
                                        {renderDistrict(provinces)}
                                    </select>
                                    <ErrorMessage touched={formik.touched.district} errorValue={formik.errors.district} />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="wards_flied">Phường/Xã</label>
                                    <select name="wards" onBlur={formik.handleBlur} value={formik.values.wards} onChange={formik.handleChange} className="form-select" id="wards_flied">
                                        <option>Chọn phường xã</option>
                                        {renderWards(districts)}
                                    </select>
                                    <ErrorMessage touched={formik.touched.wards} errorValue={formik.errors.wards} />
                                </div>

                                <div className="text-end mt-4"><Button type="submit">Tiếp tục</Button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Shipping
