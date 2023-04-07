import { useNavigate } from "@shopify/app-bridge-react";
import {
  IndexTable,
  useIndexResourceState,
  Icon,
  Pagination,
} from "@shopify/polaris";
import { TickMinor } from "@shopify/polaris-icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAppQuery } from "../../hooks";
import { customers, invoiceTableHeader } from "../../utils/constants";
import InvoiceSortTable from "./InvoiceSortTable";
import InvoiceTableHeader from "./InvoiceTableHeader";

const Table = () => {
  const navigate = useNavigate();
  const { data, isSuccess, refetch } = useAppQuery({
    url: "/api/orders.json?status=any",
  });
  const [ordersCount, setOrdersCount] = useState({
    paid: 0,
    pending: 0,
    all: 0,
  });
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setOrderData(data);
      const paid = data.filter((elem) => {
        return elem.financial_status === "paid";
      });

      const pending = data.filter((elem) => {
        return elem.financial_status === "pending";
      });
      setOrdersCount({
        paid: paid.length,
        pending: pending.length,
        all: data.length,
      });
    }
  }, [isSuccess, data]);
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orderData);
  const rowMarkup = orderData?.map(
    (
      {
        id,
        order_number,
        financial_status,
        client,
        created_at,
        total_price,
        presentment_currency,
        sent,
        customer,
        status,
      },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={index}
        selected={selectedResources.includes(id)}
        position={id}
        onClick={() => navigate(`/invoice/${id}`)}
      >
        <IndexTable.Cell>
          <span className="number_invoice">{order_number}</span>
        </IndexTable.Cell>
        <IndexTable.Cell className="order_table">
          {financial_status}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {customer?.default_address?.company || "No customer"}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {moment(created_at).format("MMM DD,YYYY")}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {total_price}
          {presentment_currency}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {sent ? <Icon source={TickMinor} /> : ""}
        </IndexTable.Cell>
        <IndexTable.Cell
          className={
            financial_status === "pending"
              ? "status_td"
              : "status_td status_paid"
          }
        >
          <span>{financial_status}</span>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  return (
    <div className="invoice_Table">
      <InvoiceTableHeader />
      <InvoiceSortTable
        setOrderData={setOrderData}
        orderData={orderData}
        ordersCount={ordersCount}
        refetch={refetch}
        selectedResources={selectedResources}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={customers.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={invoiceTableHeader}
      >
        {rowMarkup}
      </IndexTable>
    </div>
  );
};
export default Table;
