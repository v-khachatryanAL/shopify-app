import SaveButton from "../button/SaveButton";
import EmailsContent from "./EmailsContent";
import EmailOptions from "./EmailOptions";
import EmailAdvanced from "./EmailAdvanced";
import { validateEmail } from "../../utils/helpers";
import { useValidation } from "../../hooks/useValidation";
import { useState } from "react";
import { Heading } from "@shopify/checkout-ui-extensions-react";
import { Link } from "@shopify/polaris";
import "./emails.css";

const emailFields = {
  email: "",
  senderEmail: "",
  exportEmail: "",
};

const Emails = () => {
  const [emails, setEmails] = useState({
    invoice: {
      title: "Invoice",
      subject: "Factuur {{ number }} van {{ account.name }}",
      message: "message text",
      auto: false,
      automatically: true,
      autoTitle: "Automatically send invoices when orders are",
      autoTxt:
        "If enabled, a reminder will be sent once the invoice is past its due date and has not been fully paid yet.",
    },
    invoiceReminder: {
      title: "Invoice reminder",
      subject: "Factuur {{ number }} van {{ account.name }}",
      message: "message text",
      auto: false,
      automatically: true,
      autoTitle: "Automatically send reminders for overdue invoices",
      autoTxt:
        "If enabled, a reminder will be sent once the invoice is past its due date and has not been fully paid yet.",
    },
    thank: {
      title: "Thank you note",
      subject: "Factuur {{ number }} van {{ account.name }}",
      message: "message text",
      auto: false,
      automatically: false,
      autoTitle: "Automatically send reminders for overdue invoices",
      autoTxt:
        "If enabled, a reminder will be sent once the invoice is past its due date and has not been fully paid yet.",
    },
    pro: {
      title: "Pro forma invoice",
      subject: "Factuur {{ number }} van {{ account.name }}",
      message: "message text",
      auto: false,
      automatically: false,
      autoTitle: "Automatically send reminders for overdue invoices",
      autoTxt:
        "If enabled, a reminder will be sent once the invoice is past its due date and has not been fully paid yet.",
    },
    credit: {
      title: "Credit note",
      subject: "Factuur {{ number }} van {{ account.name }}",
      message: "message text",
      auto: false,
      automatically: false,
      autoTitle: "Automatically send reminders for overdue invoices",
      autoTxt:
        "If enabled, a reminder will be sent once the invoice is past its due date and has not been fully paid yet.",
    },
  });
  const [emailOptions, setEmailOptions] = useState({
    onlyAddress: false,
    file: "",
    ...emailFields,
  });

  const { setInputErrors, errors, checkValidation } = useValidation({
    initialState: {
      ...emailFields,
    },
  });
  const handleChangeEmails = (key, value, title, variable = "", pos = "") => {
    setEmails((prev) => {
      return {
        ...prev,
        [title]: {
          ...prev[title],
          [key]: variable
            ? `${prev[title][key].substr(0, pos)} {{${value}}} ${prev[title][
                key
              ].substr(pos)} `
            : value,
        },
      };
    });
  };

  const handleChangeAdvanced = (key, value) => {
    setEmailOptions((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleSubmit = () => {
    const isValid = checkValidation(
      Object.keys(emailFields).map((emailField) => {
        return validateEmail(
          emailOptions[emailField],
          setInputErrors,
          emailField
        );
      })
    );
  };

  return (
    <div className="wrapper emails">
      <div className="wrapper__top emails__top">
        <div className="def-container">
          <div className="emails__menu">
            <Heading element="h1">Emails</Heading>
            <div className="emails__nav">
              <Link url="/company">View email history</Link>
              <SaveButton label="Update Settings" onClick={handleSubmit} />
            </div>
          </div>
          <div className="emails__title">
            <span>EMAIL TYPES</span>
          </div>
        </div>
      </div>
      <div className="wrapper__content">
        <div className="def-container">
          <div className="emails__main">
            <EmailsContent emails={emails} changeEmails={handleChangeEmails} />
            <div className="emails-include">
              <div className="include__title">Include links to documents</div>
              <span className="include__txt">
                If you prefer not to send separate emails, you can include links
                to documents in various{" "}
                <a href="">notification emails sent by Shopify,</a>
                or emails sent by third-party apps like
                <a href=""> Klaviyo, Omnisend, Spently, </a> or
                <a href="">Recharge.</a>
              </span>
            </div>
          </div>
          <div className="emails__options">
            <div className="emails__title">
              <span>EMAIL OPTIONS</span>
            </div>
            <EmailOptions
              data={emailOptions}
              changeValue={(field, value) => {
                setEmailOptions((prev) => {
                  return {
                    ...prev,
                    [field]: value,
                  };
                });
              }}
              errors={errors}
              setInputErrors={setInputErrors}
            />
          </div>
          <EmailAdvanced
            errors={errors}
            setInputErrors={setInputErrors}
            data={emailOptions}
            chnageAdvanced={handleChangeAdvanced}
          />
        </div>
      </div>
    </div>
  );
};

export default Emails;
