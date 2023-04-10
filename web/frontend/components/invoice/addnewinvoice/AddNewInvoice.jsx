import { FormLayout, Heading, TextField, Autocomplete } from "@shopify/polaris";
import { React, useState } from "react";
import InvoiceTable from "../invoiceTable/InvoiceTable";
import { generateId } from "../../../utils/helpers";
import NewInvoiceTop from "./NewInvoiceTop";
import NewInvoiceBody from "./NewInvoiceBody";

const AddNewInvoice = () => {
  const [addressType, setAddressType] = useState("billing");
  const [showMoreOpt, setShowMoreOpt] = useState(true);
  const [newRows, setNewRows] = useState([
    {
      id: generateId(),
      item: "",
      description: "",
      quantity: "",
      unitPrice: "",
      discount: "",
      vat: "",
      total: "",
    },
  ]);
  const handleAddNewRow = () => {
    setNewRows((prev) => {
      return [
        ...prev,
        {
          id: generateId(),
          item: "",
          description: "",
          quantity: "",
          unitPrice: "",
          discount: "",
          vat: "",
          total: "",
        },
      ];
    });
  };

  const [newItem, setNewItem] = useState({
    invoiceNumber: "",
    issueDate: "",
    deliveryDate: "",
    dueIn: "",
    client: "",
    paymentMethod: "",
    bankAccount: "",
    orderNumber: "",
    discount: "",
    shipping: "",
    currency: "",
    language: "",
    notes: "Uw inkoop referentie: {{ order.note }}",
  });

  const handleDeleteRow = (id) => {
    setNewRows((prev) => {
      return [...prev.filter((e) => e.id !== id)];
    });
  };

  const handleChangeRow = (id, key, val) => {
    setNewRows((prev) => {
      const changedRowIndex = prev.findIndex((el) => el.id === id);
      prev[changedRowIndex][key] = val;
      return [...prev];
    });
  };

  const handleSetNewItem = (key, val) => {
    setNewItem((prev) => {
      return {
        ...prev,
        [key]: val,
      };
    });
  };

  return (
    <div className="newInvoice">
      <Heading element="h1">New Invoice</Heading>
      <FormLayout>
        <NewInvoiceTop
          invoiceNumber={newItem.invoiceNumber}
          issueDate={newItem.issueDate}
          deliveryDate={newItem.deliveryDate}
          dueIn={newItem.dueIn}
          addressType={addressType}
          client={newItem.client}
          showMore={() => {
            setShowMoreOpt(!showMoreOpt);
          }}
          setAddressType={(v) => {
            setAddressType(v);
          }}
          changeNewItemVal={(key, val) => {
            handleSetNewItem(key, val);
          }}
        />
        <NewInvoiceBody
          showMoreOpt={showMoreOpt}
          paymentMethod={newItem.paymentMethod}
          bankAccount={newItem.bankAccount}
          orderNumber={newItem.orderNumber}
          discount={newItem.discount}
          shipping={newItem.shipping}
          currency={newItem.currency}
          language={newItem.language}
          changeNewItemVal={(key, val) => {
            handleSetNewItem(key, val);
          }}
        />

        <div className="newInvoice__bottom">
          <InvoiceTable
            rows={newRows}
            addNewRow={handleAddNewRow}
            deleteRow={handleDeleteRow}
            changeRow={handleChangeRow}
          />
          <div className="newInvoice-invActions">
            <div className="invActions__left">
              <div className="invActions__input">
                <label>
                  <span>Notes</span>
                  <textarea
                    type="textArea"
                    label="Notes:"
                    value={newItem.notes}
                    onChange={(e) => {
                      handleSetNewItem("notes", e.target.value);
                    }}
                    className="invActions__textArea"
                    placeholder="Uw inkoop referentie: {{ order.note }}"
                  />
                </label>
              </div>
            </div>
            <div className="invActions__right">
              <div className="invActions__btn purple__btn">Save</div>
            </div>
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default AddNewInvoice;
