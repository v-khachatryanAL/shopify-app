import { DropdownMinor } from "@shopify/polaris-icons";
import { Button } from "@shopify/polaris";
import { useMemo, useState } from "react";
import "./pagination.css";

const Pagination = ({ dataLength, onChange, perPage }) => {
  const [activePage, setActivePage] = useState(1);
  const initialPages = useMemo(() => {
    const pagesCount = Math.ceil(dataLength / perPage);
    return Array(pagesCount)
      .fill()
      .map((_, index) => {
        return { page: index + 1 };
      });
  }, [dataLength]);

  const handleChangePage = (key, page = 1) => {
    switch (key) {
      case "page":
        setActivePage(page);
        onChange(page);
        break;
      case "prev":
        if (pageCondition(page, initialPages.length, "prev")) {
          setActivePage(page - 1);
          onChange(page - 1);
        }
        break;
      case "next":
        if (pageCondition(page, initialPages.length, "next")) {
          setActivePage(page + 1);
          onChange(page + 1);
        }
        break;
      default:
        setActivePage(page);
        break;
    }
  };
  const pageCondition = (page, length, type) => {
    if (type === "prev") return page !== 1;
    else return page < length;
  };

  return (
    <div className="pagination">
      <div className="pagination__wrapper">
        <div
          className={`pagination__btn _active prev ${
            pageCondition(activePage, initialPages.length, "prev") ? "" : ""
          }`}
        >
          <Button
            onClick={() => {
              handleChangePage("prev", activePage);
            }}
          >
            <DropdownMinor />
          </Button>
        </div>
        <div className="pagination__pages">
          {initialPages.map((item, index) => {
            return (
              <div
                key={index}
                className={`pagination__btn num ${
                  activePage === item.page ? "_active _read" : ""
                }`}
              >
                <Button
                  onClick={() => {
                    handleChangePage("page", item.page);
                  }}
                >
                  {item.page}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={`pagination__btn _active next ${
          pageCondition(activePage, initialPages.length, "next")
            ? ""
            : "_disabled"
        }`}
      >
        <Button
          onClick={() => {
            handleChangePage("next", activePage);
          }}
        >
          <DropdownMinor />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
