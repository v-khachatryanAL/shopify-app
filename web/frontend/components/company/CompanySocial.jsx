import DefTextfield from "../textfield/defTextField/DefTextfield";
import PhoneTextField from "../phoneTextField/PhoneTextField";
import { EMAIL_REGEX } from "../../utils/regex";
import { useState } from "react";

const CompanySocial = ({ company, changeCompany }) => {
  const [erros, setErrors] = useState({
    email: "",
  });

  const checkErrors = (key, value) => {
    if (key === "email") {
      if (!value) {
        setErrors((prev) => {
          changeCompany("email", value, "Required!");
          return {
            ...prev,
            [key]: "Required!",
          };
        });
      } else if (!EMAIL_REGEX.test(value)) {
        setErrors((prev) => {
          changeCompany("email", value, "Email is not valid!");
          return {
            ...prev,
            [key]: "Email is not valid!",
          };
        });
      } else {
        setErrors((prev) => {
          changeCompany("email", value, "");
          return {
            ...prev,
            [key]: "",
          };
        });
      }
    }
  };

  return (
    <div className="company-companyList">
      <DefTextfield
        label="Email:"
        width="medium"
        type="email"
        errorMessage={erros.email}
        disabled={company.visiable}
        minLabel="Emails to your customers will be sent from this address."
        value={company.email}
        className="mark"
        onChange={(value) => {
          checkErrors("email", value);
        }}
      />
      <PhoneTextField
        className="mark"
        disabled={company.visiable}
        value={company.phone}
        onChange={(value, err) => {
          changeCompany("phone", value, err);
        }}
      />
      <DefTextfield
        label="Fax:"
        width="medium"
        type="text"
        disabled={company.visiable}
        value={company.fax}
        onChange={(value) => {
          changeCompany("fax", value);
        }}
      />
      <DefTextfield
        label="Website:"
        width="medium"
        className="mark"
        type="text"
        disabled={company.visiable}
        value={company.website}
        onChange={(value) => {
          changeCompany("website", value);
        }}
      />
      <DefTextfield
        label="Facebook:"
        width="medium"
        type="text"
        disabled={company.visiable}
        value={company.facebook}
        onChange={(value) => {
          changeCompany("facebook", value);
        }}
      />
      <DefTextfield
        label="Twitter:"
        width="medium"
        type="text"
        disabled={company.visiable}
        minLabel="Your contact details will be included in invoice footers."
        value={company.twitter}
        onChange={(value) => {
          changeCompany("twitter", value);
        }}
      />
    </div>
  );
};

export default CompanySocial;
