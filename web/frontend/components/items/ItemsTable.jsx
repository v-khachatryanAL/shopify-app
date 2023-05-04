import { IndexTable, useIndexResourceState } from "@shopify/polaris";
import { useState } from "react";
import Loading from "../loading";
import Pagination from "../pagination/Pagination";

const headers = [
  {
    id: 1,
    title: "Item Name",
  },
  {
    id: 2,
    title: "Description",
  },
  {
    id: 3,
    title: "Price",
  },
  {
    id: 4,
    title: "Inventory",
  },
];
const resourceName = {
  singular: "item",
  plural: "items",
};
const ItemsTable = ({ data, dataLength, changePage, loading }) => {
  const [activePage, setActivePage] = useState(1);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data);

  const handleChangePage = (page) => {
    setActivePage(page);
    changePage(page);
  };

  const rowMarkup = data?.map(({ id, title, body_html, variants }, index) => (
    <IndexTable.Row
      id={id}
      key={index}
      selected={selectedResources.includes(id)}
      position={id}
    >
      <IndexTable.Cell>
        <span>{title}</span>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <span>{body_html}</span>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <span>{variants[0].price}</span>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <span>{variants[0].inventory_quantity}</span>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  const loadingRow = () => {
    return (
      <IndexTable.Row
        id={id}
        key={index}
        selected={selectedResources.includes(id)}
        position={id}
      >
        <IndexTable.Cell>
          <Loading />
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  };

  return (
    <>
      <div className="items__table">
        <IndexTable
          resourceName={resourceName}
          itemCount={data.length}
          sortable={[true, true, true, true]}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={headers}
        >
          {!loading ? rowMarkup : ""}
        </IndexTable>
        {loading ? <Loading size="large" /> : ""}
      </div>
      <div className="items__pagination">
        <Pagination
          perPage={20}
          dataLength={dataLength}
          onChange={handleChangePage}
        />
      </div>
    </>
  );
};

export default ItemsTable;
