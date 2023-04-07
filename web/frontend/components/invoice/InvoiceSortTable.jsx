import { Autocomplete, Badge, Button, Icon, Tabs } from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";
import { CalendarMajor } from "@shopify/polaris-icons";
import { SearchMajor } from "@shopify/polaris-icons";
import { mutationRequest } from "../../hooks/useAppMutation";
import OrderDate from "./OrderDate";
import InvoiceTableMoreAction from "./InvoiceTableMoreAction";

const InvoiceSortTable = ({
  orderData,
  selectedResources,
  refetch,
  setOrderData,
  ordersCount,
}) => {
  const [selected, setSelected] = useState({ index: 0, label: "" });
  const [dateSort, setDateSort] = useState({ min: "", max: "" });
  const [datePickerActive, setDatePickerActive] = useState(false);

  const { mutate: mutateStatus } = mutationRequest(
    `/api/orders`,
    "get",
    `?status=any${`&financial_status=${selected.label}&created_at_min=${dateSort.min}&created_at_max=${dateSort.max}`}`,
    true
  );

  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleTabChange = useCallback((selectedTabIndex) => {
    if (selectedTabIndex === 0) {
      setSelected({ index: selectedTabIndex, label: "" });
    }
    if (selectedTabIndex === 1) {
      setSelected({ index: selectedTabIndex, label: "paid" });
    }
    if (selectedTabIndex === 2) {
      setSelected({ index: selectedTabIndex, label: "pending" });
    }
  }, []);

  useEffect(() => {
    mutateStatus.mutate();
  }, [selected.label]);

  useEffect(() => {
    if (dateSort.min.length && dateSort.max.length) {
      mutateStatus.mutate();
    }
  }, [dateSort]);

  useEffect(() => {
    if (mutateStatus.isSuccess) {
      setOrderData(mutateStatus.data);
    }
  }, [mutateStatus.isSuccess]);

  const tabs = [
    {
      id: "1",
      content: (
        <span>
          All Invoices <Badge status="new">{ordersCount?.all}</Badge>
        </span>
      ),
      accessibilityLabel: "All customers",
      panelID: "all-customers-fitted-content-3",
    },
    {
      id: "2",
      content: (
        <span>
          Paid <Badge status="new">{ordersCount?.paid}</Badge>
        </span>
      ),
      panelID: "accepts-marketing-fitted-content-3",
    },
    {
      id: "3",
      content: (
        <span>
          Pending <Badge status="new">{ordersCount?.pending}</Badge>
        </span>
      ),
      panelID: "accepts-marketing-fitted-content-3",
    },
  ];

  const handleDatePickerToggle = () => {
    setDatePickerActive(!datePickerActive);
  };
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
  const deselectedOptions = useMemo(
    () => [
      { value: "rustic", label: "Rustic" },
      { value: "antique", label: "Antique" },
      { value: "vinyl", label: "Vinyl" },
      { value: "vintage", label: "Vintage" },
      { value: "refurbished", label: "Refurbished" },
    ],
    []
  );
  const [options, setOptions] = useState(deselectedOptions);
  const [inputValue, setInputValue] = useState("");
  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || "");
    },
    [options]
  );
  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );
  const textField = (
    <Autocomplete.TextField
      label=""
      onChange={updateText}
      value={inputValue}
      prefix={<Icon source={SearchMajor} color="base" />}
      placeholder="Search Invoice"
      autoComplete="off"
    />
  );
  const handleChangeDate = (date) => {
    setSelectedDates(date);
    const dateMin = moment
      .tz(date.start.toISOString(), "YYYY-MM-DDTHH:mm:ssZ", "Asia/Yerevan")
      .format("YYYY-MM-DD");

    const dateMax = moment
      .tz(date.end.toISOString(), "YYYY-MM-DDTHH:mm:ssZ", "Asia/Yerevan")
      .format("YYYY-MM-DD");
    setDateSort((prev) => {
      if (dateMin === dateMax) {
        return { ...prev, min: dateMin, max: dateMax + "T23:59:32+04:00" };
      } else {
        return { ...prev, min: dateMin, max: dateMax };
      }
    });
  };

  return (
    <div>
      <div className="tabs_filter">
        <Tabs
          tabs={tabs}
          selected={selected.index}
          onSelect={handleTabChange}
          fitted
        ></Tabs>
      </div>
      <div className="search_date_picker_div">
        <Autocomplete
          options={options}
          selected={selectedOptions}
          onSelect={updateSelection}
          textField={textField}
        />

        <div className="date_picker_select">
          <Button
            onClick={handleDatePickerToggle}
            icon={<Icon source={CalendarMajor} color="base" />}
          >
            {selectedDates.start !== selectedDates.end
              ? `${moment(selectedDates.start).format("MMM DD,YYYY")}-${moment(
                  selectedDates.end
                ).format("MMM DD,YYYY")} `
              : `${moment(selectedDates.start).format("MMM DD,YYYY")}`}
          </Button>
          {datePickerActive && (
            <OrderDate
              handleChangeDate={handleChangeDate}
              month={month}
              selectedDates={selectedDates}
              year={year}
              handleMonthChange={handleMonthChange}
            />
          )}

          <InvoiceTableMoreAction
            selectedResources={selectedResources}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceSortTable;
