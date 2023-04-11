import { TextField } from "@shopify/polaris";
import InvoiceSelect from "../select/InvoiceSelect";
import InvoiceSelectMain from "../select/InvoiceSelectMain";

const selectOptions = [
  { label: "$", value: "$" },
  { label: "₽", value: "₽" },
  { label: "L", value: "L" },
];

const languageSelectOptions = [
  { label: "English", value: "english" },
  { label: "Russian", value: "russian" },
  { label: "Armenian", value: "armenian" },
];
const currencySelectOptions = [
  { label: "United States Dollar", value: "$" },
  { label: "EUR", value: "e" },
  { label: "RUB", value: "₽" },
];

const NewInvoiceBody = ({
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
}) => {
  return (
    <div
      className={`newInvoice-newInvoiceBody ${showMoreOpt ? "_active" : ""}`}
    >
      <div className="newInvoiceBody__left newInvoice__paddCase">
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Payment method:"
            value={paymentMethod}
            onChange={(val) => {
              changeNewItemVal("paymentMethod", val);
            }}
            autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Bank account:"
            value={bankAccount}
            onChange={(val) => {
              changeNewItemVal("bankAccount", val);
            }}
            autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Order number:"
            value={orderNumber}
            onChange={(val) => {
              changeNewItemVal("orderNumber", val);
            }}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="newInvoiceBody__right">
        <div className="newInvoice__papper">
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
                autoComplete="off"
              />
              <InvoiceSelect
                options={selectOptions}
                val={discountType}
                changeVal={(val) => {
                  changeNewItemVal("discountType", val);
                }}
              />
              {/* <TextField onChange={() => {}} autoComplete="off" /> */}
            </div>
          </div>
          <div className="newInvoice__input def-input-purple start">
            <TextField
              label="Shipping:"
              value={shipping}
              onChange={(val) => {
                changeNewItemVal("shipping", val);
              }}
              autoComplete="off"
            />
          </div>
          <div>
            <InvoiceSelectMain
              label="Currency"
              options={currencySelectOptions}
              value={currency}
              changeVal={(val) => {
                changeNewItemVal("currency", val);
              }}
            />
          </div>
          <div>
            <InvoiceSelectMain
              label="Language"
              options={languageSelectOptions}
              value={language}
              changeVal={(val) => {
                changeNewItemVal("language", val);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceBody;
