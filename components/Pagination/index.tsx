import React from 'react';
import style from './index.module.css';

interface PaginationTypes {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationTypes) => {
    const pages = [...Array(totalPages).keys()].map(num => num + 1);
    return (
        <div className={style.pagination}>
            {pages.map(page => (
                <button 
                    key={page} 
                    className={`${style.pageButton} ${currentPage === page ? style.activePage : ''}`} 
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;