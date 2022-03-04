import React, { useEffect, useState } from 'react';

import { useAlert } from 'react-alert';

import { useParams } from "react-router"

import * as ProductAPI from "../../../api/productAPI"
import * as CommentAPI from "../../../api/commentAPI"

import MetaData from '../../../components/MetaData/MetaData';
import Loader from "../../../components/Loader/Loader"
import LayoutAdmin from '../../../components/layout/LayoutAdmin';


const ProductReviews = (props) => {
    const { product } = props.location.state
    const { id } = useParams()

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)

    const [isDelete, setIsDelete] = useState(false)

    const alert = useAlert()

    const deleteReviewHandler = async (reviewId, productId) => {
        setLoading(true)
        try {
            await CommentAPI.deleteComment(reviewId, productId)
            setLoading(false)
            setIsDelete(!isDelete)
        } catch (err) {
            alert.error(err.response.data.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const { data } = await ProductAPI.getAllComments(id)

                setReviews(data.reviews)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }
        fetchProduct()

    }, [alert, id, isDelete])

    const renderReviews = () => {
        return reviews?.map((review) => {
            return (
                <tr className="row text-center" key={review._id}>
                    <td className="col-2 py-4">{review._id}</td>
                    <td className="col-2 py-4">{review.user.name}</td>
                    <td className="col-1 py-4">{review.rating} <i style={{ color: 'rgb(253, 204, 13)', fontSize: '14px' }} className="fas fa-star"></i></td>
                    <td className="col-3 py-4 d-flex flex-wrap justify-content-center">{review.images.map(img => (
                        <img className="p-2" src={img.url} key={img.public_id} alt={img.public_id} width="45%" />
                    ))}</td>
                    <td style={{ wordBreak: 'break-all' }} className="col-3 py-4">{review.review}</td>
                    <td className="col-1 py-4 ">
                        <button className="btn py-1 px-2" onClick={() => { deleteReviewHandler(review._id, product._id) }}>
                            <i className="fa fa-trash me-0" style={{ fontSize: "16px" }}></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }


    return (
        <>
            <MetaData title={'Đánh giá sản phẩm'} />

            {
                loading ? <Loader /> :
                    <LayoutAdmin>
                        {
                            reviews?.length > 0 ? <>
                                <h3 className="my-4">Tất cả đánh giá: {product.name}</h3>
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr className="row text-center">
                                            <th className="col-2">ID</th>
                                            <th className="col-2">Tên người dùng</th>
                                            <th className="col-1">Rating</th>
                                            <th className="col-3">Hình ảnh</th>
                                            <th className="col-3">Nội dụng</th>
                                            <th className="col-1"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {renderReviews()}
                                    </tbody>
                                </table>
                            </> : <p>Sản phẩm chưa có đánh giá</p>
                        }
                    </LayoutAdmin>
            }
        </>
    )
}
export default ProductReviews;
