import React from "react";
import { DatePicker } from "@shopify/polaris";
import { mutationRequest } from "../../hooks/useAppMutation";

const OrderDate = ({
  handleChangeDate,
  month,
  year,
  handleMonthChange,
  selectedDates
}) => {
  return (
    <div>
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
