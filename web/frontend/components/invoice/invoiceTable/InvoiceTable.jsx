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

const InvoiceTable = ({ rows, addNewRow, deleteRow, changeRow }) => {
  const [validTouch, setValidTouch] = useState({});

  const totalCount = useMemo(() => {
    let count = 0;
    rows.forEach((element) => {
      if (element.quantity) count += element.quantity * element.unitPrice;
    });
    return count.toFixed(2);
  }, [rows]);

  useEffect(() => {
    setValidTouch(() => {
      return rows.map((e) => {
        return {
          id: e.id,
          quantity: false,
          price: false,
        };
      });
    });
  }, [rows]);

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
                        validTouch.filter((e) => e.id === row.id)[0][key]
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
                        value={value}
                        disabled={key === "total" ? true : false}
                        onChange={(val) => {
                          changeRow(row.id, key, val);
                        }}
                        onFocus={() => {
                          if (
                            key === "quantity" ||
                            key === "price" ||
                            key === "title"
                          ) {
                            setValidTouch((prev) => {
                              const findIndex = prev.findIndex(
                                (el) => el.id === row.id
                              );
                              prev[findIndex][key] = true;
                              return [...prev];
                            });
                          }
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
            <span>Total</span>
            <span>L{totalCount}</span>
          </div>
          <div className="newRow__line">
            <span>Amount Due</span>
            <span>L0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
