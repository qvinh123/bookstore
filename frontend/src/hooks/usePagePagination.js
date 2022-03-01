import { useState } from 'react'

export const usePagePagination = () => {
    const [currentPage, setCurrentPage] = useState(0)

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber.selected)
    }

    return {
        currentPage,
        setCurrentPage,
        setCurrentPageNo
    }
}
