import { FormLayout, Heading, Button } from "@shopify/polaris";
import { React, useState, useMemo } from "react";
import NewInvoiceTable from "../invoiceTable/NewInvoiceTable";
import { generateId } from "../../../utils/helpers";
import NewInvoiceTop from "./NewInvoiceTop";
import NewInvoiceBody from "./NewInvoiceBody";
import { mutationRequest } from "../../../hooks/useAppMutation";
import moment from "moment";
import axios from "axios";

const AddNewInvoice = () => {
  const { mutate } = mutationRequest("/api/orders/create", "post", "", true);
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [newItem, setNewItem] = useState({
    invoiceNumber: "",
    issueDate: new Date(),
    deliveryDate: new Date(),
    dueIn: "",
    client: "",
    paymentMethod: "",
    bankAccount: "",
    orderNumber: "",
    discount: "",
    shipping: "",
    currency: "e",
    language: "english",
    fromIssue: new Date(),
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
    discountType: "$",
    totalOrders: 0,
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
      let totalPrice = 0;
      prev.line_items = prev.line_items.filter((e) => e.id !== id);
      prev.line_items.forEach((e) => {
        e.total >= 1 ? (totalPrice += e.total) : (totalPrice += 0);
      });
      prev.totalOrders = totalPrice;
      return {
        ...prev,
      };
    });
  };

  const handleChangeRow = (id, key, val) => {
    setNewItem((prev) => {
      const changedRowIndex = prev.line_items.findIndex((el) => el.id === id);
      let totalPrice = 0;
      prev.line_items[changedRowIndex][key] = val;
      if (
        prev.line_items[changedRowIndex].price > 0 &&
        prev.line_items[changedRowIndex].quantity > 0
      ) {
        prev.line_items[changedRowIndex].total =
          prev.line_items[changedRowIndex].price *
          prev.line_items[changedRowIndex].quantity;
      }

      prev.line_items.forEach((e) => {
        e.total >= 1 ? (totalPrice += e.total) : (totalPrice += 0);
      });
      prev.totalOrders = totalPrice;
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

  const handleSetFromIssue = () => {
    setNewItem((prev) => {
      prev.fromIssue = prev.issueDate;
      prev.fromIssue = new Date(
        moment(prev.fromIssue).add(Number(prev.dueIn), "days")
      );
      return {
        ...prev,
      };
    });
  };

  const formValidation = useMemo(() => {
    let val = true;
    const arr = newItem.line_items.filter((e) => {
      if (e.quantity <= 0 || e.price <= 0 || e.title?.length < 1) {
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
          fromIssue={newItem.fromIssue}
          showMore={() => {
            setShowMoreOpt(!showMoreOpt);
          }}
          changeNewItemVal={(key, val) => {
            handleSetNewItem(key, val);
            handleSetFromIssue();
          }}
          changeItemDate={(date, key) => {
            setNewItem((prev) => {
              return {
                ...prev,
                [key]: date,
              };
            });
            handleSetFromIssue();
          }}
        />
        <NewInvoiceBody
          showMoreOpt={showMoreOpt}
          paymentMethod={newItem.paymentMethod}
          bankAccount={newItem.bankAccount}
          orderNumber={newItem.orderNumber}
          discount={newItem.discount}
          discountType={newItem.discountType}
          shipping={newItem.shipping}
          currency={newItem.currency}
          language={newItem.language}
          fromIssue={newItem.fromIssue}
          changeNewItemVal={(key, val) => {
            handleSetNewItem(key, val);
          }}
        />

        <div className="newInvoice__bottom">
          <NewInvoiceTable
            rows={newItem.line_items}
            addNewRow={handleAddNewRow}
            deleteRow={handleDeleteRow}
            changeRow={handleChangeRow}
            totalPrice={newItem.totalOrders}
            currency={newItem.discountType}
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
