import { TextField } from "@shopify/polaris";

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

const NewInvoiceTop = ({
  invoiceNumber,
  issueDate,
  deliveryDate,
  dueIn,
  showMore,
  client,
  changeNewItemVal,
}) => {
  return (
    <div className="newInvoice-newInvoiceTop">
      <div className="newInvoiceTop__left newInvoice__paddCase">
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Invoice number:"
            value={invoiceNumber}
            onChange={(val) => {
              changeNewItemVal("invoiceNumber", val);
            }}
            autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            label="Issue date:"
            value={issueDate}
            onChange={(val) => {
              changeNewItemVal("issueDate", val);
            }}
            autoComplete="off"
          />
        </div>
        <div className="newInvoice__input def-input-purple">
          <TextField
            value={deliveryDate}
            label="Delivery date:"
            onChange={(val) => {
              changeNewItemVal("deliveryDate", val);
            }}
          />
        </div>
        <div className="newInvoice__input def-input-purple min">
          <TextField
            value={dueIn}
            label="Due in:"
            onChange={(val) => {
              changeNewItemVal("dueIn", val);
            }}
          />
          <div className="newInvoice__dateArea">
            <span>04/16/2023</span>
          </div>
        </div>
        <div className="newInvoiceTop__lineEnd">
          <div
            className="newInvoiceTop__moreBtn purple__btn"
            onClick={() => {
              showMore();
            }}
          >
            More options
          </div>
        </div>
      </div>
      <div className="newInvoiceTop__right">
        <div className="newInvoice__papper">
          <div className="newInvoice__input def-input-purple max">
            <TextField
              value={client}
              label="Client:"
              onChange={(val) => {
                changeNewItemVal("client", val);
              }}
              autoComplete="on"
            />
          </div>
          {/* <div className="newInvoiceTop__tabs">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NewInvoiceTop;
