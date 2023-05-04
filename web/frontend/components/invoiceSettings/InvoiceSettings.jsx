import InvoiceSettingsBody from "./invoiceSettingsBody/InvoiceSettingsBody";
import { Button, Heading } from "@shopify/polaris";
import { useState } from "react";
import "./InvoiceSettings.css";
import SaveButton from "../button/SaveButton";

const InvoiceSettings = () => {
  const [settings, setSettings] = useState({
    dueIn: 14,
    language: "eng",
  });

  return (
    <div className="wrapper invoiceSettings">
      <div className="wrapper__top">
        <Heading element="h1">Invoice Settings</Heading>
      </div>
      <div className="invoiceSettings__info">
        <span>Set default values for your new invoices.</span>
      </div>
      <InvoiceSettingsBody settings={settings} />
      <div className={`invActions__right`}>
        <SaveButton label="Save" />
      </div>
    </div>
  );
};

export default InvoiceSettings;
