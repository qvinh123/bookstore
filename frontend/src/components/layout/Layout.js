import React, { useEffect, useCallback, useState } from 'react'

import { useLocation } from 'react-router-dom'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import ListMenu from "../ListMenu/ListMenu"

const Layout = ({ children }) => {
    const [bar, setBar] = useState(false)

    const { pathname } = useLocation()

    useEffect(() => {
        setBar(false)
    }, [pathname])

    const handleClickBar = useCallback(() => {
        setBar(!bar)
    }, [bar])

    return (
        <>
            <div onClick={handleClickBar} className={`overlay d-block d-lg-none ${bar ? 'open' : ''}`} />
            <Header handleClickBar={handleClickBar} />

            <main className="main">
                <div className="wrapper">
                    <ListMenu bar={bar} handleClickBar={handleClickBar} />
                </div>
                {children}
            </main>
            <Footer />
        </>
    )
}

export default Layout
