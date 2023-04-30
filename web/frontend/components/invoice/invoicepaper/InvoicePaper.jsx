import { Badge, IndexTable } from "@shopify/polaris";
import { convertTaxesFrom } from "../../../utils/helpers";
import moment from "moment";
import React, { useEffect, useState } from "react";
import logo from "../../../assets/logoImage.png";
import { useAppQuery } from "../../../hooks";
import NewItemCounts from "../../newItemCounts/NewItemCounts";
import { orders } from "../../../utils/constants";
import Loading from "../../loading";
const InvoicePaper = ({ invoiceData }) => {
  const products = invoiceData.line_items;
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

  const rowMarkup = products?.map((item, index) => (
    <IndexTable.Row id={item.id} key={item.id} position={index}>
      <IndexTable.Cell className="product_name">{item.name}</IndexTable.Cell>
      <IndexTable.Cell>{item.quantity}</IndexTable.Cell>
      <IndexTable.Cell>
        {item?.tax_lines[0]?.price}
        {item?.price_set?.presentment_money?.currency_code}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {item?.tax_lines.length
          ? convertTaxesFrom(
              item,
              invoiceData.total_line_items_price,
              invoiceData.current_total_discounts
            )
          : 0}
        %
      </IndexTable.Cell>
      <IndexTable.Cell>
        {item.discount_allocations[index]?.amount || "-"}
      </IndexTable.Cell>
      <IndexTable.Cell>
        {item.price} {item.price_set?.presentment_money?.currency_code}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

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
                { title: "Discount" },
                { title: "Total" },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </div>
          <div className="item_detail_bottom">
            <div className="item_detail_count">
              {products ? (
                <NewItemCounts
                  products={products}
                  subtotal={invoiceData.subtotal_price}
                  totalPrice={invoiceData.total_line_items_price}
                  totalPriceVat={invoiceData.current_total_price}
                  currency={invoiceData.currency}
                  discount={invoiceData.current_total_discounts}
                />
              ) : (
                <div className="item_detail_count_load">
                  <Loading />
                </div>
              )}
            </div>
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
