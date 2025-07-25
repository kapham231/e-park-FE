import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import moment from "moment";
import useCheckMobile from "../../hooks/useCheckMobile";
import { getAllInvoiceWithPaidStatus } from "../../ApiService/userApi";
import { getSupplier } from "../../ApiService/playgroundmanagerApi";
import dayjs from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ReportContent = () => {
  const isMobile = useCheckMobile();
  const [transactions, setTransactions] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterRange, setFilterRange] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    getAllInvoiceWithPaidStatus()
      .then((res) => {
        console.log(res);
        if (!res) {
          setTransactions([]);
          return;
        }

        setTransactions(res.map((transaction) => formatAmount(transaction)));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // setLoading(false);
        console.log("Fetch transactions completed");
      });
  };

  const DATE_FORMAT = "DD-MM-YYYY";

  const parseWithDayjs = (dateString) => {
    if (!dateString) return null;
    // Use dayjs.utc() if you want to parse and treat the date as UTC
    const parsedDate = dayjs(dateString, DATE_FORMAT, true); // true enables strict parsing
    return parsedDate.isValid() ? parsedDate : null; // Return dayjs object or null
  };

  const handleRowClick = (record) => {
    fetchSupplier(record.supplier);
    setSelectedTransaction(record);
    setVisible(true);
  };

  const formatAmount = (transaction) => {
    const type = transaction.__t.toLowerCase();
    switch (type) {
      case "invoicemaintenance":
        return {
          ...transaction,
          subtotal: -Math.abs(transaction.subtotal),
        };
      case "invoicebooking":
        return {
          ...transaction,
          subtotal: Math.abs(transaction.subtotal),
        };
      default:
        return {
          ...transaction,
          subtotal: Math.abs(transaction.subtotal),
        };
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      transactions.map(({ invoiceNumber, __t, createdAt, subtotal }) => ({
        ID: invoiceNumber,
        Loại: __t,
        "Ngày giao dịch": createdAt,
        "Số tiền": subtotal > 0 ? `+${subtotal}` : `${subtotal}`,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "report.xlsx");
  };

  const renderAmount = (amount) => (
    <Text style={{ color: amount > 0 ? "green" : "red" }}>
      {amount > 0
        ? `+${amount.toLocaleString()} VND`
        : `${amount.toLocaleString()} VND`}
    </Text>
    // <Text>{amount.toLocaleString()} VND</Text>
  );

  const renderInvoiceDetail = (amount) => {
    console.log(amount);

    return <Text>{amount.toLocaleString()} VND</Text>;
  };

  const renderDate = (date) => {
    return moment.utc(date).format("DD-MM-YYYY");
    // return date;
  };

  const renderType = (type) => {
    type = type.toLowerCase();
    switch (type) {
      case "invoicemaintenance":
        return <Tag color={"blue"}>Maintenance</Tag>;
      case "invoicebooking":
        return <Tag color={"purple"}>Booking</Tag>;
      default:
        return <Tag color={"red"}>{type}</Tag>;
    }
  };

  const renderStatus = (status) => {
    status = status.toLowerCase();
    switch (status) {
      case "paid":
        return <Tag color={"green"}>Paid</Tag>;
      case "cancelled":
        return <Tag color={"blue"}>Unpaid</Tag>;
      case "pending":
        return <Tag color={"orange"}>Pending</Tag>;
      default:
        return <Tag color={"red"}>{status}</Tag>;
    }
  };

  const fetchSupplier = (id) => {
    getSupplier(id)
      .then((res) => {
        console.log(res);
        if (!res) {
          setSupplierName("");
          return;
        }
        setSupplierName(res.name);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("Fetch supplier completed");
      });
  };

  const renderMaintenance = (selectInvoice) => {
    const {
      invoiceNumber,
      __t,
      status,
      createdAt,
      totalItems,
      subtotal,
      supplierId,
      title,
      equipments,
    } = selectInvoice;
    // console.log(supplierId);
    fetchSupplier(supplierId);
    return (
      <div>
        <p>
          <strong>ID:</strong> {invoiceNumber}
        </p>
        <p>
          <strong>Type:</strong> {renderType(__t)}
        </p>
        <p>
          <strong>Status:</strong> {renderStatus(status)}
        </p>
        <p>
          <strong>Date:</strong> {createdAt}
        </p>
        <p>
          <strong>Total items:</strong> {totalItems}
        </p>
        <p>
          <strong>Amount:</strong> {renderAmount(subtotal)}
        </p>
        <p>
          <strong>Title:</strong> {title}
        </p>
        <p>
          <strong>Supplier:</strong> {supplierName}
        </p>
        <div>
          <strong>Equipments:</strong>
          <Table
            dataSource={equipments}
            columns={[
              { title: "Code", dataIndex: "code", key: "code", ellipsis: true },
              {
                title: "Type",
                dataIndex: "typeName",
                key: "typeName",
                ellipsis: true,
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
                ellipsis: true,
                render: renderInvoiceDetail,
              },
            ]}
            rowKey="code"
            pagination={false}
            scroll={{
              x: "max-content",
            }}
          />
        </div>
      </div>
    );
  };

  const renderBooking = (selectInvoice) => {
    const {
      invoiceNumber,
      __t,
      status,
      createdAt,
      totalItems,
      subtotal,
      customer,
      tickets,
    } = selectInvoice;
    return (
      <div>
        <p>
          <strong>ID:</strong> {invoiceNumber}
        </p>
        <p>
          <strong>Type:</strong> {renderType(__t)}
        </p>
        <p>
          <strong>Status:</strong> {renderStatus(status)}
        </p>
        <p>
          <strong>Date:</strong> {createdAt}
        </p>
        <p>
          <strong>Total tickets:</strong> {totalItems}
        </p>
        <p>
          <strong>Amount:</strong> {renderAmount(subtotal)}
        </p>
        <p>
          <strong>Customer:</strong> {customer}
        </p>
        <div>
          <strong>Tickets:</strong>
          <Table
            dataSource={tickets}
            columns={[
              {
                title: "Ticket Type",
                dataIndex: "ticketType",
                key: "ticketType",
              },
              { title: "Quantity", dataIndex: "quantity", key: "quantity" },
              {
                title: "Total",
                dataIndex: "totalForTicketType",
                key: "totalForTicketType",
                render: renderInvoiceDetail,
              },
            ]}
            pagination={false}
            scroll={{
              x: "max-content",
            }}
          />
        </div>
      </div>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      ellipsis: true,
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
    },
    {
      title: "Invoice Type",
      dataIndex: "__t",
      key: "invoiceType",
      render: renderType,
      align: "center",
      filters: [
        { text: "Booking", value: "invoicebooking" },
        { text: "Maintenance", value: "invoicemaintenance" },
      ],
      onFilter: (value, record) => record.__t.toLowerCase().includes(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: renderDate,
      sorter: (a, b) => {
        const dateA = parseWithDayjs(a.createdAt);
        const dateB = parseWithDayjs(b.createdAt);

        // Handle null or invalid dates (place them at the end/start as desired)
        if (!dateA && !dateB) return 0; // Both invalid/null, treat as equal
        if (!dateA) return 1; // Place nulls/invalid A after B
        if (!dateB) return -1; // Place nulls/invalid B after A

        // Compare valid dates (using valueOf() for timestamp comparison)
        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: "Amount",
      dataIndex: "subtotal",
      key: "subtotal",
      render: renderAmount,
      align: "right",
      sorter: (a, b) => a.subtotal - b.subtotal,
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (!filterRange) return true;
    const transactionDate = moment(t.createdAt, "YYYY-MM-DD");
    return transactionDate.isBetween(
      filterRange[0],
      filterRange[1],
      undefined,
      "[]"
    );
  });

  const totalIncome = filteredTransactions
    .filter((t) => (t.subtotal > 0) & (t.status === "PAID"))
    .reduce((sum, t) => sum + t.subtotal, 0);
  const totalExpense = filteredTransactions
    .filter((t) => (t.subtotal < 0) & (t.status === "PAID"))
    .reduce((sum, t) => sum + t.subtotal, 0);
  const totalProfit = totalIncome + totalExpense;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <RangePicker
          onChange={(d) => {
            if (d)
              setFilterRange([
                moment(d[0].toDate(), "DD-MM-YYYY"),
                moment(d[1].toDate(), "DD-MM-YYYY"),
              ]);
            else setFilterRange(null);
          }}
          format="DD-MM-YYYY"
        />
        <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
          {isMobile ? "" : "Extract to Excel"}
        </Button>
      </div>
      <Row gutter={[16, 8]} style={{ marginBlock: 20 }}>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 8,
          }}
        >
          <Card variant="borderless" size={isMobile ? "small" : "default"}>
            <Statistic
              title="Tổng thu"
              value={totalIncome.toLocaleString()}
              precision={2}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<ArrowUpOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 8,
          }}
        >
          <Card variant="borderless" size={isMobile ? "small" : "default"}>
            <Statistic
              title="Tổng chi"
              value={totalExpense.toLocaleString()}
              precision={2}
              valueStyle={{
                color: "#cf1322",
              }}
              prefix={<ArrowDownOutlined />}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col
          xs={{
            span: 24,
          }}
          lg={{
            span: 8,
          }}
        >
          <Card variant="borderless" size={isMobile ? "small" : "default"}>
            <Statistic
              title="Lợi nhuận"
              value={totalProfit.toLocaleString()}
              precision={2}
              valueStyle={{
                color: totalProfit >= 0 ? "#3f8600" : "#cf1322",
              }}
              prefix={
                totalProfit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
              }
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>
      <Table
        dataSource={filteredTransactions}
        columns={columns}
        rowKey="invoiceNumber"
        loading={loading}
        pagination={{
          pageSize: 15, // Hiển thị 15 hóa đơn mỗi trang
          showSizeChanger: false, // Ẩn tùy chọn thay đổi số lượng mục trên mỗi trang
        }}
        onRow={(record) => ({ onClick: () => handleRowClick(record) })}
        scroll={{
          x: "max-content",
        }}
      />
      <Modal
        title="Chi Tiết Giao Dịch"
        centered
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {selectedTransaction
          ? selectedTransaction.__t.toLowerCase() === "invoicebooking"
            ? renderBooking(selectedTransaction)
            : renderMaintenance(selectedTransaction)
          : ""}
      </Modal>
    </div>
  );
};

export default ReportContent;
