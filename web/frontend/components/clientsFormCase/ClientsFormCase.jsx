import "./ClientsFormCase.css";
import DefaultAutocomplete from "../autocomplete/defaultAutocomplete/DefaultAutocomplete";
import TwiceTextfield from "../textfield/twiceTextfield/TwiceTextfield";
import DefTextfield from "../textfield/defTextField/DefTextfield";
import DefaultToggle from "../defaultToggle/DefaultToggle";
import InvoiceSelectMain from "../invoice/select/InvoiceSelectMain";
import { useState, useEffect } from "react";
import { useAppQuery } from "../../hooks";
import { Button } from "@shopify/polaris";
import moment from "moment";
import axios from "axios";

const addressTypes = [
  {
    label: "Billing address",
    value: "billingAddress",
  },
  {
    label: "Shipping address",
    value: "shippingAddress",
  },
];
const currencySelectOptions = [
  { label: "United States Dollar", value: "$" },
  { label: "EUR", value: "e" },
  { label: "RUB", value: "₽" },
];
const ClientsFormCase = () => {
  const [clientsOptions, setClientsOptions] = useState([]);
  const [client, setClient] = useState("");
  const [editClientShow, setEditClientShow] = useState(false);
  const [addressType, setAddressType] = useState("billingAddress");
  const [sameBilling, setSameBilling] = useState(false);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const { data: clients, isSuccess: clientsSuccess } = useAppQuery({
    url: "/api/customers.json",
  });

  useEffect(() => {
    clientsSuccess &&
      setClientsOptions(() => {
        return [
          ...clients.map((e) => {
            return {
              value: e.id,
              label: e.id,
            };
          }),
        ];
      });
  }, [clients, clientsSuccess]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        setCountriesOptions(() => {
          return response.data.map((e) => {
            return {
              label: e.name.common,
              value: e.name.common,
            };
          });
        });
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="clientsFormCase">
      <div className="clientsFormCase__top">
        <DefaultAutocomplete
          width="medium"
          deselectedOptions={clientsOptions}
          label={"Clients:"}
          changeValue={(val) => {
            setClient(() => {
              return clients.filter((e) => {
                if (e.id === val) return e;
              })[0];
            });
          }}
        />
      </div>
      {client && !editClientShow && (
        <div className="clientsFormCase-clientInfo">
          <>
            <div className="clientInfo__list">
              <span>
                {moment(client.created_at).format("HH:mm") +
                  "-" +
                  moment(client.updated_at).format("HH:mm") +
                  " " +
                  client.default_address.country_code}
              </span>
              <span>{client.default_address.company}</span>
              <span>{client.default_address.country}</span>
            </div>
            <div className="form__defBtn purple__btn-dark">
              <Button onClick={() => setEditClientShow(true)}>
                Edit Client
              </Button>
            </div>
          </>
        </div>
      )}
      {client && editClientShow && (
        <div className="clientsFormCase-editCase">
          <div>
            <div className="def-form-tabs">
              {addressTypes.map((e, index) => {
                return (
                  <div
                    key={index}
                    className={`def-form-tab ${
                      addressType === e.value ? "_active" : "_none"
                    }`}
                    onClick={() => {
                      setAddressType(e.value);
                    }}
                  >
                    {e.label}
                  </div>
                );
              })}
            </div>
            {addressType === "shippingAddress" && (
              <div className="clientsFormCase__toggle">
                <span>Same as billing address</span>
                <DefaultToggle
                  value={sameBilling}
                  onChange={(val) => {
                    setSameBilling(val);
                  }}
                />
              </div>
            )}
          </div>
          {(addressType === "billingAddress" ||
            (addressType === "shippingAddress" && sameBilling)) && (
            <div className="editCase__inputs">
              <TwiceTextfield
                label="Contact Name:"
                label1="First name"
                label2="Last name"
              />
              <DefTextfield
                label="Company:"
                width="medium"
                value={client.default_address.company}
                onChange={(value) => {
                  setClient((prev) => {
                    return {
                      ...prev,
                      default_address: {
                        ...prev.default_address,
                        company: value,
                      },
                    };
                  });
                }}
              />
              <DefTextfield
                label="Address:"
                width="medium"
                value={client.default_address.country}
                onChange={(value) => {
                  setClient((prev) => {
                    return {
                      ...prev,
                      default_address: {
                        ...prev.default_address,
                        country: value,
                      },
                    };
                  });
                }}
              />
              <TwiceTextfield label1="City" label2="Postal code" />
              <InvoiceSelectMain
                width="medium"
                minLabel={"Country"}
                val={client.default_address.country}
                options={countriesOptions}
                changeVal={(val) => {
                  setClient((prev) => {
                    return {
                      ...prev,
                      default_address: {
                        ...prev.default_address,
                        country: val,
                      },
                    };
                  });
                }}
              />
              <DefTextfield label="VAT No:" width="medium" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsFormCase;

// : client && editClientShow ? (

// ) : (
//   ""
// )
