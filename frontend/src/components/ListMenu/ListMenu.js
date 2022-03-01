import React, { memo } from 'react'

import { Link } from "react-router-dom"

import Search from '../Search/Search'

import { useSelector } from 'react-redux'

import { categoriesSelector } from '../../redux/selectors/categoriesSelector'

const Button = ({ url, children, ...rest }) => {
    let Component
    const props = {
        ...rest
    }

    Component = Link
    props.to = url

    return <Component {...props}>{children}</Component>
}


const ListMenu = (props) => {
    const { categories, error: errorCategories } = useSelector(categoriesSelector)

    return (
        <div className="nav-menu">
            <button className="d-none d-lg-block">
                <i className="fa fa-bars" aria-hidden="true"></i>
                Danh mục sản phẩm
            </button>
            <ul className={`list-menu ${props.bar ? 'active' : ''}`}>
                <li className="d-none d-lg-block">
                    <Button url="/tat-ca-san-pham">
                        <span>Tất cả sản phẩm</span>
                    </Button>
                </li>

                <li className="mobile-nav__item d-block d-lg-none">
                    <div className="drawer__header">
                        <div className="drawer__close">
                            <button onClick={props.handleClickBar} type="button">
                                <span>Đóng</span>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </li>

                <li className="d-block d-lg-none">
                    <Search />
                </li>

                {errorCategories ? <p>{errorCategories}</p> : categories?.map(category => (
                    <li key={category._id}>
                        <Button url={`/categories/${category.slugName}`} onClick={props.handleClickBar}>

                            <img src="//theme.hstatic.net/200000343865/1000754934/14/hd_mainlink_icon2.png?v=74"
                                alt={category.slugName} className="icon-normal" />
                            <img src="//theme.hstatic.net/200000343865/1000754934/14/hd_mainlink_iconhover2.png?v=74"
                                alt={category.slugName} className="icon-hover" />

                            <span>{category.name}</span>
                        </Button>

                    </li>
                ))}
            </ul>
        </div>
    )
}

export default memo(ListMenu)
