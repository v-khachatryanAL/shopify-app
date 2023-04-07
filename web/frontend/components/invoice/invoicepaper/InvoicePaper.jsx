import { Badge, IndexTable } from "@shopify/polaris";
import moment from "moment";
import React, { useEffect, useState } from "react";
import logo from "../../../assets/logoImage.png";
import { useAppQuery } from "../../../hooks";
import { orders } from "../../../utils/constants";
const InvoicePaper = ({ invoiceData }) => {
  const product = invoiceData.line_items;
  const { data, isSuccess } = useAppQuery({
    url: `/api/shop.json`,
  });
  const [shop, setShop] = useState();
  useEffect(() => {
    if (isSuccess) {
      setShop(data[0]);
    }
  }, [isSuccess]);

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const rowMarkup = product?.map(
    ({ id, name, quantity, tax_lines, price_set, price }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell className="product_name">{name}</IndexTable.Cell>
        <IndexTable.Cell>{quantity}</IndexTable.Cell>
        <IndexTable.Cell>
          {tax_lines[0]?.price}
          {price_set?.presentment_money?.currency_code}
        </IndexTable.Cell>
        <IndexTable.Cell>{tax_lines[0]?.rate}%</IndexTable.Cell>
        <IndexTable.Cell>
          {price} {price_set?.presentment_money?.currency_code}
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  return (
    <div className="invoice_paper">
      <div>
        <div className="logo_div">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="invoice_count">
            <span>Invoice</span>
            <span>{invoiceData.order_number}</span>
          </div>
        </div>
        <div className="info_shop">
          <div>
            <span>Shop Name</span>
            <span>{shop?.name}</span>
          </div>
          <div>
            <span> adress</span>
            <span>
              {shop?.address1},{shop?.country}
            </span>
          </div>
          <div>
            <span>City,Zip code</span>
            <span>
              {shop?.city} {shop?.province_code} {shop?.zip}
            </span>
          </div>
        </div>
        <div className="info_shop">
          <div>
            <span>Customer</span>
            <span>{invoiceData?.customer?.default_address?.company}</span>
          </div>
          <div>
            <span>Country</span>
            <span>{invoiceData?.customer?.default_address?.country}</span>
          </div>
          <div>
            <span>Country code</span>
            <span>{invoiceData?.customer?.default_address?.country_code}</span>
          </div>
          <div>
            <span>Date</span>
            <span>{moment(invoiceData?.updated_at).format("MMM DD,YYYY")}</span>
          </div>
        </div>
        <div className="item_detail_span">
          <span className="item_detail">Item Details</span>
          <div className="dataTable">
            <IndexTable
              resourceName={resourceName}
              itemCount={orders.length}
              headings={[
                { title: "Product" },
                { title: "Quantity" },
                { title: "Tax-Presentment money	" },
                { title: "Rate" },
                { title: "Total" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </div>
        </div>
      </div>
      <span className="question_email">
        If you have any questions, please send an email to <b>{shop?.email}</b>
      </span>
    </div>
  );
};

export default InvoicePaper;
