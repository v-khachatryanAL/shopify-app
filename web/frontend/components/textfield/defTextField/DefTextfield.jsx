import { TextField } from "@shopify/polaris";
import "./DefTextfield.css";

const DefTextfield = ({ label, width, value, onChange }) => {
  return (
    <div className={`defFextField ${width}`}>
      <div>
        <span className="def-input-label">{label}</span>{" "}
      </div>
      <TextField
        value={value}
        onChange={(val) => {
          onChange(val);
        }}
      />
    </div>
  );
};

export default DefTextfield;
