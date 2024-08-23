import React from "react";
import styles from "./pagination.module.css";
import arrowRightIcon from "../../images/arrow_right.svg";
import arrowLeftIcon from "../../images/arrow_left.svg";
import arrowRightDisabledIcon from "../../images/arrow_right_disabled.svg";
import arrowLeftDisabledIcon from "../../images/arrow_left_disabled.svg";


export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div>
      <div id={styles.paginationRow}>
        {currentPage} of {totalPages}
        <button
          className={
            currentPage === 1 ? styles.paginationDisabledBtn : styles.paginationBtn
          }
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <img
            src={currentPage === 1 ? arrowLeftDisabledIcon : arrowLeftIcon}
            alt=""
          />
          Previous page
        </button>
        <button
          disabled={currentPage === totalPages}
          className={
            currentPage === totalPages
              ? styles.paginationRightDisabledBtn
              : styles.paginationRightBtn
          }
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          New page
          <img
            src={
              currentPage === totalPages
                ? arrowRightDisabledIcon
                : arrowRightIcon
            }
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
