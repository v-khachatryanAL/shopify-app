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

function InvoiceTable({ rows, addNewRow, deleteRow, changeRow }) {
  const totalCount = useMemo(() => {
    let count = 0;
    rows.forEach((element) => {
      if (element.quantity) count += element.quantity * element.unitPrice;
    });
    return count.toFixed(2);
  }, [rows]);

  return (
    <div className="newRow__body">
      <div className="newRow__table">
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={headers}
          rows={rows.map((row) => {
            const total = row.quantity * row.unitPrice;
            return [
              ...Object.entries(row).map(([key, value]) => {
                return (
                  key !== "id" && (
                    <TextField
                      type={
                        key === "quantity" || key === "unitPrice"
                          ? "number"
                          : "text"
                      }
                      value={key === "total" ? total : value}
                      disabled={key === "total" ? true : false}
                      onChange={(val) => {
                        changeRow(row.id, key, val);
                      }}
                    />
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
}

export default InvoiceTable;
