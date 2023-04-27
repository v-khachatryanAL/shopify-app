import "./newItemCounts.css";

const NewItemCounts = ({
  totalPrice,
  subtotal,
  currency,
  discount,
  totalPriceVat,
  products,
}) => {
  console.log(products);
  console.log(
    "filter",
    products?.filter((el) => !!el.tax_lines.filter((e) => e.rate).length)
  );
  return (
    <div className="itemCounts__papper">
      <div className="itemCounts__case">
        <ul className="itemCounts__list border">
          <li className="itemCounts__item">
            <span>Subtotal</span>
            <span>
              {totalPrice}
              {currency}
            </span>
          </li>
          <li className="itemCounts__item">
            <span>Discount</span>
            <span>
              -{discount}
              {currency}
            </span>
          </li>
        </ul>
      </div>
      <div className="itemCounts__case">
        <ul className="itemCounts__list border">
          <li className="itemCounts__item">
            <span>Total excl. VAT</span>
            <span>
              {subtotal}
              {currency}
            </span>
          </li>
          {products?.find((el) => el.tax_lines.length)
            ? products
                ?.filter((el) => !!el.tax_lines.filter((e) => e.rate).length)
                .map((e) => {
                  return (
                    <li className="itemCounts__item">
                      <span>
                        {e.tax_lines[0].title}
                        {e.tax_lines[0].rate}%
                      </span>
                      <span>
                        {e.tax_lines[0].price}
                        {currency}
                      </span>
                    </li>
                  );
                })
            : ""}
        </ul>
      </div>
      <div className="itemCounts__case">
        <ul className="itemCounts__list">
          <li className="itemCounts__item bold">
            <span>Total incl. VAT </span>
            <span>
              {totalPriceVat}
              {currency}
            </span>
          </li>
          <li className="itemCounts__item bold end">
            <span>To be paid </span>
            <span>
              {totalPriceVat}
              {currency}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default NewItemCounts;
