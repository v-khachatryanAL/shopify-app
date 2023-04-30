import { TextField } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppQuery } from "../hooks";
import DefaultSelectMain from "./select/defaultSelectMain/DefaultSelectMain";

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
  discountType,
  languageOptions,
}) => {
  const [currenciesOptions, setCurrenciesOptions] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { label: "", value: "" },
    { label: "%", value: "%" },
  ]);
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

  useEffect(() => {
    if (currenciesSuccess && currency) {
      const item = currenciesOptions.find((e) => e.value === currency);
      setSelectOptions((prev) => {
        const newVal = [...prev];
        newVal[0].label = item?.label;
        newVal[0].value = item?.value;

        changeNewItemVal("discountType", item.value);
        return [...newVal];
      });
    }
  }, [currency, currenciesSuccess]);

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
            value={paymentMethod || ""}
            onChange={(val) => {
              changeNewItemVal("paymentMethod", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Bank account:"
            value={bankAccount || ""}
            onChange={(val) => {
              changeNewItemVal("bankAccount", val);
            }}
            // autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Order number:"
            value={orderNumber || ""}
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
              value={discount || ""}
              onChange={(val) => {
                changeNewItemVal("discount", val);
              }}
              autoComplete="off"
            />
            <DefaultSelectMain
              options={selectOptions}
              val={discountType || ""}
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
            value={shipping || ""}
            onChange={(val) => {
              changeNewItemVal("shipping", val);
            }}
          />
        </div>
        <div>
          <DefaultSelectMain
            label="Currency:"
            width="min"
            options={currenciesOptions}
            val={currency || ""}
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
            val={language || ""}
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
