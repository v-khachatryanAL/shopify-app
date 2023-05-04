import { DataTable, Icon, IndexTable, Tooltip } from "@shopify/polaris";
import Pagination from "../pagination/Pagination";
import { InfoMinor } from "@shopify/polaris-icons";

const rows = [
  {
    date: "new Date()",
    invoice_number: 784151521,
    recipients: "invoice@polvobv.nl",
    type: "invoice",
    status: "sent",
  },
  {
    date: "new Date()",
    invoice_number: 784151521,
    recipients: "invoice@polvobv.nl",
    type: "Thank-you",
    status: "failed",
  },
  {
    date: "new Date()",
    invoice_number: 784151521,
    recipients: "invoice@polvobv.nl",
    type: "invoice",
    status: "sent",
  },
];
const tooltipContent = () => {
  return (
    <div className="emailsHistory__tooltip">
      <span>All times are CEST.</span>
      <a href="">Display in UTC</a>
    </div>
  );
};

const handleChangePage = (page) => {};

const EmHistoryTable = ({ data }) => {
  return (
    <div>
      <div className="emailsHistory__table">
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={[
            <div className="emailsHistory__ic">
              <span>Date</span>
              <Tooltip
                preferredPosition="mostSpace"
                width="wide"
                content={tooltipContent()}
              >
                <div className="companyInfo__tooltip">
                  <Icon source={InfoMinor} color="#6d27e7" />
                </div>
              </Tooltip>
            </div>,
            "Document",
            "Recipients",
            "Type",
            "Status",
          ]}
          key={rows}
          rows={rows.map((row) => {
            return [
              <div>{row.date}</div>,
              <div>{row.invoice_number}</div>,
              <div>{row.recipients}</div>,
              <div>{row.type}</div>,
              <div className={`emailsHistory__status ${row.status}`}>
                {row.status}
              </div>,
            ];
          })}
        />
      </div>
      <div className="emailsHistory__pagin">
        <Pagination
          onChange={handleChangePage}
          perPage="3"
          data={[4, 5, 5, 6, 2, 1, 8, 9, 6, 3]}
        />
      </div>
    </div>
  );
};

export default EmHistoryTable;
