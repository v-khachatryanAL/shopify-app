import DefaultDatePicker from "../../datePicker/DefaultDatePicker";
import ClientsFormCase from "../../clientsFormCase/ClientsFormCase";
import { Button, TextField } from "@shopify/polaris";
import { useState } from "react";
import moment from "moment";
import ArrowDown from "../../../assets/arrow-down.png";

const NewInvoiceTop = ({
  showMore,
  show,
  changeNewItemVal,
  changeItemDate,
  invoicesNumbers,
  clientSearch,
  sendClient,
  checkErrors,
  data,
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

  const invoiceNumberError = () => {
    return (
      validTouch.filter((e) => {
        return e.type === "invoiceNumber";
      })[0].touch && invoicesNumbers.includes(parseInt(data.invoiceNumber))
    );
  };

  return (
    <div className="newInvoice-newInvoiceTop new-element-line">
      <div className="newInvoice__paddCase newInvoiceTop__paper">
        <div className="new-element-list">
          <div
            className={`newInvoice__input def-input-purple ${
              invoiceNumberError() && "_error"
            }`}
          >
            <TextField
              label="Invoice number:"
              value={data.number}
              onChange={(val) => {
                changeNewItemVal("number", val);
                handleValidateTouch("invoiceNumber", val);
              }}
              onFocus={() => {
                handleValidateTouch("invoiceNumber");
              }}
            />
            {invoiceNumberError() ? (
              <div className="newInvoice__input-error">
                Invoice number is already used
              </div>
            ) : (
              ""
            )}
          </div>
          <DefaultDatePicker
            date={data.deliveryDate}
            show={deliveryDateActive}
            title={"Delivery date"}
            dateKey={"deliveryDate"}
            changeDate={(date, key) => {
              changeItemDate(date, key);
            }}
            handleOpenMenu={(val) => {
              setDeliveryDateActive(val);
            }}
          />
          <DefaultDatePicker
            date={data.issueDate}
            title={"Issue date"}
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
              value={data.dueIn}
              label="Due in:"
              onChange={(val) => {
                changeNewItemVal("dueIn", val);
              }}
            />
            <div className="newInvoice__dateArea">
              <span>{convertedDate(data.fromIssue)}</span>
            </div>
          </div>
        </div>
        <div className="newInvoiceTop__lineEnd">
          <div className="form__defBtn purple__btn-dark">
            <Button onClick={showMore}>
              More options
              <div className={`form__defBtn-ic ${show ? "_active" : ""}`}>
                <img src={ArrowDown} alt="" />
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className="newInvoiceTop__right">
        <ClientsFormCase
          checkErrors={checkErrors}
          sendClient={(client) => {
            sendClient(client);
          }}
          clientSearch={(val) => {
            clientSearch(val);
          }}
        />
      </div>
    </div>
  );
};

export default NewInvoiceTop;
