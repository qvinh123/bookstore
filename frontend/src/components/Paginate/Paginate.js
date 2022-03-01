import React from 'react'
import ReactPaginate from 'react-paginate'

const Paginate = ({ currentPage, arr, resultPerPage, setCurrentPageNo }) => {

    return (
        <ReactPaginate
            forcePage={currentPage}
            activeClassName={'active'}
            previousLabel={<i className="fas fa-angle-double-left"></i>}
            nextLabel={<i className="fas fa-angle-double-right"></i>}
            breakClassName={"break-me"}
            breakLabel={'...'}
            pageCount={Math.ceil(arr / resultPerPage)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={setCurrentPageNo}
            containerClassName={'pagination'}
        />
    )
}

export default Paginate
