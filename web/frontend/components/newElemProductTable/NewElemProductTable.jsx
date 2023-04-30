import { DataTable, TextField, Button } from "@shopify/polaris";
import DefaultAutocomplete from "../autocomplete/defaultAutocomplete/DefaultAutocomplete";
import { React, useState, useEffect } from "react";
import CancelIc from "../../assets/cancel-ic.svg";
import "./table.css";
import { mutationRequest } from "../../hooks/useAppMutation";
import { useAppQuery } from "../../hooks";

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

const NewElemProductTable = ({
  rows,
  addNewRow,
  deleteRow,
  changeRow,
  totalPrice,
  totalPriceVat,
  currency,
  subTotal,
  discount,
  discountType,
  sendNewProduct,
}) => {
  const [validTouch, setValidTouch] = useState([]);
  const [productsOptions, setProductsOptions] = useState([]);
  const [vatsOptions, setVatsOptions] = useState([]);
  const [focusedId, setFocusedId] = useState();
  const { isLoading: countriesLoading } = useAppQuery({
    url: "/api/countries.json",
    reactQueryOptions: {
      onSuccess: (data) => {
        setVatsOptions(() => {
          return [
            ...data.map((e, index) => {
              const percent = e.tax * 100;
              return {
                key: index,
                label: `${percent} % ${e.tax_name}`,
                value: `${percent} % ${e.tax_name}`,
                count: percent,
              };
            }),
          ];
        });
      },
    },
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
      onLoading: ({ loading }) => {
        if (loading) {
          setProductsOptions([]);
        }
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
                    const item = searchProducts?.data?.find((e) => e.id === q);
                    changeRow(row.id, "title", item, q);

                    searchProducts.mutate({
                      url: `/api/products.json?title=${q}`,
                    });
                  }}
                  loading={
                    focusedId === row.id ? searchProducts.isLoading : false
                  }
                  newVal={true}
                  changeValue={(val) => {
                    const item = searchProducts?.data?.find(
                      (e) => e.id === val
                    );
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
                  row.variants[0].inventory_quantity < 1 &&
                  validTouch.length &&
                  validTouch.filter((e) => e.id === row.id)?.length &&
                  validTouch.filter((e) => e.id === row.id)[0]
                    .inventory_quantity
                    ? "_error"
                    : ""
                } newRow__input`}
              >
                <TextField
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
                  row.variants[0].price < 1 &&
                  validTouch.length &&
                  validTouch.filter((e) => e.id === row.id)?.length &&
                  validTouch.filter((e) => e.id === row.id)[0].price
                    ? "_error"
                    : ""
                } newRow__input`}
              >
                <TextField
                  type="number"
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
                  type="number"
                  value={row.discount || ""}
                  onChange={(val) => {
                    changeRow(row.id, "discount", val);
                  }}
                />
              </div>,
              <div>
                <DefaultAutocomplete
                  className="vat-autocomplete"
                  deselectedOptions={vatsOptions}
                  ipValue={row.vatName}
                  staticData={true}
                  loading={countriesLoading}
                  inputChange={() => {}}
                  searchElement={() => {}}
                  changeValue={(val) => {
                    changeRow(
                      row.id,
                      "vat",
                      vatsOptions.find((e) => (e = e.value === val))
                    );
                  }}
                  onFocus={() => {
                    setFocusedId(row.id);
                  }}
                />
              </div>,
              <div className="newRow__input">
                <TextField disabled value={row.total.toFixed(2) || ""} />
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
          {discount ? (
            <>
              <div className="newRow__line">
                <span className="newRow__line-txt">SubTotal</span>
                <span>
                  {currency}
                  {Number(subTotal).toFixed(2)}
                </span>
              </div>
              <div className="newRow__line">
                <span className="newRow__line-txt">Discount</span>
                <span>
                  -{discountType !== "%" ? currency : "%"}
                  {Number(discount).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            ""
          )}

          <div className="newRow__line">
            <span className="newRow__line-txt">
              {rows.find((row) => !!row.percent) ? "Total excl. VAT" : "Total"}
            </span>
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
          {rows.find((row) => !!row.percent) ? (
            <div className="newRow__line border">
              <span className="newRow__line-title">Total incl. VAT</span>
              <span>
                {currency}
                {totalPriceVat.toFixed(2)}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default NewElemProductTable;
