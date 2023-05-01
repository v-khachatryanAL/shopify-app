import { FileUploader } from "react-drag-drop-files";
import { Button } from "@shopify/polaris";
import { useState } from "react";
import {
  DropdownMinor,
  PageUpMajor,
  ChecklistMajor,
  ExchangeMajor,
  CircleCancelMajor,
} from "@shopify/polaris-icons";
import DefTextfield from "../textfield/defTextField/DefTextfield";
import { validateEmail } from "../../utils/helpers";

const EmailAdvanced = ({ data, chnageAdvanced, errors, setInputErrors }) => {
  const [file, setFile] = useState(null);
  const [show, setShow] = useState(false);

  const handleChange = (file) => {
    setFile(file);
  };
  const handleDelete = () => {
    setFile(null);
  };

  return (
    <div className="emailAdvanced">
      <div className={`emailAdvanced__top ${show ? "_active" : ""}`}>
        <Button
          onClick={() => {
            setShow(!show);
          }}
        >
          ADVANCED OPTIONS <DropdownMinor />
        </Button>
      </div>
      <div className={`emailAdvanced__content ${show ? "_active" : ""}`}>
        <div className="email-emCase">
          <div className="settingsTemplate__title">Additional attachment</div>
          <div className="emCase__line col">
            <span className="emailOptions__txt emCase__txt">
              Add a PDF file (such as a Terms and Conditions document) as an
              additional attachment to every email.
            </span>
            <div className="emCase__upload setting_upload">
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
        </div>
        <div className="email-emCase">
          <div className="settingsTemplate__title">Sender email</div>
          <div className="emCase__line">
            <span className="emCase__txt">
              Your customers will see this address when you email them.
            </span>
          </div>
          <div className="emCase__line">
            <DefTextfield
              value={data.senderEmail}
              errorMessage={errors.senderEmail}
              type="email"
              onChange={(value) => {
                chnageAdvanced("senderEmail", value);
                validateEmail(value, setInputErrors, "senderEmail");
              }}
            />
          </div>
          <div className="settingsTemplate__title">Mailing domain</div>
          <div className="emCase__line">
            <span className="emCase__txt">
              Send emails using your mailing domain to improve email
              deliverability. You might have to add SPF and DKIM records to your
              domain to support your DMARC policy.
            </span>
          </div>
          <div className="emCase__line">
            <a className="def-link" href="">
              Contact us to set up a mailing domain
            </a>
          </div>
        </div>
        <div className="email-emCase">
          <div className="settingsTemplate__title">Export email</div>
          <div className="emCase__line">
            <span className="emCase__txt">
              Generated download, print or export files will be sent to this
              email address.
            </span>
          </div>
          <div className="emCase__line end">
            <DefTextfield
              value={data.exportEmail}
              type="email"
              errorMessage={errors.exportEmail}
              onChange={(value) => {
                validateEmail(value, setInputErrors, "exportEmail");
                chnageAdvanced("exportEmail", value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAdvanced;
