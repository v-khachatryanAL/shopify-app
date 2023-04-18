import ClientsFormCase from "../../clientsFormCase/ClientsFormCase";
import DefaultDatePicker from "../../datePicker/DefaultDatePicker";
import DefaultAutocomplete from "../../autocomplete/defaultAutocomplete/DefaultAutocomplete";
import { Button, TextField } from "@shopify/polaris";
import { useState } from "react";
import moment from "moment";

const NewCreditTop = ({
  issueDate,
  showMore,
  fromIssue,
  dueIn,
  changeNewItemVal,
  invoicesOptions,
  changeItemDate,
  invoicesLoading,
  creditNumber,
}) => {
  const [issueDateActive, setIssueDateActive] = useState(false);
  const convertedDate = (date) => {
    return moment(date).format("D/MM/YYYY");
  };

  return (
    <div className="newCredit-newCreditTop new-element-line">
      <div className="newInvoice__paddCase new-element-list">
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Credit note number:"
            value={creditNumber}
            onChange={(val) => {
              changeNewItemVal("creditNumber", val);
            }}
          />
        </div>
        <DefaultAutocomplete
          label={"For invoice number:"}
          width="medium"
          deselectedOptions={invoicesOptions}
          inputChange={(val) => {}}
          loading={invoicesLoading}
          changeValue={(val) => {
            changeNewItemVal("forInvoiceNumber", val);
          }}
        />
        <DefaultDatePicker
          date={issueDate}
          show={issueDateActive}
          title={"Issue date"}
          dateKey={"issueDate"}
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
      <div>
        <ClientsFormCase
          sendClient={(client) => {}}
          clientSearch={(val) => {}}
        />
      </div>
    </div>
  );
};

export default NewCreditTop;
