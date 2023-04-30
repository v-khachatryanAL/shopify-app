import CompanyBody from "./CompanyBody";
import SaveButton from "../button/SaveButton";
import { Heading } from "@shopify/checkout-ui-extensions-react";
import { useState } from "react";
import { useMemo } from "react";
import "./Company.css";

const Company = () => {
  const [company, setCompany] = useState({
    name: "Company",
    address: "Yerevan",
    city: "",
    zip: "",
    country: "am",
    vatNo: "",
    vatNoChecked: true,
    currency: "USD",
    info: "",
    bankAccount: "",
    visiable: true,
  });
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
  });

  const checkErrors = useMemo(() => {
    return !!Object.values(errors).filter((elem) => elem.length).length;
  }, [errors]);

  const handleSetCompany = (key, value, err = "") => {
    setCompany((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
    setErrors((prev) => {
      return {
        ...prev,
        [key]: err,
      };
    });
  };

  return (
    <div className="wrapper company">
      <div className="wrapper__top">
        <div className="def-container">
          <Heading element="h1">Company Profile</Heading>
        </div>
      </div>
      <div className="wrapper__content">
        <CompanyBody company={company} changeCompany={handleSetCompany} />
      </div>
      <div className="company__bottom">
        <div className="def-container">
          <SaveButton disabled={checkErrors} />
        </div>
      </div>
    </div>
  );
};

export default Company;
