import DefaultToggle from "../defaultToggle/DefaultToggle";
import DefTextfield from "../textfield/defTextField/DefTextfield";
import QuestonSvg from "../Svg/Question";
import { useState } from "react";
import { Icon, Tooltip } from "@shopify/polaris";
import { InfoMinor } from "@shopify/polaris-icons";
import { validateEmail } from "../../utils/helpers";

const tooltipContent = () => {
  return (
    <div className="high-tooltip">
      <div className="high-tooltip__title">EMAIL ADDRESSES</div>
      <div className="high-tooltip__body">
        <p className="high-tooltip__text">
          You can enter multiple email addresses separated by a comma.
        </p>
        <p className="high-tooltip__text">
          Copies can also be sent to different email addresses for specific
          orders, products or customers based on a custom workflow.
        </p>
      </div>
      <a href="" className="high-tooltip__link">
        Contact us to edit your custom workflow
      </a>
    </div>
  );
};

const EmailOptions = ({ data, changeValue, errors, setInputErrors }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="emailOptions settingsTemplate">
      <div className="settingsTemplate__top">
        <div className="settingsTemplate__title">Email copies</div>
      </div>
      <div className="emailOptions__body">
        <div className="emailOptions__line">
          <span className="emailOptions__txt">
            Send copies of all automatic emails to
          </span>
          <DefaultToggle
            value={show}
            onChange={() => {
              setShow(!show);
            }}
          />
        </div>
        <div className={`emailOptions__func ${show ? "_active" : ""}`}>
          <div className="emailOptions__line start">
            <DefTextfield
              width="medium"
              type="email"
              errorMessage={errors.email}
              value={data.email}
              onChange={(value) => {
                changeValue("email", value);
                validateEmail(value, setInputErrors);
              }}
            />
            <Tooltip
              preferredPosition="mostSpace"
              content={tooltipContent()}
              width="wide"
            >
              <div className="companyInfo__tooltip">
                <Icon source={InfoMinor} color="#6d27e7" />
              </div>
            </Tooltip>
          </div>
          <div className="emailOptions__line">
            <span className="emailOptions__txt">
              Send emails only to the address above
            </span>
            <DefaultToggle
              value={data.onlyAddress}
              onChange={(value) => {
                changeValue("onlyAddress", value);
              }}
            />
          </div>
          <div className="emailOptions__line">
            <span className="emailOptions__minTxt">
              If enabled, automatic emails will only be sent to the email
              address above, not to your customers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailOptions;
