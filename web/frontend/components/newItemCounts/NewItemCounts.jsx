import "./newItemCounts.css";

const NewItemCounts = ({
  totalPrice,
  subtotal,
  currency,
  discount,
  totalPriceVat,
  products,
}) => {
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
          {!!Number(discount) ? (
            <li className="itemCounts__item">
              <span>Discount</span>
              <span>
                -{discount}
                {currency}
              </span>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
      {products?.find((el) => el.tax_lines.length) ? (
        <div className="itemCounts__case">
          <ul className="itemCounts__list border">
            {products.filter((e) => e.tax_lines[0]?.rate).length ? (
              <li className="itemCounts__item">
                <span>Total excl. VAT</span>
                <span>
                  {subtotal}
                  {currency}
                </span>
              </li>
            ) : (
              ""
            )}
            {products
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
              })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="itemCounts__case">
        <ul className="itemCounts__list">
          {products?.find((el) => el.tax_lines.length) ? (
            <li className="itemCounts__item bold">
              <span>Total incl. VAT </span>
              <span>
                {totalPriceVat}
                {currency}
              </span>
            </li>
          ) : (
            ""
          )}
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
