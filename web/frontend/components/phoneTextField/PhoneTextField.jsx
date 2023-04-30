import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useState } from "react";
import "./PhoneTextField.css";

const PhoneTextField = ({
  value = "",
  label = "Phone:",
  width = "medium",
  defaultCountry = "AM",
  placeholder = "Enter phone number",
  onChange,
  disabled = false,
  className = "",
}) => {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const handleChange = (val) => {
    setTouched(true);
    if (!val?.length) {
      setError("Phone number required");
      onChange(val, "Phone number required");
    } else if (!isValidPhoneNumber(val)) {
      setError("Invalid phone number");
      onChange(val, "Invalid phone number");
    } else {
      setError("");
      onChange(val, "");
    }
  };

  return (
    <div
      className={`phone ${width} ${
        !isValidPhoneNumber(value) && touched ? "_error" : ""
      } ${disabled ? "_disabled" : ""} ${className}`}
    >
      <div className="phone__wrapper">
        <div className="phone__label def-input-label">
          <span>{label}</span>
        </div>
        <PhoneInput
          disabled={disabled}
          className="phone__textField"
          placeholder={placeholder}
          international
          defaultCountry={defaultCountry}
          value={value || ""}
          onChange={handleChange}
        />
      </div>
      {touched && error ? (
        <div className="phone__error">
          <span>{error}</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default PhoneTextField;
