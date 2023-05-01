import { ActionList, Button, Popover } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { DropdownMinor } from "@shopify/polaris-icons";

const DefaultSelectMain = ({
  options,
  val,
  changeVal,
  label,
  className = "",
  width = "medium",
  minLabel,
  type = "",
  simpleTxt,
  disabled = false,
  icon = false,
}) => {
  const [active, setActive] = useState(false);
  const [btnLabel, setBtnLabel] = useState();
  const [selectList, setSelectList] = useState([]);

  const toggleActive = () => setActive((active) => !active);

  useEffect(() => {
    const selectedItem = options.filter((e) => {
      return e.value === val;
    })[0];
    setBtnLabel(selectedItem?.label);
  }, [val, options]);

  useEffect(() => {
    setSelectList(() => {
      return [
        ...options.map((e) => {
          const callBack = () => {
            changeVal(e.value, e.label);
          };
          return {
            content: e.label,
            value: e.value,
            onAction: callBack,
          };
        }),
      ];
    });
  }, [options, changeVal]);

  const activator = (
    <div
      className={`invoice__MainSelect-btn ${width} ${className} ${
        disabled ? "_disabled" : ""
      }`}
    >
      <Button disabled={disabled} onClick={toggleActive} disclosure>
        {simpleTxt || btnLabel}
        {icon ? <DropdownMinor /> : ""}
      </Button>
    </div>
  );
  return (
    <div className="invoice__MainSelect def__select">
      <div className="invoice__MainSelec-label">{label}</div>
      <div className={`invoice__MainSelect-wrapper ${width} ${type}`}>
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
        >
          <ActionList actionRole="menuitem" items={selectList} />
        </Popover>
        <span className="invoice__MainSelect-label">{minLabel}</span>
      </div>
    </div>
  );
};

export default DefaultSelectMain;
