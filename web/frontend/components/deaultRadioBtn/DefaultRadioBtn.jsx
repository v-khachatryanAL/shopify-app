import "./DefaultRadioBtn.css";

const DefaultRadioBtn = ({
  label = "",
  value,
  forVal,
  onChange,
  checked = false,
}) => {
  return (
    <label className="defaultRadioBtn">
      <input
        className="defaultRadioBtn__input"
        type="radio"
        name={forVal}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <span className="defaultRadioBtn__mark"></span>
      <span className="defaultRadioBtn__label">{label}</span>
    </label>
  );
};

export default DefaultRadioBtn;
