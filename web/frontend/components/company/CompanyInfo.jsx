import DefaultSelectMain from "../select/defaultSelectMain/DefaultSelectMain";
import DefaultCheckBox from "../checkbox/DefaultCheckBox";
import TwiceTextfield from "../textfield/twiceTextfield/TwiceTextfield";
import DefTextfield from "../textfield/defTextField/DefTextfield";
import { Text, Tooltip } from "@shopify/polaris";
import QuestonSvg from "../Svg/Question";
import { useAppQuery } from "../../hooks";
import { useState } from "react";

const CompanyInfo = ({ company, changeCompany }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const { isLoading: countriesLoading } = useAppQuery({
    url: "/api/countries.json",
    reactQueryOptions: {
      onSuccess: (data) => {
        setCountryOptions(
          data.map((item) => {
            return {
              label: item.name,
              value: item.code.toLowerCase(),
            };
          })
        );
      },
    },
  });
  return (
    <div className="company-companyList company-companyInfo">
      <DefTextfield
        label="Company Name:"
        className="mark"
        width="medium"
        type="text"
        disabled={company.visiable}
        value={company.name}
        onChange={(value) => {
          changeCompany("name", value);
        }}
      />
      <DefTextfield
        label="Address:"
        width="medium"
        className="mark"
        minLabel="Street"
        disabled={company.visiable}
        type="textarea"
        value={company.address}
        onChange={(value) => {
          changeCompany("address", value);
        }}
      />
      <TwiceTextfield
        disabled={company.visiable}
        label1="City"
        label2="Postal code"
        value1={company.city}
        value2={company.zip}
        onChange={(key, value) => {
          const field = key === "val1" ? "city" : "zip";
          changeCompany(field, value);
        }}
      />
      <DefaultSelectMain
        options={countryOptions}
        val={company.country}
        width="medium"
        minLabel="Country"
        disabled={company.visiable}
        changeVal={(value) => {
          changeCompany("country", value);
        }}
      />
      <DefTextfield
        label="VAT No:"
        width="medium"
        type="text"
        disabled={company.visiable}
        value={company.vatNo}
        onChange={(value) => {
          changeCompany("vatNo", value);
        }}
      />
      <div className="companyInfo__check">
        <div className="companyInfo__vatCheck">
          <DefaultCheckBox
            label="VAT registered"
            value={company.vatNoChecked}
            onChange={(value) => {
              changeCompany("vatNoChecked", value);
            }}
          />
          <Tooltip
            preferredPosition="mostSpace"
            content="Select if your company is registered for VAT (GST) purposes."
          >
            <div className="companyInfo__tooltip">
              <QuestonSvg />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
