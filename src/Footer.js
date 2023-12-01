import React from 'react';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import './Footer.css'




const Footer = ({ currentPage, totalPages, handlePageChange, totalRows, checkedRows }) => {
    const renderPageButtons = () => {
        const buttons = [];
        if (totalPages <= 5) {
            // Display all buttons if the total pages are 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button key={i} onClick={() => handlePageChange(i)} disabled={currentPage === i}>
                        {i}
                    </button>
                );
            }
        } else {
            // Display buttons based on the current page and total pages
            const leftBoundary = Math.max(1, currentPage - 2);
            const rightBoundary = Math.min(totalPages, currentPage + 2);

            if (currentPage !== 1) {
                buttons.push(
                    <button key={1} onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                        1
                    </button>
                );

                if (currentPage > 3) {
                    buttons.push(<span key="ellipsis-left">...</span>);
                }
            }

            for (let i = leftBoundary; i <= rightBoundary; i++) {
                buttons.push(
                    <button key={i} onClick={() => handlePageChange(i)} disabled={currentPage === i}>
                        {i}
                    </button>
                );
            }

            if (currentPage !== totalPages) {
                if (currentPage < totalPages - 2) {
                    buttons.push(<span key="ellipsis-right">...</span>);
                }

                buttons.push(
                    <button key={totalPages} onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                        {totalPages}
                    </button>
                );
            }
        }

        return buttons;
    };
    return (
        <footer className='footer '>
            <div className="checked-rows">
                {checkedRows} of {totalRows} row(s) selected.
            </div>
            {totalPages ? (
                <div className="pagination">
                    <p>Page {currentPage} of {totalPages}</p>
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}><KeyboardDoubleArrowLeftOutlinedIcon /></button>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><KeyboardArrowLeftOutlinedIcon /></button>
                    {renderPageButtons()}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><KeyboardArrowRightOutlinedIcon /></button>
                    <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}><KeyboardDoubleArrowRightOutlinedIcon /></button>
                </div>): ""
            }
        </footer>
    );
};

export default Footer;
