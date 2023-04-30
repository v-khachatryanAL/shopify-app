import { FormLayout, Heading } from "@shopify/polaris";
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
  const [newItem, setNewItem] = useState({
    invoiceNumber: "",
    issueDate: new Date(),
    forInvoiceNumber: "",
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

  const handleAddNewRow = () => {
    setItemProducts((prev) => {
      return [
        ...prev,
        {
          id: generateId(),
          title: "",
          description: "",
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
    // if (key !== "title") {
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
          prev[changedRowIndex] = val;
        } else {
          prev[changedRowIndex] = {
            id: generateId(),
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
    // } else {
    //   setItemProducts((prev) => {
    //     const changedRowIndex = prev.findIndex((el) => el.id === id);
    //   });
    // }

    setNewItem((prev) => {
      return {
        ...prev,
        line_items: [...itemProducts],
      };
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
        <Heading classNames="my-custom-classname" element="h1">
          New Credit Note
        </Heading>
        <FormLayout>
          <NewCreditTop
            issueDate={newItem.issueDate}
            checkErrors={checkClientErrors}
            dueIn={newItem.dueIn}
            creditNumber={newItem.creditNumber}
            fromIssue={newItem.fromIssue}
            invoicesOptions={invoicesOptions}
            invoicesLoading={invoicesLoading}
            forInvoiceNumber={newItem.forInvoiceNumber}
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
            currenciesOptions={currenciesOptions}
            shipping={newItem.shipping}
            currency={newItem.currency}
            language={newItem.language}
            fromIssue={newItem.fromIssue}
            languageOptions={languages}
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
              totalPriceVat={newItem?.totalOrdersVat}
              totalPrice={newItem.totalOrders}
              currency={newItem.currency}
              sendNewProduct={(val) => {}}
            />
          </div>
        </FormLayout>
      </div>
    </div>
  );
};

export default AddNewCredit;
