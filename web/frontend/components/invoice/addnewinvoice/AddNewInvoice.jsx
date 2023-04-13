import { FormLayout, Heading, Button } from "@shopify/polaris";
import { React, useState, useMemo, useEffect } from "react";
import NewInvoiceTable from "../invoiceTable/NewInvoiceTable";
import { generateId } from "../../../utils/helpers";
import NewInvoiceTop from "./NewInvoiceTop";
import NewInvoiceBody from "./NewInvoiceBody";
import { mutationRequest } from "../../../hooks/useAppMutation";
import moment from "moment";
import axios from "axios";
import { useAppQuery } from "../../../hooks";

const AddNewInvoice = () => {
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [invoicesNumbers, setInvoicesNumbers] = useState([]);
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
    language: "eng",
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
  const { mutate } = mutationRequest("/api/orders/create", "post", "", true);
  const { data: currenciesOptions } = useAppQuery({
    url: "/api/currencies.json",
  });
  const { data: invoices, isSuccess: invoicesSuccess } = useAppQuery({
    url: "/api/orders.json?status=any",
  });

  const handleAddNewRow = () => {
    setNewItem((prev) => {
      return {
        ...prev,
        line_items: [
          ...prev.line_items,
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
      };
    });
  };

  const handleDeleteRow = (id) => {
    if (newItem.line_items.length > 1) {
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
    }
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

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=languages"
        );
        const countries = response.data;
        const languagesTemp = [];
        countries.forEach((e) => {
          let item = null;
          if (Object.entries(e?.languages)[0]) {
            item = {
              type: Object.entries(e?.languages)[0][0],
              label: Object.entries(e?.languages)[0][1],
              value: Object.entries(e?.languages)[0][0],
            };
          }
          if (
            item &&
            !languagesTemp.filter((el) => {
              if (el?.type === item.type) {
                return el;
              }
            }).length
          ) {
            languagesTemp.push(item);
          }
        });
        setLanguages(languagesTemp);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    invoicesSuccess && setInvoicesNumbers(invoices.map((e) => e.number));
  }, [invoicesSuccess]);

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
          invoicesNumbers={invoicesNumbers}
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
          languageOptions={languages}
          currenciesOptions={currenciesOptions}
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
            currency={newItem.currency}
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
