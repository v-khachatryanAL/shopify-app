import { FormLayout, Heading, Button } from "@shopify/polaris";
import { React, useState, useMemo, useEffect } from "react";
import NewElemProductTable from "../../newElemProductTable/NewElemProductTable";
import { generateId } from "../../../utils/helpers";
import NewInvoiceTop from "./NewInvoiceTop";
import NewElementBody from "../../NewElementBody";
import { mutationRequest } from "../../../hooks/useAppMutation";
import moment from "moment";
import axios from "axios";
import { useAppQuery } from "../../../hooks";

const AddNewInvoice = () => {
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [invoicesNumbers, setInvoicesNumbers] = useState([]);
  const [newClient, setNewClient] = useState(0);
  const [newProduct, setNewProduct] = useState(0);
  const [currenciesOptions, setCurrenciesOptions] = useState([]);
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
    currency: "USD",
    language: "eng",
    fromIssue: new Date(),
    totalOrdersVat: 0,
    notes: "",
    line_items: [],
    test: true,
    discountType: "USD",
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
  const [itemProducts, setItemProducts] = useState([
    {
      id: generateId(),
      title: "",
      description: "",
      price: "",
      quantity: "",
      variants: [
        {
          id: generateId(),
          created_at: new Date(),
          price: 0,
          inventory_quantity: 0,
        },
      ],
      discount: "",
      vat: "",
      total: "",
    },
  ]);
  const { mutate: newInvoice, isSuccess: newInvoiceSuccess } = mutationRequest(
    "/api/orders/create",
    "post",
    "",
    true
  );
  const { mutate: newCustomer } = mutationRequest(
    "/api/customers/create",
    "post",
    "",
    true
  );
  // const { data: currenciesOptions } = useAppQuery({
  //   url: "/api/currencies.json",
  // });
  const { data: invoices, isSuccess: invoicesSuccess } = useAppQuery({
    url: "/api/orders.json?status=any",
  });

  const handleAddNewRow = () => {
    setItemProducts((prev) => {
      return [
        ...prev,
        {
          id: generateId(),
          title: "",
          body_html: "",
          price: "",
          quantity: "",
          variants: [
            {
              id: generateId(),
              created_at: new Date(),
              price: "",
              inventory_quantity: "",
            },
          ],
          discount: "",
          vat: "",
          total: "",
        },
      ];
    });
  };

  const handleDeleteRow = (id) => {
    if (itemProducts.length > 1) {
      setItemProducts((prev) => {
        let totalPrice = 0;
        prev = prev.filter((e) => e.id !== id);
        prev.forEach((e) => {
          e.total >= 1 ? (totalPrice += e.total) : (totalPrice += 0);
        });
        setNewItem((prev) => {
          return {
            ...prev,
            totalOrders: totalPrice,
          };
        });
        return [...prev];
      });
    }
  };
  const handleChangeRow = (id, key, val, inputTxt = "") => {
    setItemProducts((prev) => {
      const changedRowIndex = prev.findIndex((el) => el.id === id);
      let totalPrice = 0;
      let totalPriceVat = 0;
      if (key !== "title") {
        if (key === "inventory_quantity" || key === "price") {
          key === "inventory_quantity"
            ? (prev[changedRowIndex].quantity = val)
            : (prev[changedRowIndex].price = val);
          prev[changedRowIndex].variants[0][key] = val;
        } else {
          prev[changedRowIndex][key] = val;
        }
      } else {
        if (val) {
          prev[changedRowIndex] = { ...val, id: val.id };
        } else {
          const elId = generateId();
          prev[changedRowIndex] = {
            id: elId,
            body_html: "",
            variants: [
              {
                id: generateId(),
                created_at: new Date(),
                price: "",
                inventory_quantity: "",
              },
            ],
            discount: "",
            vat: "",
            total: "",
            title: inputTxt,
          };
        }
      }
      if (
        prev[changedRowIndex].variants[0].price >= 0 &&
        prev[changedRowIndex].variants[0].inventory_quantity >= 0
      ) {
        prev[changedRowIndex].total =
          prev[changedRowIndex].variants[0].price *
          prev[changedRowIndex].variants[0].inventory_quantity;
        prev[changedRowIndex].percent =
          (prev[changedRowIndex].total / 100) * prev[changedRowIndex].vat;
      }
      prev.forEach((e) => {
        if (e.total >= 1) {
          totalPrice += e.total;
          if (e.percent) {
            totalPriceVat += e.total + (e.percent || 0);
          } else {
            totalPriceVat += 0;
          }
        } else {
          totalPrice += 0;
          totalPriceVat += 0;
        }
      });

      setNewItem((prev) => {
        return {
          ...prev,
          totalOrders: totalPrice,
          totalOrdersVat: totalPriceVat,
        };
      });

      return [...prev];
    });

    setNewItem((prev) => {
      return {
        ...prev,
        line_items: [...itemProducts],
      };
    });
  };

  const handleSubmit = () => {
    const lineItems = newItem.line_items.map((e) => {
      return {
        ...e,
        price: e.variants[0].price,
      };
    });
    console.log({
      lineItems,
    });
    // newInvoice.mutate({
    //   body: {
    //     order: {
    //       ...newItem,
    //       line_items: lineItems,
    //     },
    //   },
    // });
    console.log({ newItem });
    newCustomer.mutate({
      body: {
        email: "test@gmailTEST2.com",
        ...newItem.customer,
      },
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
      if (prev.dueIn > 0) {
        prev.fromIssue = new Date(
          moment(prev.fromIssue).add(Number(prev.dueIn), "days")
        );
      }
      return {
        ...prev,
      };
    });
  };

  const formValidation = useMemo(() => {
    const arr = itemProducts.filter((e) => {
      if (
        e.variants[0].inventory_quantity <= 0 ||
        e.variants[0].price <= 0 ||
        e.title?.length < 1
      ) {
        return e;
      }
    });

    return !!arr.length;
  }, [itemProducts]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://www.wixapis.com/currency_converter/v1/currencies"
        );
        if (response.ok) {
          const data = await response.json();
          setCurrenciesOptions([
            ...data.currencies.map((e) => {
              return {
                value: e.code,
                label: e.code,
                symbol: e.symbol,
              };
            }),
          ]);
        } else {
          throw new Error(
            `Failed to fetch currencies. Status: ${response.status}`
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

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
    <div
      className={`newInvoice page-main-papper ${newClient ? "newClient" : ""} ${
        newProduct ? "newProduct" : ""
      }`}
    >
      <div className="newInvoice__wrapper">
        <Heading element="h1">New Invoice</Heading>
        <FormLayout>
          <NewInvoiceTop
            sendClient={(client) => {
              setNewItem((prev) => {
                return {
                  ...prev,
                  customer: { ...client },
                };
              });
            }}
            clientSearch={(val) => {
              setNewClient(val);
            }}
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
          <NewElementBody
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
            <NewElemProductTable
              rows={itemProducts}
              addNewRow={handleAddNewRow}
              deleteRow={handleDeleteRow}
              changeRow={handleChangeRow}
              totalPrice={newItem.totalOrders}
              currency={newItem.currency}
              totalPriceVat={newItem?.totalOrdersVat}
              sendNewProduct={(val) => {
                setNewProduct(val);
              }}
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
                    />
                  </label>
                </div>
              </div>
              <div
                className={`${
                  !formValidation ? "_disable" : ""
                } invActions__right`}
              >
                <Button onClick={handleSubmit}>Save</Button>
              </div>
            </div>
          </div>
        </FormLayout>
      </div>
    </div>
  );
};

export default AddNewInvoice;
