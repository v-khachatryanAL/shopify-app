import React from "react";
import { DatePicker } from "@shopify/polaris";
import { useState, useRef, useEffect } from "react";

const useOutsideClick = (ref, callback) => {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return;
};

const OrderDate = ({
  handleChangeDate,
  month,
  year,
  handleMonthChange,
  selectedDates,
  handleOpenMenu,
}) => {
  const dateRef = useRef();
  const handleCloseMenu = () => {
    handleOpenMenu(false);
  };
  useOutsideClick(dateRef, handleCloseMenu);

  return (
    <div ref={dateRef}>
      <DatePicker
        month={month}
        year={year}
        onChange={handleChangeDate}
        onMonthChange={handleMonthChange}
        selected={selectedDates}
        allowRange
      />
    </div>
  );
};

export default OrderDate;
