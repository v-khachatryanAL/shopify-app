import { Heading, FormLayout } from "@shopify/polaris";
import { useState, useEffect } from "react";
import NewCreditTop from "./NewCreditTop";
import NewElementBody from "../../NewElementBody";
import NewElemProductTable from "../../newElemProductTable/NewElemProductTable";
import { generateId } from "../../../utils/helpers";
import { useAppQuery } from "../../../hooks";
import moment from "moment";
import axios from "axios";

const AddNewCredit = () => {
  const [showMoreOpt, setShowMoreOpt] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [invoicesOptions, setInvoicesOptions] = useState([]);
  const [currenciesOptions, setCurrenciesOptions] = useState([]);
  const [clientErrors, setClientErrors] = useState(true);
  const [newProduct, setNewProduct] = useState(0);
  const [newItem, setNewItem] = useState({
    invoiceNumber: "",
    issueDate: new Date(),
    forInvoiceNumber: "",
    deliveryDate: new Date(),
    dueIn: 14,
    client: "",
    paymentMethod: "",
    bankAccount: "",
    orderNumber: "",
    discount: "",
    shipping: "",
    currency: "USD",
    language: "eng",
    fromIssue: new Date(),
    notes: "",
    test: true,
    discountType: "$",
    totalOrders: 0,
    creditNumber: "",
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
      variants: [
        {
          id: generateId(),
          created_at: new Date(),
          price: 0,
          inventory_quantity: 0,
        },
      ],
      discount: 0,
      vat: 0,
      total: 0,
    },
  ]);
  const {
    data: invoices,
    isSuccess: invoicesSuccess,
    isLoading: invoicesLoading,
  } = useAppQuery({
    url: "/api/orders.json?status=any",
  });
  const { isSuccess: currenciesSuccess } = useAppQuery({
    url: "/api/currencies.json",
    reactQueryOptions: {
      onSuccess: (data) => {
        setCurrenciesOptions(() => {
          return [
            ...data.map((e) => {
              return {
                value: e.currency,
                label: e.currency,
                symbol: e.currency,
              };
            }),
          ];
        });
      },
    },
  });

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
            variants: [
              {
                price: 0,
                quantity: 0,
                inventory_quantity: 0,
              },
            ],
            price: 0,
            quantity: 0,
            total: 0,
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
      };
    });
  };

  const calculateDiscount = (item, prev, newItem) => {
    if (
      item.variants[0].price >= 0 &&
      item.variants[0].inventory_quantity >= 0
    ) {
      item.total = item.variants[0].price * item.variants[0].inventory_quantity;
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

    if (discount >= 0 && totalPrice > discount && totalPriceVat > discount) {
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

  const checkClientErrors = (val) => {
    setClientErrors(val);
  };

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
    invoicesSuccess &&
      setInvoicesOptions(() => {
        return [
          ...invoices.map((e) => {
            return {
              label: e.number,
              value: e.id,
            };
          }),
        ];
      });
  }, [invoicesSuccess]);

  return (
    <div className="newCredit page-main-papper">
      <div className="newCredit__wrapper">
        <Heading element="h1">New Credit Note</Heading>
        <FormLayout>
          <NewCreditTop
            checkErrors={checkClientErrors}
            issueDate={newItem.issueDate}
            dueIn={newItem.dueIn}
            creditNumber={newItem.creditNumber}
            fromIssue={newItem.fromIssue}
            forInvoiceNumber={newItem.forInvoiceNumber}
            invoicesOptions={invoicesOptions}
            invoicesLoading={invoicesLoading}
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
            data={newItem}
            showMoreOpt={showMoreOpt}
            languageOptions={languages}
            currencies={currenciesOptions}
            changeNewItemVal={(key, val) => {
              handleSetNewItem(key, val);
            }}
          />
          <div className="newCredit__bottom">
            <NewElemProductTable
              rows={itemProducts}
              addNewRow={handleAddNewRow}
              deleteRow={handleDeleteRow}
              changeRow={handleChangeRow}
              newItem={newItem}
              sendNewProduct={(val) => {
                setNewProduct(val);
              }}
            />
          </div>
        </FormLayout>
      </div>
    </div>
  );
};

export default AddNewCredit;
