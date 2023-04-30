import { TextField } from "@shopify/polaris";
import "./DefTextfield.css";

const DefTextfield = ({
  label = "",
  minLabel = "",
  width = "medium",
  height = "medium",
  className = "",
  type,
  value,
  onChange,
  errorMessage,
  disabled = false,
}) => {
  return (
    <div
      className={`defFextField ${width} ${minLabel ? "_start" : ""} ${
        errorMessage ? "_error" : ""
      } ${disabled ? "_disabled" : ""} ${className}`}
    >
      <div className="defFextField__label">
        <span className="def-input-label">{label}</span>
      </div>
      <div className="defFextField__area">
        {type !== "textarea" ? (
          <TextField
            disabled={disabled}
            type={type}
            value={value}
            onChange={(val) => {
              onChange(val);
            }}
          />
        ) : (
          <textarea
            disabled={disabled}
            className={`defFextField__textArea ${height}`}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        )}

        {errorMessage && (
          <span className="defFextField__error">{errorMessage}</span>
        )}
        {minLabel ? (
          <span className="defFextField__minLabel">{minLabel}</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DefTextfield;
