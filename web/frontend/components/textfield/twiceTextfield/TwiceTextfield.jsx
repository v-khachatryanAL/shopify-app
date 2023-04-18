import { TextField } from "@shopify/polaris";
import "./TwiceTextfield.css";

const TwiceTextfield = ({ value1, value2, label, label1, label2,onChange }) => {
  return (
    <div className="twiceTextfield">
      <div className="twiceTextfield__label">
        <span className="def-input-label">{label}</span>
      </div>
      <div className="twiceTextfield__inputs">
        <TextField
          label={label1}
          value={value1}
          onChange={(val) => {
            onChange("val1", val);
          }}
        />
        <TextField
          label={label2}
          value={value2}
          onChange={(val) => {
            onChange("val2", val);
          }}
        />
      </div>
    </div>
  );
};

export default TwiceTextfield;
