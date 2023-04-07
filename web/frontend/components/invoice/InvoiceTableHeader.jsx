import { Button, Heading } from "@shopify/polaris";
import React from "react";
import { PlusMinor } from "@shopify/polaris-icons";
import { useNavigate } from "@shopify/app-bridge-react";

const InvoiceTableHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="table_header_invoice">
      <div>
        <Heading element="h1">Invoices</Heading>
        <span>View all of your Invoices.</span>
      </div>
      <Button icon={PlusMinor} onClick={() => navigate("/invoice/new")}>
        Add New
      </Button>
    </div>
  );
};

export default InvoiceTableHeader;
