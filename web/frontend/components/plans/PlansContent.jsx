import PlansCard from "./PlansCard";
import BackTo from "../backTo/BackTo";
import { plans } from "../../utils/constants";
import { Heading } from "@shopify/polaris";
import "./PlansContent.css";

const PlansContent = () => {
  return (
    <div className="wrapper plans">
      <BackTo />
      <div className="plans__top">
        <Heading>Pick your plan.</Heading>
        <span className="ligth-txt">
          You can change plan or cancel at any time.
        </span>
        <span className="ligth-txt dark">
          Plans will be charged by Shopify and include a 30-day money back
          guarantee.
        </span>
      </div>
      <div className="plans__contnet">
        <div className="plans__grid">
          {plans.map((item, idx) => {
            return <PlansCard key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default PlansContent;
