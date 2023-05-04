import TaxesExemption from "./TaxesExemption";
import TaxRates from "./TaxRates";
import SaveButton from "../button/SaveButton";
import { useAppQuery } from "../../hooks";
import { mutationRequest } from "../../hooks/useAppMutation";
import { generateId } from "../../utils/helpers";
import { useState } from "react";
import { Heading } from "@shopify/checkout-ui-extensions-react";
import "./taxes.css";

const Taxes = () => {
  const [taxesOptions, setTaxesOptions] = useState({
    enable: false,
    validate: false,
  });
  const [taxes, setTaxes] = useState([]);
  const { isLoading: countriesLoading } = useAppQuery({
    url: "/api/countries.json",
    query: "tax",
    reactQueryOptions: {
      onSuccess: (data) => {
        setTaxes([
          ...data,
          {
            id: generateId(),
            name: "LINIATAX",
            code: "SD",
            tax_name: "",
            tax: null,
            provinces: [],
          },
        ]);
      },
    },
  });
  const { mutate: newTax, isLoading: newTaxLoading } = mutationRequest(
    "/api/countries/create.json",
    "post",
    "",
    true,
    true,
    {
      onSuccess: (data) => {},
    }
  );
  const { mutate: editTax } = mutationRequest(
    "/api/countries/:id",
    "put",
    "",
    true
  );

  const handleChangeTaxOpt = (key, value) => {
    setTaxesOptions((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const handleChangeTaxes = (key, value, id = null) => {
    setTaxes((prev) => {
      const changeIndex = prev.findIndex((el) => el.id === id);
      prev[changeIndex] = {
        ...prev[changeIndex],
        [key]: value,
      };
      return [...prev];
    });
  };
  const handleAddNewRow = () => {
    setTaxes((prev) => {
      return [
        ...prev,
        {
          id: generateId(),
          name: "Mongolia",
          code: "AM",
          tax_name: "",
          tax: null,
          provinces: [],
        },
      ];
    });
  };
  const handleDeleteRow = (id) => {
    setTaxes((prev) => {
      return [...prev.filter((item) => item.id !== id)];
    });
  };
  const handleSubmit = () => {
    const newTaxes = taxes.filter((item) => typeof item.id !== "number");
    newTaxes.forEach((item) => {
      newTax.mutate({
        body: {
          country: {
            ...item,
            tax: item.tax / 100,
          },
        },
      });
    });
  };

  return (
    <div className="taxes wrapper">
      <div className="wrapper__top emails__top">
        <Heading element="h1">Taxes</Heading>
      </div>
      <div className="wrapper__content">
        <TaxesExemption data={taxesOptions} changeData={handleChangeTaxOpt} />
        <TaxRates
          loading={countriesLoading}
          rows={taxes}
          changeData={handleChangeTaxes}
          addRow={handleAddNewRow}
          deleteRow={handleDeleteRow}
        />
      </div>
      <div className="wrapper__bottom">
        <SaveButton
          label="Update Settings"
          loading={newTaxLoading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Taxes;
