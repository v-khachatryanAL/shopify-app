import { Select } from "@shopify/polaris";
import { useState } from "react";

const InvoiceSelect = ({ options, label }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <div className="invoice__select">
      <Select
        label={label}
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
      />
    </div>
  );
};

export default InvoiceSelect;
