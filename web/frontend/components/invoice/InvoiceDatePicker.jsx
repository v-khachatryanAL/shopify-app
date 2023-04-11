import { DatePicker, Icon } from "@shopify/polaris";
import { useState, useRef, useEffect, useCallback } from "react";
import moment from "moment";
import { CalendarMajor } from "@shopify/polaris-icons";

const custUseOutsideClick = (ref, callback) => {
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

const InvoiceDatePicker = ({
  date,
  handleOpenMenu,
  show,
  changeDate,
  title,
  dateKey,
}) => {
  const [{ month, year }, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );
  const dateRef = useRef();

  const handleCloseMenu = () => {
    handleOpenMenu(false);
  };

  const handleChangeDate = (date) => {
    setSelectedDates(date);
    changeDate(date.start, dateKey);
  };

  const convertedDate = (date) => {
    return moment(date).format("D/MM/YYYY");
  };

  custUseOutsideClick(dateRef, handleCloseMenu);

  return (
    <div className={`newInvoice-dateSelect ${show && "_active"}`}>
      <span className="dateSelect__label">{title}:</span>
      <div
        className="dateSelect__input"
        onClick={() => {
          handleOpenMenu(!show);
        }}
      >
        <Icon source={CalendarMajor} color="base" />
        {convertedDate(date)}
      </div>
      {show && (
        <div className="dateSelect__datePicker" ref={dateRef}>
          <DatePicker
            month={month}
            year={year}
            onChange={handleChangeDate}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceDatePicker;
