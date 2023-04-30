import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "./App.css";
import "./styles/Global.css";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Page name",
                  destination: "/pagename",
                },
                {
                  label: "Invoice",
                  destination: "/invoice",
                },
                {
                  label: "New Invoice",
                  destination: "/invoice/new",
                },
                {
                  label: "New Credit Note",
                  destination: "/credit/new",
                },
                {
                  label: "Detail Invoice",
                  destination: "/invoice/:id",
                },
                {
                  label: "Account & Billing",
                  destination: "/account",
                },
                {
                  label: "Invoice Settings",
                  destination: "/account/invoice",
                },
                {
                  label: "Company Profile",
                  destination: "/account/company",
                },
                {
                  label: "Pick your plan",
                  destination: "/plans",
                },
              ]}
            />
            <Routes pages={pages} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
