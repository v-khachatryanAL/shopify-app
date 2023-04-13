import { DataTable, TextField, Button } from "@shopify/polaris";
import { React, useState, useEffect, useMemo } from "react";
import CancelIc from "../../../assets/cancel-ic.svg";

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

const NewInvoiceTable = ({
  rows,
  addNewRow,
  deleteRow,
  changeRow,
  totalPrice,
  currency,
}) => {
  const [validTouch, setValidTouch] = useState([]);

  useEffect(() => {
    setValidTouch(() => {
      return rows?.map((e) => {
        return {
          id: e.id,
          title: false,
          quantity: false,
          price: false,
        };
      });
    });
  }, [rows]);

  const checkValid = (key, row) => {
    if (key === "quantity" || key === "price" || key === "title") {
      setValidTouch((prev) => {
        const findIndex = prev.findIndex((el) => el.id === row.id);
        prev[findIndex][key] = true;
        return [...prev];
      });
    }
  };
  return (
    <div className="newRow__body">
      <div className="newRow__table">
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={headers}
          rows={rows.map((row) => {
            return [
              ...Object.entries(row).map(([key, value], index) => {
                return (
                  key !== "id" && (
                    <div
                      key={index}
                      className={`${
                        (value <= 0 || value.length < 1) &&
                        validTouch.length &&
                        validTouch?.filter((e) => e.id === row.id).length &&
                        validTouch?.filter((e) => e.id === row.id)[0][key]
                          ? "_error"
                          : ""
                      } newRow__input`}
                    >
                      <TextField
                        type={
                          key === "quantity" || key === "price"
                            ? "number"
                            : "text"
                        }
                        autoComplete
                        value={value}
                        onFocus={() => {
                          checkValid(key, row);
                        }}
                        disabled={key === "total" ? true : false}
                        onChange={(val) => {
                          changeRow(row.id, key, val);
                          checkValid(key, row);
                        }}
                      />
                    </div>
                  )
                );
              }),
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
          <div className="newRow__line">
            <span className="newRow__line-title">Amount Due</span>
            <span>
              {currency}
              {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceTable;
