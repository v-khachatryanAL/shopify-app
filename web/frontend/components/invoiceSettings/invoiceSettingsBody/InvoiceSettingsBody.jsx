import { Button, TextField } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import DefaultSelectMain from "../../select/defaultSelectMain/DefaultSelectMain";
import DefaultRadioBtn from "../../deaultRadioBtn/DefaultRadioBtn";
import { PageUpMajor } from "@shopify/polaris-icons";
import { ExchangeMajor } from "@shopify/polaris-icons";
import { CircleCancelMajor } from "@shopify/polaris-icons";
import { ChecklistMajor } from "@shopify/polaris-icons";
import { useAppQuery } from "../../../hooks";
import axios from "axios";

const InvoiceSettingsBody = ({ settings }) => {
  const [file, setFile] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [numberingShow, setNumberingShow] = useState(false);
  const { data: paymentMethods } = useAppQuery({
    url: "/api/languages.json",
  });

  const handleChange = (file) => {
    setFile(file);
  };

  const handleDelete = () => {
    setFile([]);
  };

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=languages"
        );
        const countries = response.data;
        const languagesTemp = [];
        countries.forEach((e) => {
          let item = null;
          if (Object.entries(e?.languages)[0]) {
            item = {
              type: Object.entries(e?.languages)[0][0],
              label: Object.entries(e?.languages)[0][1],
              value: Object.entries(e?.languages)[0][0],
            };
          }
          if (
            item &&
            !languagesTemp.filter((el) => {
              if (el?.type === item.type) {
                return el;
              }
            }).length
          ) {
            languagesTemp.push(item);
          }
        });
        setLanguages(languagesTemp);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="invoiceSettings__body">
      <div className="invoiceSettings__left">
        <div className="invoiceSettings__line center">
          <div className="def-input-label">Invoice numbering:</div>
          <div className="invoiceSettings-numbering">
            <div className="numbering__item">
              <DefaultRadioBtn
                forVal="number"
                checked
                value="same"
                onChange={() => {
                  setNumberingShow(false);
                }}
                label="Same as order numbers"
              />
            </div>
            <div className="numbering__item">
              <DefaultRadioBtn
                forVal="number"
                value="custom"
                onChange={() => {
                  setNumberingShow(true);
                }}
                label="Custom invoice numbers"
              />
            </div>
          </div>
        </div>
        <div
          className={`invoiceSettings__numberInp def-input-purple ${
            numberingShow ? "_active" : ""
          }`}
        >
          <TextField value={settings.dueIn} onChange={(val) => {}} />
          <span className="light-txt">Next invoice number</span>
        </div>
        <div className="invoiceSettings__twiceInp def-input-purple min">
          <TextField
            value={settings.dueIn}
            label="Due in:"
            onChange={(val) => {}}
          />
        </div>
        <div>
          <DefaultSelectMain
            label="Payment method:"
            width="min"
            options={[
              {
                label: "aaa",
                value: "aaa",
              },
            ]}
            val={"aaa" || ""}
            changeVal={(val) => {}}
          />
        </div>
        <div className="invoiceSettings-notes">
          <div className="notes__body">
            <div className="def-input-label">Notes:</div>
            <textarea className="notes-textArea"></textarea>
          </div>
          <div className="notes_bottom light-txt">
            <p>This text will appear at the bottom of your invoices. </p>
          </div>
        </div>
        <div>
          <DefaultSelectMain
            label="Language:"
            width="min"
            options={languages}
            val={settings.language || ""}
            changeVal={(val) => {}}
          />
        </div>
      </div>
      <div className="setting_upload">
        <span className="append">Append pages:</span>
        {!file?.name ? (
          <div className="upload_file">
            <div className="upload_button">
              <span> Choose file...</span>
              <PageUpMajor />
            </div>
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={["PDF"]}
            />
            <span className="pdf_info">
              PDF file appended as additional pages at the end of every invoice.
            </span>
          </div>
        ) : (
          <div>
            <div className="uploaded_file_name_icon">
              <ChecklistMajor />
              <span className="file_name">{file?.name}</span>
            </div>
            <div className="uploaded_file_div">
              <div className="upload_file">
                <div className="upload_button">
                  <span> Change</span>
                  <ExchangeMajor />
                </div>
                <FileUploader
                  handleChange={handleChange}
                  name="file"
                  types={["PDF"]}
                />
              </div>
              <div className="upload_button" onClick={handleDelete}>
                <span> Clear</span>
                <CircleCancelMajor />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceSettingsBody;
