import { Button } from "@shopify/polaris";

const PlansCard = ({ item }) => {
  return (
    <div className={`plans-planCard ${item.popular ? "_popular" : ""}`}>
      <div className="planCard__top">
        <div className="planCard__title">{item.type}</div>
        <div className="planCard__info">
          <span className="planCard__symbol">$</span>
          <span className="planCard__price">{item.price}</span>
          <span className="planCard__time">/ Month</span>
        </div>
      </div>
      <div className="planCard__content">
        <div className="planCard__nav">
          <ul className="planCard__list">
            {item.list.map((txt) => {
              return <li className="planCard__item">{txt}</li>;
            })}
          </ul>
        </div>
        <div className="planCard__action">
          <div className="planCard__btn">
            <Button>Choose Plan</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlansCard;
