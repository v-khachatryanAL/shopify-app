import { DataTable, TextField, Button } from "@shopify/polaris";
import DefaultAutocomplete from "../autocomplete/defaultAutocomplete/DefaultAutocomplete";
import DefaultSelectMain from "../select/defaultSelectMain/DefaultSelectMain";
import { React, useState, useEffect } from "react";
import { useAppQuery } from "../../hooks";
import CancelIc from "../../assets/cancel-ic.svg";
import "./table.css";
import { mutationRequest } from "../../hooks/useAppMutation";

const headers = [
  "Item",
  "Description",
  "Quantity",
  "Unit Price",
  "Discount",
  "VAT",
  "Total",
  "",
];

const vatsOptions = [
  {
    label: "21% BE TVA",
    value: "21BETVA",
    count: 21,
  },
  {
    label: "21% BE VAT",
    value: "21BEVAT",
    count: 21,
  },
  {
    label: "0% BTW",
    value: "0",
    count: 0,
  },
  {
    label: "6% BTW",
    value: "6BTW",
    count: 6,
  },
  {
    label: "19% BTW",
    value: "19BTW",
    count: 19,
  },
  {
    label: "21% btw",
    value: "21btw",
    count: 21,
  },
  {
    label: "21% BTW",
    value: "21BTW",
    count: 21,
  },
  {
    label: "21% VAT",
    value: "21VAT",
    count: 21,
  },
];

const NewElemProductTable = ({
  rows,
  addNewRow,
  deleteRow,
  changeRow,
  totalPrice,
  totalPriceVat,
  currency,
  sendNewProduct,
}) => {
  const [validTouch, setValidTouch] = useState([]);
  const [productsOptions, setProductsOptions] = useState([]);
  const [focusedId, setFocusedId] = useState();
  const {
    data: products,
    isSuccess: productsSuccess,
    isLoading: productsLoading,
  } = useAppQuery({
    url: "/api/products.json?title=",
  });

  const { mutate: searchProducts } = mutationRequest(
    "/api/customers/search?first_name=",
    "get",
    "",
    true,
    true,
    {
      onSuccess: (data) => {
        setProductsOptions(
          data.map((e) => {
            return {
              label: e.title,
              value: e.id,
              newVal: false,
            };
          })
        );
      },
    }
  );

  const checkValid = (key, row) => {
    if (key === "inventory_quantity" || key === "price" || key === "title") {
      setValidTouch((prev) => {
        const findIndex = prev.findIndex((el) => el.id === row.id);
        prev[findIndex][key] = true;
        return [...prev];
      });
    }
  };

  useEffect(() => {
    setValidTouch(() => {
      return rows?.map((e) => {
        return {
          id: e.id,
          title: false,
          inventory_quantity: false,
          price: false,
        };
      });
    });
  }, [rows]);

  return (
    <div className="newRow__body">
      <div className="newRow__table">
        <DataTable
          columnContentTypes={[
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
            "numeric",
          ]}
          headings={headers}
          key={rows}
          rows={rows.map((row) => {
            return [
              <div>
                <DefaultAutocomplete
                  deselectedOptions={productsOptions}
                  searching={true}
                  ipValue={row.title}
                  onFocus={() => {
                    setFocusedId(row.id);
                  }}
                  inputChange={(val) => {
                    sendNewProduct(val);
                  }}
                  searchElement={(q) => {
                    searchProducts.mutate({
                      url: `/api/products.json?title=${q}`,
                    });
                  }}
                  loading={
                    focusedId === row.id ? searchProducts.isLoading : false
                  }
                  newVal={true}
                  changeValue={(val) => {
                    const item = searchProducts.data.find((e) => e.id === val);
                    changeRow(row.id, "title", item, val);
                  }}
                />
              </div>,

              <div className="newRow__input">
                <TextField
                  value={row.body_html}
                  onChange={(val) => {
                    changeRow(row.id, "body_html", val);
                  }}
                />
              </div>,
              <div
                className={`${
                  (row.variants[0].inventory_quantity <= 0 ||
                    row.variants[0].inventory_quantity.length < 1) &&
                  validTouch.length &&
                  validTouch.filter((e) => e.id === row.id)?.length &&
                  validTouch.filter((e) => e.id === row.id)[0]
                    .inventory_quantity
                    ? "_error"
                    : ""
                } newRow__input`}
              >
                <TextField
                  // autoComplete
                  type="number"
                  value={row.variants[0].inventory_quantity || ""}
                  onFocus={() => {
                    checkValid("inventory_quantity", row);
                  }}
                  onChange={(val) => {
                    changeRow(row.id, "inventory_quantity", val);
                    checkValid("inventory_quantity", row);
                  }}
                />
              </div>,
              <div
                className={`${
                  (row.variants[0].price <= 0 ||
                    row.variants[0].price.length < 1) &&
                  validTouch.length &&
                  validTouch.filter((e) => e.id === row.id)?.length &&
                  validTouch.filter((e) => e.id === row.id)[0].price
                    ? "_error"
                    : ""
                } newRow__input`}
              >
                <TextField
                  // autoComplete
                  value={row.variants[0].price || ""}
                  onFocus={() => {
                    checkValid("price", row);
                  }}
                  onChange={(val) => {
                    changeRow(row.id, "price", val);
                    checkValid("price", row);
                  }}
                />
              </div>,
              <div className="newRow__input">
                <TextField
                  // autoComplete
                  value={row.discount || ""}
                  onChange={(val) => {
                    changeRow(row.id, "discount", val);
                  }}
                />
              </div>,
              <div>
                <DefaultAutocomplete
                  deselectedOptions={vatsOptions}
                  searching={true}
                  searchElement={() => {}}
                  changeValue={(val) => {
                    changeRow(
                      row.id,
                      "vat",
                      vatsOptions.find((e) => (e = e.value === val)).count
                    );
                  }}
                />
              </div>,
              <div className="newRow__input">
                <TextField disabled value={row.total || ""} />
              </div>,
              <Button
                onClick={() => {
                  deleteRow(row.id);
                }}
              >
                <img src={CancelIc} className="cancel-ic" alt="" />
              </Button>,
            ];
          })}
        />
      </div>
      <div className="newRow__actions">
        <div className="newRow__btn purple__btn" onClick={addNewRow}>
          add new line
        </div>
        <div className="newRow__info">
          <div className="newRow__line">
            <span className="newRow__line-title">Total</span>
            <span>
              {currency}
              {totalPrice.toFixed(2)}
            </span>
          </div>
          {rows
            .filter((row) => !!row.percent)
            .map((row) => {
              return (
                <div key={row.id} className="newRow__line">
                  <span className="newRow__line-title light">
                    VAT (BTW) {row.vat}%
                  </span>
                  <span>
                    {currency}
                    {row.percent.toFixed(2)}
                  </span>
                </div>
              );
            })}
          {rows.filter((e) => e.percent).length ? (
            <div className="newRow__line border">
              <span className="newRow__line-title">Total incl. VAT</span>
              <span>
                {currency}
                {totalPriceVat?.toFixed(2)}
              </span>
            </div>
          ) : (
            ""
          )}

          <div className="newRow__line border">
            <span className="newRow__line-title">Amount Due</span>
            <span>
              {currency}
              {totalPriceVat
                ? totalPriceVat?.toFixed(2)
                : totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewElemProductTable;
