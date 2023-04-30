import DefTextfield from "../textfield/defTextField/DefTextfield";
import { useAppQuery } from "../../hooks";
import { useState } from "react";
import DefaultSelectMain from "../select/defaultSelectMain/DefaultSelectMain";

const CompanyBottom = ({ company, changeCompany }) => {
  const [currenciesOptions, setCurrenciesOptions] = useState([]);
  const { isSuccess: currenciesSuccess } = useAppQuery({
    url: "/api/currencies.json",
    reactQueryOptions: {
      onSuccess: (data) => {
        setCurrenciesOptions(() => {
          return [
            ...data.map((e) => {
              return {
                value: e.currency,
                label: e.currency,
                symbol: e.currency,
              };
            }),
          ];
        });
      },
    },
  });

  return (
    <div className="company-companyBottom">
      <div className="def-container">
        <div className="companyBottom__list">
          <DefTextfield
            label="Company Info:"
            height="large"
            width="medium"
            type="textarea"
            minLabel="Text appears below your address on invoices."
            value={company.info}
            onChange={(value) => {
              changeCompany("info", value);
            }}
          />
          <DefTextfield
            label="Bank Account:"
            width="medium"
            minLabel="Street"
            type="textarea"
            value={company.bankAccount}
            onChange={(value) => {
              changeCompany("bankAccount", value);
            }}
          />
          <DefaultSelectMain
            options={currenciesOptions}
            val={company.currency}
            disabled={company.visiable}
            width="medium"
            label="Base Currency:"
            changeVal={(value) => {
              changeCompany("currency", value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default CompanyBottom;
