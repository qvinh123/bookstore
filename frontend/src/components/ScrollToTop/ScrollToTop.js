import React, { useEffect, useState } from 'react'

const ScrollToTop = () => {

    const [isShow, setIsShow] = useState(false)

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    useEffect(() => {
        const fn = () => {
            if (window.scrollY >= 500) {
                setIsShow(true)
            } else {
                setIsShow(false)
            }
        }

        window.addEventListener("scroll", fn)

        return () => {
            window.removeEventListener("scroll", fn)
        }
    }, [])

    return (
            <div onClick={() => handleScrollToTop()} className={`back-to-top ${isShow ? 'showScroll':""}`}>
                <i className="fas fa-chevron-up me-0"></i>
            </div>
    )
}

export default ScrollToTop
