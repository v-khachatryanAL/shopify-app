import { DataTable, TextField, Button } from "@shopify/polaris";
import DefaultCheckBox from "../checkbox/DefaultCheckBox";

const TaxesExemption = ({ data, changeData }) => {
  return (
    <div className="taxes-taxesExemption">
      <div className="taxesExemption__info">
        <h3 className="taxes__subtitle">EU VAT EXEMPTION</h3>
        <div className="taxesExemption__text">
          <span>
            Selling to business customers from other EU countries? Exclude VAT
            for EU customers with valid VAT numbers.
          </span>
          <span>
            This feature requires some changes to your store theme. Learn more
          </span>
        </div>
      </div>
      <div className="taxesExemption__func">
        <div className="taxesExemption__line">
          <DefaultCheckBox
            value={data.enable}
            onChange={(value) => {
              changeData("enable", value, "check");
            }}
            label="Enable EU VAT Exemptions"
          />
        </div>
        <div className="taxesExemption__line">
          <DefaultCheckBox
            value={data.validate}
            onChange={(value) => {
              changeData("validate", value, "check");
            }}
            label="Validate VAT Numbers"
          />
        </div>
        <div
          className={`taxesExemption__line _hide ${
            data.enable ? "_active" : ""
          }`}
        >
          <a href="" className="def-light-link">
            View VAT Exemptions
          </a>
        </div>
      </div>
    </div>
  );
};
export default TaxesExemption;
