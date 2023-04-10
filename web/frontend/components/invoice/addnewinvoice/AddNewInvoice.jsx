import {
  FormLayout,
  Heading,
  TextField,
  Autocomplete,
  Button,
} from "@shopify/polaris";
import { React, useState, useMemo } from "react";
import InvoiceTable from "../invoiceTable/InvoiceTable";
import { generateId } from "../../../utils/helpers";
import NewInvoiceTop from "./NewInvoiceTop";
import NewInvoiceBody from "./NewInvoiceBody";
import { mutationRequest } from "../../../hooks/useAppMutation";

const AddNewInvoice = () => {
  const { mutate } = mutationRequest("/api/orders/create", "post", "", true);
  const [addressType, setAddressType] = useState("billing");
  const [showMoreOpt, setShowMoreOpt] = useState(false);
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
    line_items: [
      {
        id: generateId(),
        title: "",
        description: "",
        quantity: "",
        price: "",
        discount: "",
        vat: "",
        total: "",
      },
    ],
    test: true,
    transactions: [
      {
        test: true,
        kind: "authorization",
        status: "success",
        amount: 200,
      },
    ],
  });

  const handleAddNewRow = () => {
    setNewItem((prev) => {
      return {
        ...prev,
        line_items: [
          ...prev.line_items,
          {
            id: generateId(),
            item: "",
            description: "",
            quantity: "",
            price: "",
            discount: "",
            vat: "",
            total: "",
          },
        ],
      };
    });
  };

  const handleDeleteRow = (id) => {
    setNewItem((prev) => {
      prev.line_items = prev.line_items.filter((e) => e.id !== id);
      return {
        ...prev,
      };
    });
  };

  const handleChangeRow = (id, key, val) => {
    setNewItem((prev) => {
      const changedRowIndex = prev.line_items.findIndex((el) => el.id === id);
      prev.line_items[changedRowIndex][key] = val;
      prev.line_items[changedRowIndex].total =
        prev.line_items[changedRowIndex].price *
        prev.line_items[changedRowIndex].quantity;
      return { ...prev };
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

  const formValidation = useMemo(() => {
    let val = true;
    const arr = newItem.line_items.filter((e) => {
      if (e.quantity <= 0 || e.price <= 0 || e.title.length < 1) {
        return e;
      }
    });
    arr.length ? (val = true) : (val = false);
    return val;
  }, [newItem]);

  return (
    <div className="newInvoice">
      <Heading element="h1">New Invoice</Heading>
      <FormLayout>
        <NewInvoiceTop
          invoiceNumber={newItem.invoiceNumber}
          issueDate={newItem.issueDate}
          deliveryDate={newItem.deliveryDate}
          dueIn={newItem.dueIn}
          client={newItem.client}
          showMore={() => {
            setShowMoreOpt(!showMoreOpt);
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
            rows={newItem.line_items}
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
            <div
              className={`${
                formValidation ? "_disable" : ""
              } invActions__right`}
            >
              <Button
                onClick={() => {
                  mutate.mutate({ order: newItem });
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default AddNewInvoice;
