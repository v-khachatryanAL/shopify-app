import { Button } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { mutationRequest } from "../../hooks/useAppMutation";
import { tableMoreAction } from "../../utils/constants";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import { useAppQuery } from "../../hooks";
import { AppProvider } from "@shopify/polaris";
import InvoiceDetailPaper from "./invoicepaper/InvoiceDetailPaper";
import moment from "moment";

const InvoiceTableMoreAction = ({
  selectedResources,
  refetch,
  itemsLength,
}) => {
  const [getData, setGetData] = useState([]);
  const { data } = useAppQuery({
    url: `/api/shop.json`,
  });
  const { mutate } = mutationRequest(`/api/orders/`, "delete");
  const { mutate: getMutate } = mutationRequest(
    "/api/orders",
    "get",
    "?status=any",
    true
  );
  useEffect(() => {
    if (mutate.isSuccess) {
      refetch();
    }
  }, [mutate.isSuccess]);

  const handleAction = (id) => {
    if (id === 1 || id === 2) {
      if (getData && getData.length && selectedResources.length) {
        const generatePDF = (file) => {
          const printElement = ReactDOMServer.renderToStaticMarkup(
            pdfJSXa(file)
          );
          const options = {
            filename: `${file.app_id}.pdf`,
            jsPDF: {
              unit: "pt",
              format: "a4",
              orientation: "portrait",
            },
          };
          if (id === 1) {
            html2pdf()
              .set(options)
              .from(printElement)
              .output("dataurlnewwindow");
          } else {
            html2pdf().set(options).from(printElement).save();
          }
        };
        generatePDF(getData);
      }
    }
    if (id === 4) {
      selectedResources.map((elem) => {
        mutate.mutate({ body: elem });
      });
    }
    if (id === 3) {
      if (csv && csv.length && selectedResources.length) {
        const exportCSV = () => {
          const csvRows = [];
          const headers = Object.keys(csv[0]);
          csvRows.push(headers.join(","));
          for (const row of csv) {
            const values = headers.map((header) => row[header]);
            csvRows.push(values.join(","));
          }
          const csvString = csvRows.join("\n");
          const csvBlob = new Blob([csvString], { type: "text/csv" });
          const url = URL.createObjectURL(csvBlob);
          const downloadLink = document.createElement("a");
          downloadLink.href = url;
          downloadLink.download = "example.csv";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        exportCSV();
      }
    }
  };

  const pdfJSXa = (file) => {
    return (
      <>
        {file.map((item) => {
          return (
            <AppProvider i18n={{}}>
              <InvoiceDetailPaper invoiceData={item} shop={data[0]} />
            </AppProvider>
          );
        })}
      </>
    );
  };
  useEffect(() => {
    if (getMutate.isSuccess) {
      setGetData(
        getMutate?.data.filter((item) => {
          return selectedResources.includes(item.id);
        })
      );
    }
  }, [getMutate.isSuccess]);
  const [csv, setCsv] = useState();
  useEffect(() => {
    setCsv(
      getData.map((item) => {
        return (item = {
          name: item?.name,
          date: moment(item?.created_at).format("MMM DD,YYYY"),
          subprice: item?.current_subtotal_price,
          tax: item?.current_total_tax,
          currency: item?.currency,
          client: item?.customer?.default_address?.company,
          country: item?.customer?.default_address?.country_name,
          discount: item?.current_total_discounts,
          note: item?.note,
        });
      })
    );
  }, [getMutate.isSuccess, getData]);
  useEffect(() => {
    getMutate.mutate();
  }, [selectedResources]);

  // const pdfJSX = (invoiceData) => {
  //   return (
  //     <AppProvider i18n={{}}>
  //       <InvoiceDetailPaper invoiceData={invoiceData} shop={data[0]} />
  //     </AppProvider>
  //   );
  // };

  return (
    <>
      {tableMoreAction.map((item, index) => {
        return (
          <Button
            key={index}
            disabled={itemsLength < 1}
            icon={item.icon}
            onClick={() => handleAction(item.id)}
          >
            {item.content}
          </Button>
        );
      })}
    </>
  );
};
export default InvoiceTableMoreAction;
