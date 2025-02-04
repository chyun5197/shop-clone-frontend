// npm install react-paginate
// install react-icons
import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Pagination.css'

const Pagination = ({ pageCount, onPageChange, currentPage}) => {

    return (
        <ReactPaginate
            activePage={currentPage}
            currentPage={currentPage}
            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            onPageChange={onPageChange}
            onClick = { onPageChange }
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            pageLinkClassName={"pagination__link"}
            activeLinkClassName={"pagination__link__active"}
        />
    );
};

export default Pagination;