import DefaultAutocomplete from "../autocomplete/defaultAutocomplete/DefaultAutocomplete";
import TwiceTextfield from "../textfield/twiceTextfield/TwiceTextfield";
import DefTextfield from "../textfield/defTextField/DefTextfield";
import DefaultToggle from "../defaultToggle/DefaultToggle";
import InvoiceSelectMain from "../select/defaultSelectMain/DefaultSelectMain";
import { useState, useEffect } from "react";
import { Button } from "@shopify/polaris";
import moment from "moment";
import axios from "axios";
import { EMAIL_REGEX } from "../../utils/regex";
import { mutationRequest } from "../../hooks/useAppMutation";
import "./ClientsFormCase.css";
import { PhoneField, render } from "@shopify/checkout-ui-extensions-react";

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

render("Checkout::Dynamic::Render", () => <ClientsFormCase />);

const ClientsFormCase = ({ clientSearch, sendClient }) => {
  const [clientsOptions, setClientsOptions] = useState([]);
  const [client, setClient] = useState(null);
  const [editClientShow, setEditClientShow] = useState(false);
  const [addressType, setAddressType] = useState("billingAddress");
  const [sameBilling, setSameBilling] = useState(false);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressOptions, setAddressOptions] = useState();
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });
  // const { data: clients, isLoading: clientsLoading } = useAppQuery({
  //   url: "/api/customers.json",
  // });
  // const { data: clientsearch } = useAppQuery({
  //   url: "/api/customers/search?first_name=f",
  // });
  const [validTouch, setValidTouch] = useState([
    {
      email: false,
    },
  ]);
  const { mutate: searchClients } = mutationRequest(
    "/api/customers/search?first_name=",
    "get",
    "",
    true,
    true,
    {
      onSuccess: (data) => {
        setClientsOptions(() => {
          return [
            ...data.customers.map((e) => {
              return {
                value: e.id,
                label: e.first_name,
                isNew: false,
              };
            }),
          ];
        });
      },
    }
  );

  const checkValid = (key, value) => {
    if (key === "email") {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          email: "Required!",
        }));
      } else if (!EMAIL_REGEX.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is not valid!",
        }));
      } else {
        setErrors((prev) => {
          return {
            ...prev,
            email: "",
          };
        });
      }
    }
  };

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

  useEffect(() => {
    if (editClientShow) {
      setSelectedAddress(client.default_address);
    }
  }, [editClientShow]);

  useEffect(() => {
    if (client) {
      setAddressOptions(() => {
        return [
          ...client.addresses?.map((e) => {
            return {
              label: e.address1 + " " + e.address2,
              value: e.id,
            };
          }),
        ];
      });
      sendClient(client);
    }
  }, [client]);

  return (
    <div className="clientsFormCase">
      <div className="clientsFormCase__top">
        <DefaultAutocomplete
          width="medium"
          searching={true}
          newVal={true}
          loading={searchClients.isLoading}
          searchElement={(q) => {
            searchClients.mutate({
              url: `/api/customers/search?first_name=${q}`,
            });
          }}
          inputChange={(val) => {
            clientSearch(val);
          }}
          deselectedOptions={clientsOptions}
          label={"Clients:"}
          changeValue={(val) => {
            const foundClient = searchClients.data.customers?.find(
              (e) => e.id === val
            );

            setSelectedAddress(foundClient?.default_address || {});
            setClient(
              foundClient || {
                company: "",
                created_at: new Date(),
                updated_at: new Date(),
                default_address: {
                  company: "",
                  country: "",
                },
                addresses: [],
              }
            );
          }}
        />
      </div>
      {client && !editClientShow && (
        <div className="clientsFormCase-clientInfo">
          <div className="clientInfo__wrapper">
            <div className="clientInfo__list">
              <span>
                {
                  moment(client?.created_at).format("HH:mm") +
                    "-" +
                    moment(client?.updated_at).format("HH:mm")
                  // client.default_address.country_code
                }
              </span>
              <span>{client?.default_address?.company}</span>
              <span>{client?.default_address?.country}</span>
            </div>
            <div className="form__defBtn purple__btn-dark">
              <Button onClick={() => setEditClientShow(true)}>
                Edit Client
              </Button>
            </div>
          </div>
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
                value1={client.first_name || ""}
                value2={client.last_name || ""}
                onChange={(key, val) => {
                  const field = key === "val1" ? "first_name" : "last_name";
                  setClient((prev) => {
                    return {
                      ...prev,
                      [field]: val,
                    };
                  });
                }}
              />
              <DefTextfield
                label="Email:"
                width="medium"
                type="email"
                value={client.email}
                errorMessage={errors.email}
                onChange={(value) => {
                  setClient((prev) => {
                    return {
                      ...prev,
                      email: value,
                    };
                  });
                  checkValid("email", value);
                }}
                onFocus={() => {
                  setValidTouch((prev) => {
                    return {
                      ...prev,
                      email: true,
                    };
                  });
                }}
              />

              {client.addresses.length ? (
                <InvoiceSelectMain
                  width="medium"
                  type="simple"
                  val={client?.default_address?.country}
                  options={addressOptions}
                  simpleTxt="Select another address"
                  changeVal={(val) => {
                    setSelectedAddress(() => {
                      return {
                        ...client.addresses.filter((e) => e.id === val)[0],
                      };
                    });
                  }}
                />
              ) : (
                ""
              )}
              <DefTextfield
                label="Company:"
                width="medium"
                value={client.default_address?.company}
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
              <PhoneField label="Phone" value="1 (555) 555-5555" />
              <DefTextfield
                label="Address:"
                width="medium"
                value={selectedAddress?.address2 || ""}
                onChange={(value) => {
                  setSelectedAddress((prev) => {
                    return {
                      ...prev,
                      address2: value,
                    };
                  });
                }}
              />
              <TwiceTextfield
                value1={selectedAddress?.city || ""}
                value2={selectedAddress?.zip || ""}
                label1="City"
                label2="Postal code"
                onChange={(key, val) => {
                  const field = key === "val1" ? "city" : "zip";
                  setSelectedAddress((prev) => {
                    return {
                      ...prev,
                      [field]: val,
                    };
                  });
                }}
              />
              <InvoiceSelectMain
                width="medium"
                minLabel={"Country"}
                val={selectedAddress?.country}
                options={countriesOptions}
                changeVal={(val) => {
                  setSelectedAddress((prev) => {
                    return {
                      ...prev,
                      country: val,
                    };
                  });
                }}
              />
              <DefTextfield
                label="VAT No:"
                width="medium"
                value={client.vatNo || ""}
                onChange={(val) => {
                  setClient((prev) => {
                    return {
                      ...prev,
                      vatNo: val,
                    };
                  });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsFormCase;
