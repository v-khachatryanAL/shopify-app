import { Heading } from "@shopify/checkout-ui-extensions-react";
import EmHistoryTable from "./EmHistoryTable";
import "./emailHistory.css";

const EmailsHistory = () => {
  return (
    <div className="wrapper emailsHistory">
      <div className="wrapper__top emailsHistory__top">
        <Heading element="h1">Email History</Heading>
      </div>
      <div className="wrapper__content emailsHistory__content">
        <EmHistoryTable />
      </div>
    </div>
  );
};

export default EmailsHistory;
