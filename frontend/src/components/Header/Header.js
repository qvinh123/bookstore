import React from 'react'

import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from "react-redux"

import { cartSelector } from '../../redux/selectors/cartSelector'
import { userSelector } from '../../redux/selectors/userSelector'
import { wishlistSelector } from '../../redux/selectors/wishlistSelector'

import { logoutUser } from '../../redux/actions/authAction'

import Figure from '../Figure/Figure'
import Search from '../Search/Search'

const Header = (props) => {
    const dispatch = useDispatch()

    const { user } = useSelector(userSelector)
    const { cartItems } = useSelector(cartSelector)
    const { wishlist } = useSelector(wishlistSelector)

    return (
        <header className="header-shop">
            <div className="wrapper">
                <div className="row align-items-sm-end align-items-md-center mx-0">
                    <div className="header_logo col-3 col-lg-3">
                        <Link to="/">
                            <span>
                                <i className="fas fa-book-open me-2"></i>
                                <strong className="d-none d-md-flex">VbOOKS</strong>
                            </span>
                        </Link>
                    </div>

                    <Search display="col-lg-5 d-none d-lg-block" />

                    <div className="col-9 col-lg-4 d-flex align-items-center justify-content-end justify-content-lg-start">
                        <div className="header_wishlist">
                            <Link to="/wishlist">
                                <i className="far fa-heart">
                                    <p id="onAppWishList_numberLike">{wishlist?.length > 0 ? wishlist?.length : 0}</p>
                                </i>
                            </Link>
                        </div>
                        <div className="header_cart">
                            <Link to="/cart">
                                <i className="fa fa-shopping-bag">
                                    <p id="onAppWishList_numberLike">{cartItems?.length > 0 ? cartItems?.length : 0}</p>

                                </i>
                            </Link>
                        </div>
                        <div className="header_account">
                            {user ?
                                <div className="dropdown">
                                    <button className="dropdown-toggle" type="button" id="dropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                        <Figure width="2.5rem" height="2.5rem" image={user?.avatar?.url} />
                                        <p className="d-none d-lg-inline">{user?.name}</p>
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
                                        {user?.role === 'admin' ? <li><Link className="dropdown-item" to="/admin/dashboard">Admin</Link></li> : ""}
                                        <li><Link className="dropdown-item" to="/profile">Hồ sơ</Link></li>
                                        <li><Link className="dropdown-item" to="/order/me">Đơn mua</Link></li>
                                        <li>
                                            <Link
                                                to="/"
                                                style={{ color: "var(--primary-color)", cursor: "pointer" }}
                                                className="dropdown-item"
                                                onClick={() => dispatch(logoutUser())}>
                                                Đăng xuất
                                            </Link>
                                        </li>
                                    </ul>
                                </div> :
                                <>
                                    <Link className="d-none d-lg-block" to="/account/login">
                                        <i className="fas fa-sign-in-alt"></i>
                                        Đăng nhập
                                    </Link>
                                    <Link className="d-lg-none d-block" to="/account/login">
                                        <i className="fas fa-user"></i>
                                    </Link>
                                </>
                            }
                        </div>

                        <div className="header_menu d-block d-lg-none ms-2">
                            <button style={{
                                "background": "transparent",
                                "border": "none",
                                "outline": "none"
                            }} onClick={props.handleClickBar}>
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
