import "./DefaultAutocomplete.css";
import { Autocomplete, Icon, Spinner } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useState, useEffect } from "react";

const DefaultAutocomplete = ({
  deselectedOptions,
  className = "",
  label = "",
  width = "",
  changeValue,
  inputChange,
  ipValue,
  placeholder = "",
  searchElement,
  loading,
  searching = false,
  onFocus,
  staticData = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState(ipValue);
  const [options, setOptions] = useState([]);

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
        inputValue?.length &&
        !deselectedOptions.find(
          (el) => el.label.toLowerCase() === inputValue.toLowerCase()
        )
      ) {
        setOptions([
          ...deselectedOptions,
          {
            label: inputValue,
            value: inputValue,
            isNew: true,
          },
        ]);
        inputChange(true);
      } else {
        inputChange && inputChange(false);
        setOptions([...deselectedOptions]);
      }
    }
  }, [deselectedOptions, inputValue]);

  // useEffect(() => {
  //   if (ipValue.length) {
  //     setInputValue(ipValue);
  //   }
  // }, [ipValue]);

  const handleFocus = () => {
    onFocus && onFocus();
    if (staticData && !inputValue?.length) {
      setOptions([...deselectedOptions]);
    }
  };

  const textField = (
    <div
      className={`defaultAutocomplete__textField ${
        loading ? "loading" : ""
      } ${className}`}
    >
      <Autocomplete.TextField
        onChange={updateText}
        label={label}
        value={inputValue}
        prefix={<Icon source={SearchMinor} color="base" />}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={handleFocus}
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

  return (
    <div className={`defaultAutocomplete ${width} ${className}`}>
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
