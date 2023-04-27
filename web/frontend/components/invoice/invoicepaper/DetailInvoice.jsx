import { Button } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppQuery } from "../../../hooks";
import InvoicePaper from "./InvoicePaper";
const DetailInvoice = () => {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState({});
  const { data, isSuccess, refetch } = useAppQuery({
    url: `/api/orders/${id}.json`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setInvoiceData(data);
      },
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setInvoiceData(data);
    }
  }, [isSuccess]);

  return (
    <div className="detail_div">
      <div className="detail_invoice">
        <span className="header">Invoice {invoiceData?.order_number}</span>
        <span className="status">
          {invoiceData?.financial_status?.toUpperCase()}
        </span>
      </div>
      <div>
        {/* {detailMoreAction.map((item) => {
          return (
            <Button key={item.id} icon={item.icon}>
              {item.content}
            </Button>
          );
        })} */}
      </div>
      <InvoicePaper invoiceData={invoiceData} />
    </div>
  );
};

export default DetailInvoice;
