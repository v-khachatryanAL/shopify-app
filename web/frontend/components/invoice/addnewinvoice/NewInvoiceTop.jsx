import ClientsFormCase from "../../clientsFormCase/ClientsFormCase";
import { Button, TextField } from "@shopify/polaris";
import { useState } from "react";
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
  invoicesNumbers,
  clientsOptions,
}) => {
  const [deliveryDateActive, setDeliveryDateActive] = useState(false);
  const [issueDateActive, setIssueDateActive] = useState(false);
  const [validTouch, setValidTouch] = useState([
    {
      type: "invoiceNumber",
      touch: false,
      value: "",
    },
  ]);

  const convertedDate = (date) => {
    return moment(date).format("D/MM/YYYY");
  };
  const handleValidateTouch = (key, val) => {
    setValidTouch((prev) => {
      return [
        ...prev.map((e) => {
          if (e.type === key) {
            e.touch = true;
            e.value = val;
          }
          return e;
        }),
      ];
    });
  };

  const checkValid = (key) => {
    const el = validTouch.map((e) => {
      if (e.type === key) {
        e.touch = true;
        e.value = val;
      }
      return e;
    })[0];
  };

  const invoiceNumberError = () => {
    return (
      validTouch.filter((e) => {
        return e.type === "invoiceNumber";
      })[0].touch && invoicesNumbers.includes(parseInt(invoiceNumber))
    );
  };

  return (
    <div className="newInvoice-newInvoiceTop">
      <div className="newInvoiceTop__left changePaper__left newInvoice__paddCase">
        <div
          className={`newInvoice__input def-input-purple ${
            invoiceNumberError() && "_error"
          }`}
        >
          <TextField
            label="Invoice number:"
            value={invoiceNumber}
            onChange={(val) => {
              changeNewItemVal("invoiceNumber", val);
              handleValidateTouch("invoiceNumber", val);
            }}
            onFocus={() => {
              handleValidateTouch("invoiceNumber");
            }}
            autoComplete="off"
          />
          {invoiceNumberError() ? (
            <div className="newInvoice__input-error">
              Invoice number is already used
            </div>
          ) : (
            ""
          )}
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
          <div className="form__defBtn purple__btn-dark">
            <Button
              onClick={() => {
                showMore();
              }}
            >
              More options
            </Button>
          </div>
        </div>
      </div>
      <div className="newInvoiceTop__right">
        <div className="newInvoice__papper">
          <ClientsFormCase />
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceTop;
