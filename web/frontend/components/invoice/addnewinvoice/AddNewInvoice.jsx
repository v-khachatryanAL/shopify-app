import { FormLayout, Heading, TextField, Autocomplete } from "@shopify/polaris";
import { React, useState } from "react";

const addressTypes = [
  {
    name: "Billing address",
    value: "billing",
  },
  {
    name: "Shipping address",
    value: "shipping",
  },
];

const AddNewInvoice = () => {
  const [addressType, setAddressType] = useState("billing");
  const [showBody, setShowBody] = useState(false);

  return (
    <div className="newInvoice">
      <Heading element="h1">New Invoice</Heading>
      <FormLayout>
        <div className="newInvoice-newInvoiceTop">
          <div className="newInvoiceTop__left newInvoice__paddCase">
            <div className="newInvoice__input">
              <TextField
                label="Invoice number:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
            <div className="newInvoice__input">
              <TextField
                label="Invoice number:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
            <div className="newInvoice__input">
              <TextField
                label="Issue date:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
            <div className="newInvoice__input">
              <TextField label="Delivery date:" onChange={() => {}} />
            </div>
            <div className="newInvoice__input min">
              <TextField label="Due in:" onChange={() => {}} />
              <div className="newInvoice__dateArea">
                <span>04/16/2023</span>
              </div>
            </div>
            <div className="newInvoiceTop__lineEnd">
              <div
                className="newInvoiceTop__moreBtn"
                onClick={() => {
                  setShowBody(!showBody);
                }}
              >
                More options
              </div>
            </div>
          </div>
          <div className="newInvoiceTop__right">
            <div className="newInvoice__papper">
              <div className="newInvoice__input max">
                <TextField
                  label="Client:"
                  onChange={() => {}}
                  autoComplete="off"
                />
              </div>
              <div className="newInvoiceTop__tabs">
                {addressTypes.map((e, index) => {
                  return (
                    <div
                      key={index}
                      className={`newInvoiceTop__tab ${
                        addressType === e.value ? "_active" : "_none"
                      }`}
                      onClick={() => {
                        setAddressType(e.value);
                      }}
                    >
                      {e.name}
                    </div>
                  );
                })}
              </div>
              {/* <div className="newInvoiceTop__another">
                <div className="newInvoice__selectStr">
                  Select another contact
                </div>
                <div>
                  <div className="newInvoice__input-min">
                    <TextField
                      label="Invoice number:"
                      onChange={() => {}}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* showBody */}
        <div
          className={`newInvoice-newInvoiceBody ${showBody ? "_active" : ""}`}
        >
          <div className="newInvoiceBody__left newInvoice__paddCase">
            <div className="newInvoice__input">
              <TextField
                label="Payment method:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
            <div className="newInvoice__input">
              <TextField
                label="Bank account:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
            <div className="newInvoice__input">
              <TextField
                label="Order number:"
                onChange={() => {}}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="newInvoiceBody__right">
            <div className="newInvoice__papper">
              <div className="newInvoice__input start">
                <TextField
                  label="Shipping:"
                  onChange={() => {}}
                  autoComplete="off"
                />
              </div>
              <div className="newInvoice__input start">
                <TextField
                  label="Currency:"
                  onChange={() => {}}
                  autoComplete="off"
                />
              </div>
              <div className="newInvoice__input start">
                <TextField
                  label="Language:"
                  onChange={() => {}}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default AddNewInvoice;
