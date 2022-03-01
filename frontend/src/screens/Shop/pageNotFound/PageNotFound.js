import React from 'react'
import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-12 col-sm-offset-1 text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Không tìm thấy trang😭
                                </h3>

                                <p>trang này hiện tại không có sẵn!</p>

                                <Link to="/" className="link_404">Trang chủ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PageNotFound