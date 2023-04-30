import CheckSvg from "../Svg/Check";
import { Checkbox } from "@shopify/polaris";
import "./Checkbox.css";
import { useCallback } from "react";

const DefaultCheckBox = ({ value, label = "", onChange }) => {
  const handleChange = useCallback((newChecked) => onChange(newChecked), []);

  return (
    <div className="defCheckBox">
      <label className="defCheckBox__wrapper">
        <Checkbox checked={value} onChange={handleChange} />
        <div className="defCheckBox__mark">
          <CheckSvg />
        </div>
        <span className="defCheckBox__label">{label}</span>
      </label>
    </div>
  );
};

export default DefaultCheckBox;
