import { TextField } from "@shopify/polaris";
import "./DefTextfield.css";

const DefTextfield = ({ label, width, value, onChange, errorMessage }) => {
  return (
    <div className={`defFextField ${width}`}>
      <div>
        <span className="def-input-label">{label}</span>
      </div>
      <div className="defFextField__area">
        <TextField
          value={value}
          onChange={(val) => {
            onChange(val);
          }}
        />
        {errorMessage && <span className="defFextField__error">{errorMessage}</span>}
      </div>
    </div>
  );
};

export default DefTextfield;
