import React, { useEffect, useState, useMemo } from 'react'

import { useAlert } from 'react-alert'

import { useSelector } from 'react-redux'

import { userSelector } from '../../../redux/selectors/userSelector'

import { useHistory, useParams } from 'react-router'

import * as ProductAPI from "../../../api/productAPI"
import * as CommentAPI from "../../../api/commentAPI"

import { usePagePagination } from '../../../hooks/usePagePagination'

import { handlerRatings } from '../../../utils'

import Modal from '../../../components/Modal/Modal'
import CommentItem from '../../../components/CommentItem/CommentItem'
import AddComment from '../../../components/AddComment/AddComment'
import Paginate from '../../../components/Paginate/Paginate'
import Ratings from '../../../components/Ratings/Ratings'
import ButtonFilter from '../../../components/ButtonFilter/ButtonFilter'
import LoaderSmall from "../../../components/LoaderSmall/LoaderSmall"

const ProductDetailsComment = ({ productDetails, productsOfAuthor, handle, flag }) => {
    const { slugName } = useParams()

    const { user } = useSelector(userSelector)

    const arrayRating = useMemo(() => [
        {
            id: 1,
            label: "tất cả",
            value: ""
        },
        {
            id: 2,
            label: 5,
            value: `&rating=5`
        },
        {
            id: 3,
            label: 4,
            value: `&rating=4`
        },
        {
            id: 4,
            label: 3,
            value: `&rating=3`
        },
        {
            id: 5,
            label: 2,
            value: `&rating=2`
        },
        {
            id: 6,
            label: 1,
            value: `&rating=1`
        },
        {
            id: 7,
            label: "của bạn",
            value: `&user=${user?._id}`
        }
    ], [user?._id])

    const history = useHistory()
    const alert = useAlert()

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)

    const [filterRating, setFiterRating] = useState(arrayRating[0])

    const [rating, setRating] = useState()
    const [comment, setComment] = useState()
    const [images, setImages] = useState([])

    const [loadingComment, setLoadingComment] = useState(false)

    const [modalComment, setModalComment] = useState(false)

    const { currentPage, setCurrentPageNo, setCurrentPage } = usePagePagination()

    useEffect(() => {
        if (modalComment) {
            handlerRatings((value) => {
                setRating(value)
            })
        }
    }, [modalComment])


    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true)
            try {
                const { data } = await ProductAPI.getAllComments(slugName, currentPage + 1, filterRating.value)
                setReviews(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                alert.error(err.response.data.message)
            }
        }

        if (slugName) {
            fetchReviews()
        }

        return () =>  setReviews([])

    }, [alert, slugName, currentPage, filterRating])


    const addReviewHandler = async () => {
        const formData = new FormData();

        formData.set("rating", rating)
        formData.set("review", comment)
        formData.set("productId", productDetails?._id)
        images.forEach(image => {
            formData.append('images', image)
        })
        setLoadingComment(true)
        try {
            await CommentAPI.addComment(formData)
            setLoadingComment(false)
            setRating("")
            setComment("")
            setImages([])
            setModalComment(false)

        } catch (err) {
            setLoadingComment(false)
            alert.error(err.response.data.message)
        }
        handle(!flag)
    }

    const onChangImages = (e) => {
        const files = Array.from(e.target.files)
        setImages([])

        files.forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    return alert.error("Định dạng file ảnh không hợp lệ")
                }
                if (reader.readyState === 2) {
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    const handleModal = () => {
        if (loadingComment) {
            setModalComment(true)
        } else {
            setModalComment(false)
        }
    }

    return (
        <>

            {
                modalComment &&
                <Modal loading={loadingComment} submitHandler={() => addReviewHandler()} width="30%" onConfirm={handleModal} title="Gửi">
                    <AddComment loading={loadingComment} comment={comment} imagesPreview={images} onChangImages={onChangImages} onChangCommentHandler={(e) => setComment(e.target.value)} />
                </Modal>
            }

            <div className="d-md-flex justify-content-md-between align-items-md-center my-4">
                <h5>Đánh giá sản phẩm</h5>
                <div className="text-md-end">
                    <button
                        onClick={() => {
                            if (user) {
                                setModalComment(true)
                            } else {
                                history.push("/account/login")
                            }
                        }}
                        type="button" className="d-inline-block write-review">
                        Viết đánh giá
                    </button>
                </div>
            </div>
            <div className="product-rating-overview">
                <div className="row align-items-center">
                    <div className={`col-12 col-md-3 ${productsOfAuthor.length > 0 ? "col-lg-3" : "col-lg-2"}`}>
                        <div className="product-rating-overview_left text-center mb-3">
                            <div className="product-rating-overview__score-wrapper">
                                <span className="product-rating-overview__rating-score">{productDetails.rating?.toFixed(1)}</span>
                                <span className="product-rating-overview__rating-score-out-of"> trên 5 </span>
                            </div>
                            <Ratings value={productDetails.rating} color="#fdcc0d" fontSize="18px" />
                            <p className="mt-2">({reviews.totalReviews} đánh giá)</p>
                        </div>
                    </div>
                    <div className={`col-12 col-md-9 ${productsOfAuthor.length > 0 ? "col-lg-9" : "col-lg-7"}`}>
                        <div className="product-rating-overview_right">
                            {
                                arrayRating.map((itemFilter, i) => (
                                    <ButtonFilter
                                        handleClick={() => {
                                            setFiterRating(itemFilter)
                                            setCurrentPage(0)
                                        }}
                                        filterValue={filterRating.value}
                                        itemFilter={itemFilter.value}
                                        key={i}
                                    >
                                        {i !== 0 && i !== arrayRating.length - 1 ? `${itemFilter.label} sao` : itemFilter.label}
                                        {/* {i !== 0 && i !== arrayRating.length - 1 ? `${itemFilter.label} sao (${reviews?.reviews?.filter(item => item.rating === itemFilter.label).length})` : itemFilter.label} */}
                                    </ButtonFilter>
                                ))}
                        </div>
                    </div>
                </div>
            </div>


            <div className="detail-comments">

                {loading ? <LoaderSmall /> :
                    <>
                        {reviews?.reviewsCount < 1 ? <p>Chưa có bình luận phù hợp</p> :
                            reviews?.reviews?.map(review => (
                                <CommentItem key={review._id} flag={flag} handle={handle} review={review} />
                            ))
                        }

                        {
                            reviews?.reviewsCount > reviews?.resultPerPage &&
                            <Paginate currentPage={currentPage} resultPerPage={reviews?.resultPerPage} setCurrentPageNo={setCurrentPageNo} arr={reviews?.reviewsCount} />
                        }
                    </>
                }
            </div>
        </>
    )
}

export default ProductDetailsComment
