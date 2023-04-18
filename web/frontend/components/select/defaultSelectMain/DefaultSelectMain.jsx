import { ActionList, Button, Popover } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";

const DefaultSelectMain = ({
  options,
  val,
  changeVal,
  label,
  width,
  minLabel,
  type,
  simpleTxt,
}) => {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const [btnLabel, setBtnLabel] = useState();
  const [selectList, setSelectList] = useState([]);

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
  }, [options]);

  const activator = (
    <Button onClick={toggleActive} disclosure>
      {simpleTxt || btnLabel}
    </Button>
  );
  return (
    <div className="invoice__MainSelect def__select">
      <div className="invoice__MainSelec-label">{label}</div>
      {/* <Select options={options} value={val} onChange={changeVal} /> */}
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
