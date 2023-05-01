import InvoiceSelectMain from "../select/defaultSelectMain/DefaultSelectMain";
import DefaultToggle from "../defaultToggle/DefaultToggle";
import { DropdownMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import "./settingsTemplate.css";

const varOptions = [
  {
    label: "Invoice number",
    value: "number",
  },
  {
    label: "Link to online version",
    value: "link",
  },
  {
    label: "Invoice amount",
    value: "amount",
  },
  {
    label: "Invoice due date",
    value: "due_date",
  },
  {
    label: "Client's company name",
    value: "client.name",
  },
  {
    label: "Client's first name",
    value: "client.first_name",
  },
  {
    label: "Client's last name",
    value: "client.last_name",
  },
  {
    label: "My company name",
    value: "account.name",
  },
  {
    label: "My first name",
    value: "user.first_name",
  },
  {
    label: "My last name",
    value: "user.last_name",
  },
];

const SettingsTemplate = ({ title = "", data = {}, changeValue }) => {
  const [subjectPos, setSubjectPos] = useState(data.subject.length + 1);
  const [messagePos, setMessagePos] = useState(data.message.length + 1);
  const [edit, setEdit] = useState(false);

  return (
    <div className={`settingsTemplate ${edit ? "_active" : ""}`}>
      <div className="settingsTemplate__top">
        <div className="settingsTemplate__title">{data.title}</div>
        <div
          className={`settingsTemplate__activator ${edit ? "_active" : ""}`}
          onClick={() => {
            setEdit(!edit);
          }}
        >
          <span>Edit template</span>
          <DropdownMinor />
        </div>
      </div>
      <div className="settingsTemplate-templateMain">
        <div className="templateMain__top">
          <div className="templateMain__title">{data.title} TEMPLATE</div>
          <div className="templateMain__txt">
            Email template in <span className="bold-txt">Nederlands</span>
          </div>
        </div>
        <div className="templateMain__content">
          <div className="templateMain-tempField">
            <div className="tempField__top">
              <div className="tempField__title">Subject</div>
              <InvoiceSelectMain
                className="tempField__select"
                width="medium"
                type="simple"
                val={""}
                options={varOptions}
                icon={true}
                simpleTxt="Variables"
                changeVal={(val) => {
                  changeValue("subject", val, title, "variable", subjectPos);
                }}
              />
            </div>
            <div className="tempField__content def-input-purple">
              <input
                className="def-input tempField__input"
                type="text"
                onChange={(e) => {
                  setSubjectPos(e.target.selectionStart);
                  changeValue("subject", e.target.value, title);
                }}
                onClick={(e) => {
                  setSubjectPos(e.target.selectionStart);
                }}
                value={data.subject}
              />
            </div>
          </div>
          <div className="templateMain-tempField">
            <div className="tempField__top">
              <div className="tempField__title">Message</div>
              <InvoiceSelectMain
                className="tempField__select"
                width="medium"
                type="simple"
                val={""}
                icon={true}
                options={varOptions}
                simpleTxt="Variables"
                changeVal={(val) => {
                  changeValue("message", val, title, "variable", messagePos);
                }}
              />
            </div>
            <div className="tempField__content">
              <textarea
                onChange={(e) => {
                  setMessagePos(e.target.selectionStart);
                  changeValue("message", e.target.value, title);
                }}
                onClick={(e) => {
                  setMessagePos(e.target.selectionStart);
                }}
                value={data.message}
                className="tempField__textArea def-input-purple"
              />
            </div>
          </div>
        </div>
      </div>
      {data.automatically ? (
        <div className="settingsTemplate__bottom">
          <div className="settingsTemplate-tempFunc">
            <div className="tempFunc__info">
              <span className="tempFunc__title">
                {data.autoTitle}
                <a href=""> not paid</a>
              </span>
              <span className="tempFunc__txt">{data.autoTxt}</span>
            </div>
            <div className="tempFunc__func">
              <DefaultToggle
                value={data.auto}
                onChange={(value) => {
                  changeValue("auto", value, title);
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default SettingsTemplate;
