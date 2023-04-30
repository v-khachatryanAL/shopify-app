import { useNavigate } from "@shopify/app-bridge-react";
import { Button, Heading } from "@shopify/polaris";
import moment from "moment";
import { useAppQuery } from "../../hooks";
import Loading from "../loading";
import "./AccountBody.css";

const AccountBody = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useAppQuery({
    url: `/api/shop.json`,
  });
  const handleNavigate = () => {
    navigate(`/plans`);
  };

  return (
    <div className="wrapper accountBody">
      <div className="wrapper__top">
        <Heading element="h1">Account & Billing</Heading>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="accountBody__content">
          <div className="accountBody__list">
            <div className="accountBody__action">
              <div className="accountBody-infoLine">
                <span className="infoLine__title">Current Plan:</span>
                <span className="infoLine__txt">
                  {data[0].plan_display_name}
                </span>
              </div>
              <Button onClick={handleNavigate}>CHANGE PLAN</Button>
            </div>
            <div className="accountBody-infoLine">
              <span className="infoLine__title">Connected Store:</span>
              <span className="infoLine__txt">{data[0].domain}</span>
            </div>
            <div className="accountBody-infoLine">
              <span className="infoLine__title">Account Created:</span>
              <span className="infoLine__txt">
                {moment(data[0].created_at).format("MMM. DD, YYYY")}
              </span>
            </div>
            <div className="accountBody-infoLine">
              <span className="infoLine__title">Support PIN:</span>
              <span className="infoLine__txt">{data[0].zip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBody;
