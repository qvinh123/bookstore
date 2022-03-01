import React from 'react';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/authAction';
import { userSelector } from '../../redux/selectors/userSelector';

import Figure from '../Figure/Figure';

const AdminNavbar = (props) => {
    const dispatch = useDispatch()

    const { user } = useSelector(userSelector)

    return (
        <header className="shadow-lg container-fluid admin-nav">
            <div className="row align-items-sm-end align-items-md-center px-5 py-4">
                <div className="header_admin-bar col-md-4 col-lg-3" >
                    <span onClick={props.handleClickSideBar}>
                        <svg
                            style={{ width: "35px", height: "35px", cursor: "pointer" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </span>
                </div>
                <div className="header_logo col-md-4 col-lg-5" style={{ display: "grid", placeItems: "center" }}>
                    <Link to="/">
                        <span>
                            <i className="fas fa-book-open me-2"></i>
                            <strong className="d-none d-md-flex">VbOOKS</strong>
                        </span>
                    </Link>
                </div>

                <div className="col-md-4 col-lg-4 d-flex justify-content-end align-items-center">
                    <div className="header_account">
                        <div className="dropdown">
                            <button className="dropdown-toggle" type="button" id="dropdownMenu" data-bs-toggle="dropdown" aria-expanded="false">
                                <Figure width="2.5rem" height="2.5rem" image={user?.avatar?.url} />
                                <span className="d-none d-lg-inline">{user?.name}</span>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu">
                                <li><Link className="dropdown-item" to="/">Shop</Link></li>
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
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
};

export default AdminNavbar;
