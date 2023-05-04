import SaveButton from "../button/SaveButton";
import ItemsTable from "./ItemsTable";
import { Heading } from "@shopify/checkout-ui-extensions";
import { useAppQuery } from "../../hooks";
import { mutationRequest } from "../../hooks/useAppMutation";
import { useEffect } from "react";
import { useState } from "react";
import "./items.css";

const Items = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mutate: getProducts, isLoading: prodLoading } = mutationRequest(
    "/api/products.json",
    "get",
    "",
    true,
    true,
    {
      onSuccess: (data) => {
        setProducts(data);
      },
      onLoading: ({ loading }) => {
        setLoading(loading);
      },
    }
  );
  const { data: productsLength } = useAppQuery({ url: "/api/products/count" });

  useEffect(() => {
    getProducts.mutate({
      url: `/api/products.json?page=${1}&limit=${15}`,
    });
  }, []);

  const handleChangePage = (page) => {
    getProducts.mutate({
      url: `/api/products.json?page=${page}&limit=${15}`,
    });
  };

  return (
    <div className="wrapper items">
      <div className="wrapper__top items__top">
        <div className="def-container">
          <Heading>Items</Heading>
          <SaveButton label="NEW ITEM" />
        </div>
      </div>
      <div className="items__content">
        <div className="def-container">
          <ItemsTable
            data={products}
            changePage={handleChangePage}
            dataLength={productsLength?.count || 0}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
export default Items;
