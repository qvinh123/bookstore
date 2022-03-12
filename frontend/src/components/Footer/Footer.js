import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div style={{ margin: "25px 0" }}>
                <img className="w-100" src="//theme.hstatic.net/200000343865/1000754934/14/banner_home_pro_3.jpg?v=75" alt="banner" />
            </div>
            <div className="wrapper">
                <div className="inner">
                    <div className="row">
                        <div className="col-12 col-md-4 col-lg-3 order-lg-1 order-2 mb-4">
                            <h5>DỊCH VỤ</h5>
                            <ul>
                                <li><a href="#!">Điều khoản sử dụng</a></li>
                                <li><a href="#!">Chính sách bảo mật</a></li>
                                <li><a href="#!">Liên hệ</a></li>
                                <li><a href="#!">Hệ thống nhà sách</a></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-4 col-lg-3 order-lg-2 order-3 mb-4">
                            <h5>HỖ TRỢ</h5>
                            <ul>
                                <li><a href="#!">Hướng dẫn đặt hàng</a></li>
                                <li><a href="#!">Chính sách đổi trả - hoàn tiền</a></li>
                                <li><a href="#!">Phương thức vận chuyển</a></li>
                                <li><a href="#!">Phương thức thanh toán</a></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-4 col-lg-3 order-lg-3 order-4 mb-4">
                            <h5>Nhà xuất bản VbOOKS</h5>
                            <ul>
                                <li>
                                    <a href="#!">Địa chỉ: Số 55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội</a>
                                </li>
                                <li>
                                    Số điện thoại: <a href="tel: (+84) 1900571595">(+84) 1900571595</a>
                                </li>
                                <li>Email: <a href="mailto: cskh_online@nxbkimdong.com.vn">cskh_online@nxbvbooks.com.vn</a></li>
                            </ul>
                        </div>
                        <div className="col-12 col-md-12 col-lg-3 social-network order-lg-4 order-1 mb-4">
                            <h5>Kết nối mạng xã hội</h5>
                            <ul>
                                <li>
                                    <a href="#!">
                                        <i style={{ color: "#3B5998" }} className="fab fa-facebook-f"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#!">
                                        <i style={{ color: "#FF0000" }} className="fab fa-youtube"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#!">
                                        <i style={{ color: "#C32AA3" }} className="fab fa-instagram"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
