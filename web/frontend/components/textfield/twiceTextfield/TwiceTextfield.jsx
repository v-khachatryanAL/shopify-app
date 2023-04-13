import { TextField } from "@shopify/polaris";
import "./TwiceTextfield.css";

const TwiceTextfield = ({ val1, val2, label, label1, label2 }) => {
  return (
    <div className="twiceTextfield">
      <div className="twiceTextfield__label">
        <span className="def-input-label">{label}</span>
      </div>
      <div className="twiceTextfield__inputs">
        <TextField label={label1} />
        <TextField label={label2} />
      </div>
    </div>
  );
};

export default TwiceTextfield;
