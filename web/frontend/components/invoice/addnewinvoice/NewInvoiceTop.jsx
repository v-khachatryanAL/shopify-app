import { TextField } from "@shopify/polaris";
import { useState, useRef } from "react";
import InvoiceDatePicker from "../InvoiceDatePicker";
import moment from "moment";

const NewInvoiceTop = ({
  invoiceNumber,
  issueDate,
  deliveryDate,
  dueIn,
  showMore,
  client,
  changeNewItemVal,
  changeItemDate,
  fromIssue,
}) => {
  const [deliveryDateActive, setDeliveryDateActive] = useState(false);
  const [issueDateActive, setIssueDateActive] = useState(false);
  const deliveryRef = useRef();
  const issueRef = useRef();

  const convertedDate = (date) => {
    return moment(date).format("D/MM/YYYY");
  };

  return (
    <div className="newInvoice-newInvoiceTop">
      <div className="newInvoiceTop__left newInvoice__paddCase">
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Invoice number:"
            value={invoiceNumber}
            onChange={(val) => {
              changeNewItemVal("invoiceNumber", val);
            }}
            autoComplete="off"
          />
        </div>
        <InvoiceDatePicker
          date={deliveryDate}
          show={deliveryDateActive}
          title={"Delivery Date"}
          dateKey={"deliveryDate"}
          changeDate={(date, key) => {
            changeItemDate(date, key);
          }}
          handleOpenMenu={(val) => {
            setDeliveryDateActive(val);
          }}
        />
        <InvoiceDatePicker
          date={issueDate}
          title={"Issue Date"}
          dateKey={"issueDate"}
          show={issueDateActive}
          changeDate={(date, key) => {
            changeItemDate(date, key);
          }}
          handleOpenMenu={(val) => {
            setIssueDateActive(val);
          }}
        />
        <div className="newInvoice__input def-input-purple min">
          <TextField
            value={dueIn}
            label="Due in:"
            onChange={(val) => {
              changeNewItemVal("dueIn", val);
            }}
          />
          <div className="newInvoice__dateArea">
            <span>{convertedDate(fromIssue)}</span>
          </div>
        </div>
        <div className="newInvoiceTop__lineEnd">
          <div
            className="newInvoiceTop__moreBtn purple__btn"
            onClick={() => {
              showMore();
            }}
          >
            More options
          </div>
        </div>
      </div>
      <div className="newInvoiceTop__right">
        <div className="newInvoice__papper">
          <div className="newInvoice__input def-input-purple max">
            <TextField
              value={client}
              label="Client:"
              onChange={(val) => {
                changeNewItemVal("client", val);
              }}
              autoComplete="on"
            />
          </div>
          {/* <div className="newInvoiceTop__tabs">
            {addressTypes.map((e, index) => {
              return (
                <div
                  key={index}
                  className={`newInvoiceTop__tab ${
                    addressType === e.value ? "_active" : "_none"
                  }`}
                  onClick={() => {
                    setAddressType(e.value);
                  }}
                >
                  {e.name}
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceTop;
