import "./DefaultAutocomplete.css";
import { Autocomplete, Icon, Spinner } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";

const DefaultAutocomplete = ({
  deselectedOptions,
  label,
  width,
  changeValue,
  newVal = false,
  inputChange,
  ipValue,
  placeholder,
  searchElement = false,
  loading,
  searching,
  onFocus,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([
    { value: "rustic", label: "Rustic" },
  ]);

  const updateText = (value) => {
    setInputValue(value);
    searchElement(value);
    if (value === "" && !value.length) {
      setOptions(deselectedOptions);
    }
    const filterRegex = new RegExp(value, "i");
    const resultOptions = deselectedOptions?.filter((option) => {
      return option.label?.toString().match(filterRegex);
    });
    // if (newVal && value.length && !loading) {
    //   resultOptions.push({
    //     label: value,
    //     value: value,
    //     isNew: true,
    //   });
    //   inputChange(resultOptions.filter((e) => e.isNew).length);
    // } else if (newVal && !value.length) {
    //   inputChange(0, value);
    // }
    setOptions(resultOptions);
  };

  const updateSelection = (selected) => {
    const selectedValue = selected.map((selectedItem) => {
      const matchedOption = options.find((option) => {
        return option.value.toString().match(selectedItem);
      });
      return matchedOption && matchedOption.label;
    });

    setSelectedOptions(selected);
    changeValue(selected[0]);
    setInputValue(selectedValue[0]);
  };

  useEffect(() => {
    if (searching) {
      if (
        deselectedOptions?.length ||
        !deselectedOptions.filter((e) => e.label === inputValue).length
      ) {
        if (inputValue.length) {
          setOptions([
            ...deselectedOptions,
            {
              label: inputValue,
              value: inputValue,
              isNew: true,
            },
          ]);
          inputChange(1);
        } else {
          setOptions([...deselectedOptions]);
        }
      }
    } else {
      deselectedOptions.length && setOptions(deselectedOptions);
    }
  }, [deselectedOptions, searching]);

  const textField = (
    <div
      className={`defaultAutocomplete__textField ${loading ? "loading" : ""}`}
    >
      <Autocomplete.TextField
        onChange={updateText}
        label={label}
        value={inputValue || ipValue}
        prefix={<Icon source={SearchMinor} color="base" />}
        placeholder={placeholder || ""}
        autoComplete="off"
        onFocus={onFocus}
      />
      {loading ? (
        <span className="loading">
          <Spinner accessibilityLabel="Small spinner example" size="small" />
        </span>
      ) : (
        ""
      )}
    </div>
  );
  console.log({ options });
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
