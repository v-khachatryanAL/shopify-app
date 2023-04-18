import { TextField } from "@shopify/polaris";
import { useEffect } from "react";
import { useState } from "react";
// import InvoiceSelectMain from "../../select/defaultSelectMain/DefaultSelectMain";
import DefaultSelectMain from "./select/defaultSelectMain/DefaultSelectMain";
import DefaultSelect from "./select/defaultSelect/DefaultSelect";

const currencySelectOptions = [
  { label: "United States Dollar", value: "$" },
  { label: "EUR", value: "e" },
  { label: "RUB", value: "₽" },
];

const NewElementBody = ({
  showMoreOpt,
  paymentMethod,
  bankAccount,
  orderNumber,
  discount,
  shipping,
  currency,
  language,
  changeNewItemVal,
  currenciesOptions,
  discountType,
  languageOptions,
}) => {
  const [selectOptions, setSelectOptions] = useState([
    { label: "", value: "" },
    { label: "%", value: "%" },
  ]);

  useEffect(() => {
    setSelectOptions((prev) => {
      const newVal = prev;
      const item = currenciesOptions.find((e) => e.value === currency);
      newVal[0].label = item?.symbol;
      newVal[0].value = item?.value;
      changeNewItemVal("discountType", item?.value);
      return [...newVal];
    });
  }, [currency, currenciesOptions]);

  return (
    <div
      className={`newInvoice-newInvoiceBody new-element-line ${
        showMoreOpt ? "_active" : ""
      }`}
    >
      <div className="newInvoiceBody__left newInvoice__paddCase new-element-list">
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Payment method:"
            value={paymentMethod}
            onChange={(val) => {
              changeNewItemVal("paymentMethod", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Bank account:"
            value={bankAccount}
            onChange={(val) => {
              changeNewItemVal("bankAccount", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Order number:"
            value={orderNumber}
            onChange={(val) => {
              changeNewItemVal("orderNumber", val);
            }}
            // autoComplete="off"
          />
        </div>
      </div>
      <div className="new-element-list">
        <div className="newInvoice-inputTwice">
          <div className="inputTwice__label">
            <span>Discount:</span>
          </div>
          <div className="inputTwice__area def-input-purple">
            <TextField
              value={discount}
              onChange={(val) => {
                changeNewItemVal("discount", val);
              }}
              // autoComplete="off"
            />
            <DefaultSelectMain
              options={selectOptions}
              val={discountType}
              changeVal={(val) => {
                changeNewItemVal("discountType", val);
              }}
            />
            {/* <DefaultSelect
                options={selectOptions}
                val={discountType}
                changeVal={(val) => {
                  changeNewItemVal("discountType", val);
                }}
              /> */}
          </div>
        </div>
        <div className="newInvoice__input def-input-purple start">
          <TextField
            label="Shipping:"
            value={shipping}
            onChange={(val) => {
              changeNewItemVal("shipping", val);
            }}
            //   autoComplete="off"
          />
        </div>
        <div>
          <DefaultSelectMain
            label="Currency:"
            width="min"
            options={currenciesOptions}
            val={currency}
            changeVal={(val) => {
              changeNewItemVal("currency", val);
            }}
          />
        </div>
        <div>
          <DefaultSelectMain
            label="Language"
            width="min"
            options={languageOptions}
            val={language}
            changeVal={(val) => {
              changeNewItemVal("language", val);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NewElementBody;
