import { TextField } from "@shopify/polaris";
import InvoiceSelect from "../select/InvoiceSelect";

const selectOptions = [
  { label: "$", value: "percent" },
  { label: "L", value: "l" },
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
            <div className="inputTwice__area">
              <TextField
                value={discount}
                onChange={(val) => {
                  changeNewItemVal("discount", val);
                }}
                autoComplete="off"
              />
              <InvoiceSelect options={selectOptions} />
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
          <div className="newInvoice__input def-input-purple start">
            <TextField
              label="Currency:"
              value={currency}
              onChange={(val) => {
                changeNewItemVal("currency", val);
              }}
              autoComplete="off"
            />
          </div>
          <div className="newInvoice__input def-input-purple start">
            <TextField
              value={language}
              label="Language:"
              onChange={(val) => {
                changeNewItemVal("language", val);
              }}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceBody;
