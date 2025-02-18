// npm install react-paginate
// install react-icons
import React from "react";
import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import './Pagination.css'

const Pagination = ({totalPage, onPageChange, currentPage}) => {

    return (
        <ReactPaginate
            // 현재 페이지 화면에 잘 나타내게 하려면
            initialPage={currentPage-1} // 초기 번호를 현재 페이지로 세팅해놔야함. 페이지 변경때마다 매번 api 불러오면 페이지네이션도 계속 리렌더링되기때문
            // activePage={currentPage} // 위의 이유로 페이지네이션의 현재 페이지 세팅 기능은 내 코드에서 의미없음
            // currentPage={currentPage}

            previousLabel={<FiChevronLeft />}
            nextLabel={<FiChevronRight />}
            pageCount={totalPage} // 끝번호 몇페이지까지 나타낼지
            pageRangeDisplayed={5} // 현재 페이지 번호 주변 나열 범위
            marginPagesDisplayed={1} // 양끝 번호 나열 범위
            onPageChange={onPageChange}
            renderOnZeroPageCount={null}
            containerClassName={"pagination"}
            pageLinkClassName={"pagination__link"}
            activeLinkClassName={"pagination__link__active"}
        />
    );
};

export default Pagination;