import DefTextfield from "../textfield/defTextField/DefTextfield";
import { DataTable, Button } from "@shopify/polaris";
import CancelIc from "../../assets/cancel-ic.svg";
import Loading from "../loading";

const headers = ["Tax name", "Rate"];

const TaxRates = ({ rows, changeData, addRow, deleteRow, loading }) => {
  return (
    <div className="taxes-taxRates">
      <div className="taxRates__top">
        <h3 className="taxes__subtitle">TAX RATES</h3>
      </div>
      <div className="taxRates__content">
        {!loading ? (
          <div className="taxRates__table">
            <DataTable
              columnContentTypes={["numeric", "numeric"]}
              headings={headers}
              key={rows}
              rows={rows.map((row) => {
                return [
                  <DefTextfield
                    disabled={typeof row.id === "number" ? true : false}
                    width="min"
                    value={row.tax_name}
                    onChange={(value) => {
                      changeData("tax_name", value, row.id);
                    }}
                  />,
                  <DefTextfield
                    disabled={typeof row.id === "number" ? true : false}
                    width="min"
                    value={typeof row.id === "number" ? row.tax * 100 : row.tax}
                    onChange={(value) => {
                      changeData("tax", value, row.id);
                    }}
                  />,
                  <div
                    className={`taxRates__del ${
                      typeof row.id !== "number" ? "_active" : ""
                    }`}
                  >
                    <Button
                      onClick={() => {
                        deleteRow(row.id);
                      }}
                    >
                      <img src={CancelIc} className="cancel-ic" alt="" />
                    </Button>
                  </div>,
                ];
              })}
            />
          </div>
        ) : (
          <Loading />
        )}
      </div>
      <div className="taxRates__bottom">
        <div className="def-btn">
          <Button onClick={addRow}>Add new tax</Button>
        </div>
        <div className="emails-include">
          <span className="include__txt">
            If you want to change the tax rates in your orders, update the tax
            settings in your Shopify admin.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaxRates;
