import { Select } from "@shopify/polaris";

const InvoiceSelect = ({ options, label, val, changeVal }) => {
  return (
    <div className="invoice__select def__select">
      <Select
        label={label}
        options={options}
        value={val}
        onChange={changeVal}
      />
    </div>
  );
};

export default InvoiceSelect;
