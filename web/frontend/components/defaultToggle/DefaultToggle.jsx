import "./DefaultToggle.css";

const DefaultToggle = ({ onChange, value }) => {
  return (
    <div
      className={`defaultToggle ${value ? "_active" : ""}`}
      onClick={() => {
        onChange(!value);
      }}
    >
      <div className="defaultToggle__bullet"></div>
    </div>
  );
};

export default DefaultToggle;
