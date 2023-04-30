import { TextField } from "@shopify/polaris";
import "./TwiceTextfield.css";

const TwiceTextfield = ({
  value1,
  value2,
  label,
  label1,
  label2,
  onChange,
  disabled,
}) => {
  return (
    <div className={`twiceTextfield ${disabled ? "_disabled" : ""} `}>
      <div className="twiceTextfield__label">
        <span className="def-input-label">{label}</span>
      </div>
      <div className="twiceTextfield__inputs">
        <TextField
          disabled={disabled}
          label={label1}
          value={value1}
          onChange={(val) => {
            onChange("val1", val);
          }}
        />
        <TextField
          disabled={disabled}
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
