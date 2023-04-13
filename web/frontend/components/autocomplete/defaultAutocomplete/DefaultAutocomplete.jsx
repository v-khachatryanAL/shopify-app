import "./DefaultAutocomplete.css";
import { Autocomplete, Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";

const DefaultAutocomplete = ({
  deselectedOptions,
  label,
  width,
  changeValue,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      if (value === "" && !value.length) {
        setOptions(deselectedOptions);
        return;
      }
      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) => {
        return option.label.toString().match(filterRegex);
      });
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.toString().match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      changeValue(selected[0]);
      setInputValue(selectedValue[0] || "");
    },
    [options]
  );

  useEffect(() => {
    deselectedOptions.length && setOptions(deselectedOptions);
  }, [deselectedOptions]);

  const textField = (
    <div className="defaultAutocomplete__textField">
      <Autocomplete.TextField
        onChange={updateText}
        label={label}
        value={inputValue}
        prefix={<Icon source={SearchMinor} color="base" />}
        placeholder="Search"
        autoComplete="off"
      />
    </div>
  );

  return (
    <div className={`defaultAutocomplete ${width}`}>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
    </div>
  );
};

export default DefaultAutocomplete;
