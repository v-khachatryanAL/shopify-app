import { React, useState, useMemo, useEffect } from "react";
import { useNavigate } from "@shopify/app-bridge-react";
import { FormLayout, Heading, Button, Spinner } from "@shopify/polaris";
import NewElemProductTable from "../../newElemProductTable/NewElemProductTable";
import NewInvoiceTop from "./NewInvoiceTop";
import NewElementBody from "../../NewElementBody";
import { mutationRequest } from "../../../hooks/useAppMutation";
import { useAppQuery } from "../../../hooks";
import { generateId } from "../../../utils/helpers";
import moment from "moment";
import axios from "axios";

const AddNewInvoice = () => {
  const navigate = useNavigate();
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [clientErrors, setClientErrors] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [invoicesNumbers, setInvoicesNumbers] = useState([]);
  const [newClient, setNewClient] = useState(0);
  const [newProduct, setNewProduct] = useState(0);
  const [newItem, setNewItem] = useState({
    number: "",
    issueDate: new Date(),
    deliveryDate: new Date(),
    dueIn: 14,
    client: "",
    paymentMethod: "",
    bankAccount: "",
    orderNumber: "",
    discount: 0,
    shipping: "",
    currency: "USD",
    language: "eng",
    fromIssue: new Date().setDate(new Date().getDate() + 14),
    totalOrdersVat: 0,
    subTotal: 0,
    notes: "Uw inkoop referentie: {{ order.note }}",
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
      percent: 0,
      variants: [
        {
          id: generateId(),
          created_at: new Date(),
          price: 0,
          inventory_quantity: 0,
        },
      ],
      tax_lines: [],
      discount: "",
      vat: "",
      total: 0,
    },
  ]);

  const { data: invoices, isSuccess: invoicesSuccess } = useAppQuery({
    url: "/api/orders.json?status=any",
    reactQueryOptions: {
      onSuccess: (data) => {
        setNewItem((prev) => {
          return {
            ...prev,
            number: data[0].number + 1,
          };
        });
      },
    },
  });
  const { mutate: newInvoice, isLoading: newInvoiceLoading } = mutationRequest(
    "/api/orders/create.json",
    "post",
    "",
    true,
    true,
    {
      onSuccess: (data) => {
        handleNavigate(data);
      },
    }
  );
  const { mutate: createNewCustomer } = mutationRequest(
    "/api/customers/create",
    "post",
    "",
    true
  );
  const { mutate: editCustomer } = mutationRequest(
    "/api/customers/update",
    "put",
    "",
    true
  );
  const { mutate: createNewProduct } = mutationRequest(
    "/api/products/create",
    "post",
    "",
    true
  );
  const { mutate: editProduct } = mutationRequest(
    "/api/products/update",
    "put",
    "",
    true
  );

  const handleNavigate = (data) => {
    navigate(`/invoice/${data.id}`);
  };

  const checkClientErrors = (val) => {
    setClientErrors(val);
  };

  const handleCountTotal = (itemProducts, disc, discountType) => {
    const discount = Number(disc);
    let totalPrice = 0;
    let subTotal = 0;
    let totalPriceVat = 0;

    itemProducts.forEach((e) => {
      if (e.total) {
        subTotal += e.total;
        totalPrice += e.total;
        totalPriceVat += e.total + e.percent;
      }
    });

    if (
      discount >= 0 &&
      // discountType !== "%" &&
      totalPrice > discount &&
      totalPriceVat > discount
    ) {
      totalPrice -= discount;
      totalPriceVat -= discount;
    } else if (discount >= 0 && totalPrice && totalPrice > 0) {
      totalPrice -= (totalPrice / 100) * discount;
      totalPriceVat -= (totalPriceVat / 100) * discount;
    }

    setNewItem((prev) => {
      return {
        ...prev,
        totalOrders: totalPrice,
        totalOrdersVat: totalPriceVat,
        subTotal: subTotal,
      };
    });
  };

  const handleAddNewRow = () => {
    setItemProducts((prev) => {
      return [
        ...prev,
        {
          id: generateId(),
          title: "",
          body_html: "",
          price: 0,
          quantity: 0,
          variants: [
            {
              id: generateId(),
              created_at: new Date(),
              price: 0,
              inventory_quantity: 0,
            },
          ],
          tax_lines: [],
          discount: 0,
          vat: 0,
          total: 0,
        },
      ];
    });
  };

  const handleDeleteRow = (id) => {
    let totalPrice = 0;
    const filteredData = itemProducts.filter((e) => e.id !== id);
    filteredData.forEach((e) => {
      e.total >= 1 ? (totalPrice += e.total) : (totalPrice += 0);
    });

    setNewItem((prev) => {
      return {
        ...prev,
        totalOrders: totalPrice,
      };
    });

    if (itemProducts.length > 1) {
      setItemProducts();
    }
    let data;

    filteredData.forEach((item) => {
      data = calculateDiscount(item, filteredData, newItem);
    });
    setItemProducts(data);
    handleCountTotal(data, newItem.discount, newItem.discountType);
  };

  const handleChangeRow = (id, key, val, inputTxt = "") => {
    setItemProducts((prev) => {
      const changedRowIndex = prev.findIndex((el) => el.id === id);
      if (key !== "title") {
        if (key === "inventory_quantity" || key === "price") {
          key === "inventory_quantity"
            ? (prev[changedRowIndex].quantity = Number(val))
            : (prev[changedRowIndex].price = Number(val));
          prev[changedRowIndex].variants[0][key] = Number(val);
        } else {
          if (key === "vat") {
            prev[changedRowIndex][key] = val.count;
            prev[changedRowIndex].vatName = val.label;
            prev[changedRowIndex].tax_lines = [
              ...prev[changedRowIndex]?.tax_lines,
              {
                price: prev[changedRowIndex].percent,
                rate: val.count,
                title: val.label,
              },
            ];
          } else {
            prev[changedRowIndex][key] = val;
          }
        }
      } else {
        if (val) {
          prev[changedRowIndex] = {
            ...val,
            id: val.id,
            quantity: Number(val.variants[0].inventory_quantity),
            price: Number(val.variants[0].price),
            tax_lines: val.tax_lines ? [...val.tax_lines] : [],
            discount: 0,
            vat: 0,
          };
        } else {
          const elId = generateId();
          prev[changedRowIndex] = {
            ...prev[changedRowIndex],
            id: elId,
            tax_lines: [],
            title: inputTxt,
          };
          if (key === "vat") {
            prev[changedRowIndex].tax_lines = [
              {
                price: prev[changedRowIndex].percent,
                rate: val.count,
                title: val.label,
              },
            ];
          }
        }
      }
      prev = calculateDiscount(prev[changedRowIndex], prev, newItem);
      handleCountTotal(prev, newItem.discount);
      console.log({ prev });
      return JSON.parse(JSON.stringify(prev));
    });
    setNewItem((prev) => {
      return {
        ...prev,
        line_items: [
          ...itemProducts.map((el) => {
            return {
              ...el,
              total_discount: el.discount,
            };
          }),
        ],
        // discount: itemProducts[0].discount,
      };
    });
  };

  const calculateDiscount = (item, prev, newItem) => {
    if (
      item.variants[0].price >= 0 &&
      item.variants[0].inventory_quantity >= 0
    ) {
      // if (prev.filter((e) => e.total).length <= 1) {
      item.total = item.variants[0].price * item.variants[0].inventory_quantity;
      // }
      if (item.total > 0 && item.discount < item.total) {
        item.total -= item.quantity * item.discount;
      }
      if (!newItem.discount) {
        item.percent = (item.total * item.vat) / 100;
      } else {
        const summary = prev.reduce((agg, item) => {
          return agg + item.total;
        }, 0);
        const convertedData = prev.map((elem) => {
          const usdDiscount =
            newItem.discountType !== "%"
              ? newItem.discount
              : summary * (newItem.discount / 100);
          const percent =
            ((elem.total - (elem.total / summary) * usdDiscount) * elem.vat) /
            100;
          return {
            ...elem,
            percent,
            tax_lines: [
              {
                ...elem.tax_lines[0],
                price: percent,
                rate: (100 / elem.total) * percent,
              },
            ],
          };
        });
        prev = [...convertedData];
      }
    }

    return prev;
  };

  const handleSubmit = () => {
    console.log("aa itemProducts", itemProducts);
    const lineItems = itemProducts.map((e) => {
      return {
        ...e,
        price: e.variants[0].price,
      };
    });
    console.log({ lineItems });
    const { changedProducts, newProducts } = lineItems.reduce(
      (agg, e) => {
        if (e) {
          if (typeof e.id === "number") {
            agg.changedProducts.push(e);
          } else {
            agg.newProducts.push(e);
          }
        }
        return agg;
      },
      {
        changedProducts: [],
        newProducts: [],
      }
    );

    if (changedProducts.length) {
      changedProducts.forEach((e) => {
        editProduct.mutate({
          url: `/api/products/${e.id}`,
          body: {
            product: {
              ...e,
            },
          },
        });
      });
    }
    if (newProducts.length) {
      createNewProduct.mutate({
        body: {
          products: newProducts,
        },
      });
    }

    if (newClient) {
      createNewCustomer.mutate({
        url: `/api/customers/create`,
        body: {
          ...newItem.customer,
          addresses: [
            {
              ...newItem.customer.default_address,
            },
          ],
        },
      });
    } else {
      editCustomer.mutate({
        url: `/api/customers/${newItem.customer.id}`,
        body: {
          customer: {
            ...newItem.customer,
          },
        },
      });
    }
    newInvoice.mutate({
      body: {
        order: {
          ...newItem,
          line_items: lineItems,
        },
      },
    });
  };

  console.log({ itemProducts });

  const handleSetNewItem = (key, val) => {
    const discountNewItem = {
      ...newItem,
      [key]: val,
    };

    setNewItem(discountNewItem);
    let data = [];
    const copyItemProducts = [...itemProducts];

    itemProducts.forEach((item) => {
      data = calculateDiscount(item, copyItemProducts, discountNewItem);
    });
    if (key === "discount") {
      handleCountTotal(data, val, newItem.discountType);
    } else if (key === "discountType") {
      handleCountTotal(data, newItem.discount, val);
    }
    setItemProducts(data);
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
            checkErrors={checkClientErrors}
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
            invoiceNumber={newItem.number}
            issueDate={newItem.issueDate}
            deliveryDate={newItem.deliveryDate}
            dueIn={newItem.dueIn}
            client={newItem.client}
            fromIssue={newItem.fromIssue}
            invoicesNumbers={invoicesNumbers}
            showMore={() => {
              setShowMoreOpt(!showMoreOpt);
            }}
            show={showMoreOpt}
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
            changeNewItemVal={(key, val) => {
              handleSetNewItem(key, val);
            }}
          />
          <div className="newInvoice__bottom">
            <NewElemProductTable
              rows={itemProducts}
              addNewRow={handleAddNewRow}
              deleteRow={handleDeleteRow}
              subTotal={newItem.subTotal}
              changeRow={handleChangeRow}
              totalPrice={newItem.totalOrders || 0}
              currency={newItem.currency}
              totalPriceVat={newItem?.totalOrdersVat}
              discount={newItem.discount}
              discountType={newItem.discountType}
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
                  formValidation || clientErrors ? "_disable" : ""
                } invActions__right`}
              >
                <Button onClick={handleSubmit}>
                  {!newInvoiceLoading ? "Save" : <Spinner size="small" />}
                </Button>
              </div>
            </div>
          </div>
        </FormLayout>
      </div>
    </div>
  );
};

export default AddNewInvoice;
