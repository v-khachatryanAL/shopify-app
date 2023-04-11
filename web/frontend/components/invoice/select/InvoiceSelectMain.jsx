import { Select } from "@shopify/polaris";

const InvoiceSelectMain = ({ options, val, changeVal, label }) => {
  return (
    <div className="invoice__MainSelect def__select">
      <div className="invoice__MainSelec-label">{label}</div>
      <Select options={options} value={val} onChange={changeVal} />
    </div>
  );
};

export default InvoiceSelectMain;
