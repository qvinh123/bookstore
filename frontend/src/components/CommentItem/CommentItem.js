import React, { useEffect, useState } from 'react'

import ImageGallery from 'react-image-gallery';

import { useSelector } from 'react-redux';

import { useAlert } from 'react-alert';

import { handlerRatings } from '../../utils';

import * as CommentAPI from "../../api/commentAPI"

import { userSelector } from '../../redux/selectors/userSelector';

import Figure from '../Figure/Figure'
import Modal from "../Modal/Modal"
import AddComment from '../AddComment/AddComment'
import Ratings from '../Ratings/Ratings'

const CommentItem = ({ review, handle, flag }) => {

    const { user } = useSelector(userSelector)

    const [loading, setLoading] = useState()

    const [loadingEditComment, setLoadingEditComment] = useState()

    const [modalEditComment, setModalEditComment] = useState()

    const [rating, setRating] = useState()
    const [comment, setComment] = useState()
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])

    const alert = useAlert()

    const imagesArr = review.images.map(img => {
        return {
            original: img.url,
            thumbnail: img.url,
        }
    })

    const onThumbnailClick = (event) => {
        event.currentTarget.classList.add("active")
        event.currentTarget.closest(".image-gallery-content").querySelector(".image-gallery-slide-wrapper").style.display = "block"
    }


    const properties = {
        thumbnailPosition: "top",
        showPlayButton: false,
        items: imagesArr,
        onThumbnailClick,
    }

    useEffect(() => {
        setComment(review.review)
        setRating(review.rating)
        setOldImages(review.images)

        document.querySelectorAll(".image-gallery-thumbnail").forEach((item) => {
            item.classList.remove("active")
        })
    }, [review])

    useEffect(() => {
        if (modalEditComment) {
            handlerRatings((value) => {
                setRating(value)
            }, rating)
        }
    }, [modalEditComment, rating, review])

    const deleteCommentHandler = async (idReview) => {
        setLoading(true)
        try {
            await CommentAPI.deleteComment(idReview)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            alert.error(err.response.data.message)
        }
        handle(!flag)
    }

    const handleModal = () => {
        if (loadingEditComment) {
            setModalEditComment(true)
        } else {
            setModalEditComment(false)
        }
    }

    const editCommentHandler = async (id) => {
        const formData = new FormData();

        formData.set("rating", rating)
        formData.set("review", comment)
        images.forEach(image => {
            formData.append('images', image)
        })

        setLoadingEditComment(true)
        try {
            await CommentAPI.updateComment(id, formData)
            setLoadingEditComment(false)
            setModalEditComment(false)
        } catch (err) {
            setLoadingEditComment(false)
            alert.error(err.response.data.message)
        }
        handle(!flag)
    }

    const onChangImages = (e) => {
        const files = Array.from(e.target.files)
        setImages([])
        setOldImages([])

        files.forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    return alert.error("File format is incorrect.")
                }
                if (reader.readyState === 2) {
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    return (
        <div className="product-comment-item">
            <div className="row">
                <div className="col-2 col-md-1 pe-0">
                    <div className="product-comment_avatar">
                        <Figure width="40px" height="40px" image={review?.user?.avatar?.url} />
                    </div>
                </div>
                <div className="col-10 col-md-11">
                    <div className="product-comment_author-name">
                        {review?.user?.name}
                        {review.isUpdated ? <span>(đã chỉnh sửa)</span> : ""}
                    </div>

                    <div className="product-comment_rating">
                        <Ratings value={review.rating} color="#fdcc0d" fontSize="12px" />
                        {review.user._id === user?._id &&

                            <div className="dropdown">
                                <button className="dropdown-toggle" type="button" id="dropdownActionComment" data-bs-toggle="dropdown" aria-expanded="false">
                                    {loading ? <div className="spinner-border spinner-border-sm" style={{ color: "var(--primary-color)" }}></div> :
                                        <span className="action-comment"><i className="fas fa-ellipsis-v"></i></span>
                                    }
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownActionComment">
                                    <li>
                                        <a href="#!" className="dropdown-item" onClick={() => setModalEditComment(true)}>
                                            <i className="fas fa-pen"></i>
                                            Chỉnh sửa
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!" className="dropdown-item" onClick={() => deleteCommentHandler(review._id)}>
                                            <i className="far fa-trash-alt"></i>
                                            Xóa
                                        </a>
                                    </li>

                                    {modalEditComment && <Modal loading={loadingEditComment} submitHandler={() => editCommentHandler(review._id)} width="30%" onConfirm={handleModal} title="Gửi">
                                        <AddComment loading={loadingEditComment} onChangImages={onChangImages} oldImages={oldImages} imagesPreview={images} comment={comment} onChangCommentHandler={(e) => setComment(e.target.value)} />
                                    </Modal>}
                                </ul>
                            </div>
                        }
                    </div>
                    {review.review !== 'undefined' &&
                        <div className="product-comment_content">
                            {review.review}
                        </div>
                    }

                    <div className="col-12 col-md-5">
                        {
                            imagesArr.length > 0 && <div className="product-comment__image-list-wrapper">
                                <ImageGallery {...properties} />
                            </div>
                        }
                    </div>

                    <div className="product-rating__time">
                        {new Date(review.createdAt).toLocaleDateString()} - {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date(review.createdAt).getTime() > 12 ? "PM" : "AM"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommentItem