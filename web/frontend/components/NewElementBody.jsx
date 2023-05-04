import { TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";
import DefaultSelectMain from "./select/defaultSelectMain/DefaultSelectMain";

const NewElementBody = ({
  data,
  showMoreOpt,
  changeNewItemVal,
  languageOptions,
  currencies,
}) => {
  // const [currencies, setCurrenciesOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { label: "", value: "" },
    { label: "%", value: "%" },
  ]);

  useEffect(() => {
    if (currencies.length && data.currency) {
      const item = currencies.find((e) => e.value === data.currency);
      setSelectOptions((prev) => {
        const newVal = [...prev];
        newVal[0].label = item?.label;
        newVal[0].value = item?.value;

        changeNewItemVal("discountType", item.value);
        return [...newVal];
      });
    }
  }, [data.currency, currencies]);

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
            value={data.paymentMethod || ""}
            onChange={(val) => {
              changeNewItemVal("paymentMethod", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Bank account:"
            value={data.bankAccount || ""}
            onChange={(val) => {
              changeNewItemVal("bankAccount", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Order number:"
            value={data.orderNumber || ""}
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
              type="number"
              value={data.discount || ""}
              onChange={(val) => {
                changeNewItemVal("discount", val);
              }}
              autoComplete="off"
            />
            <DefaultSelectMain
              options={selectOptions}
              val={data.discountType || ""}
              className="discount"
              changeVal={(val) => {
                changeNewItemVal("discountType", val);
              }}
            />
          </div>
        </div>
        <div className="newInvoice__input def-input-purple start">
          <TextField
            label="Shipping:"
            value={data.shipping || ""}
            onChange={(val) => {
              changeNewItemVal("shipping", val);
            }}
          />
        </div>
        <div>
          <DefaultSelectMain
            label="Currency:"
            width="min"
            options={currencies}
            val={data.currency || ""}
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
            val={data.language || ""}
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
