import { useEffect, useState } from 'react'
import { Table } from 'antd'
import { getAllInvoiceWithPaidStatus } from '../../services/userApi'
import moment from 'moment/moment'
import dayjs from 'dayjs'
const DATE_FORMAT = 'DD-MM-YYYY'

const MaintenanceHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTransactions = () => {
    setLoading(true)
    getAllInvoiceWithPaidStatus()
      .then((res) => {
        if (!res) {
          setTransactions([])
          return
        }

        setTransactions(res.filter((transaction) => transaction.__t === 'InvoiceMaintenance'))
        setLoading(false)
        console.log(transactions)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        // setLoading(false);
        console.log('Fetch transactions completed')
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const renderDate = (date) => {
    return moment.utc(date).format('DD-MM-YYYY')
    // return date;
  }

  const parseWithDayjs = (dateString) => {
    if (!dateString) return null
    // Use dayjs.utc() if you want to parse and treat the date as UTC
    const parsedDate = dayjs(dateString, DATE_FORMAT, true) // true enables strict parsing
    return parsedDate.isValid() ? parsedDate : null // Return dayjs object or null
  }

  const columns = [
    // {
    // 	title: "Device Type",
    // 	dataIndex: "typeName",
    // 	key: "typeName",
    // 	ellipsis: true,
    // 	defaultSortOrder: "ascend",
    // 	sorter: (a, b) => a.typeName.localeCompare(b.typeName),
    // },
    {
      title: 'ID',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      ellipsis: true
      // sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: renderDate
      // sorter: (a, b) => {
      // 	const dateA = parseWithDayjs(a.createdAt);
      // 	const dateB = parseWithDayjs(b.createdAt);
      //
      // 	// Handle null or invalid dates (place them at the end/start as desired)
      // 	if (!dateA && !dateB) return 0; // Both invalid/null, treat as equal
      // 	if (!dateA) return 1;          // Place nulls/invalid A after B
      // 	if (!dateB) return -1;         // Place nulls/invalid B after A
      //
      // 	// Compare valid dates (using valueOf() for timestamp comparison)
      // 	return dateA.valueOf() - dateB.valueOf();
      // },
    },
    {
      title: 'Amount',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'center'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ellipsis: true
      // sorter: (a, b) => a.code.localeCompare(b.code),
    }
  ]

  return (
    <div style={{ margin: '20px' }}>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey='id'
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} errors`,
          style: { marginTop: '16px', textAlign: 'right' }
        }}
        scroll={{ x: 'max-content' }}
        style={{ marginTop: '20px' }}
      />
    </div>
  )
}

export default MaintenanceHistory
