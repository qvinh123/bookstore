import React from 'react'

const AddComment = (props) => {
    return (
        <div className="commentModal">
            <div className="form-group star-fieldset">
                <label>Đánh giá</label>
                <ul className="stars" >
                    <li className="star"><i className="fa fa-star"></i></li>
                    <li className="star"><i className="fa fa-star"></i></li>
                    <li className="star"><i className="fa fa-star"></i></li>
                    <li className="star"><i className="fa fa-star"></i></li>
                    <li className="star"><i className="fa fa-star"></i></li>
                </ul>
            </div>

            <div className="form-group body-fieldset">
                <label>Nội dung</label>
                <textarea disabled={props.loading ? true : false} onChange={props.onChangCommentHandler} value={props.comment} className="form-control" rows="5" name="review_body" placeholder="Viết nội dung đánh giá của bạn"></textarea>
            </div>

            <div className='form-group picture-fieldset'>
                <label htmlFor='customFile'>
                    Hình ảnh (không bắt buộc)
                </label>
                <input
                    type='file'
                    name='product_images'
                    className='form-control'
                    id='customFile'
                    multiple
                    onChange={props.onChangImages}
                    disabled={props.loading ? true : false}
                />

                {props.oldImages && props.oldImages.map((img, i) => (
                    <img style={{ objectFit: "cover" }} src={img.url} key={img.url} alt={`Images Preview ${i}`} className="mt-3 me-2" width="55" height="55" />
                ))}

                {props.imagesPreview.map((img, i) => (
                    <img style={{ objectFit: "cover" }} src={img} key={img} alt={`Images Preview ${i}`} className="mt-3 me-2" width="55" height="55" />
                ))}

            </div>
        </div>
    )
}

export default AddComment
