import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllInvoice, getInvoicesByCustomer } from '../../services/userApi'
import { useAuth } from '../../contexts/AuthContext'
import { downloadInvoice } from '../../utils/download-invoice'
import { downloadProductInvoice } from '../../utils/download-product-invoice'
import { getUserNameById } from '../../services/adminApi'
import { DatePicker, Pagination, Select } from 'antd'
import dayjs from 'dayjs'
import '../css/history.css'

const UserHistoryContent = () => {
    const navigate = useNavigate()
    const [invoices, setInvoices] = useState([])
    const [filteredInvoices, setFilteredInvoices] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDateRange, setSelectedDateRange] = useState([null, null])
    const [selectedInvoiceType, setSelectedInvoiceType] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [sortOption, setSortOption] = useState('date-desc')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(7)
    const auth = useAuth()
    const user = auth?.user || {}

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                const customerId = user?._id || user?.id
                if (!customerId) {
                    setLoading(false)
                    return
                }

                // Fetch only invoices for this customer
                const myInvoices = await getInvoicesByCustomer(customerId)

                // Fetch user info for each invoice and enrich data
                const enrichedInvoices = await Promise.all(
                    myInvoices.map(async (inv) => {
                        try {
                            const userInfo = await getUserNameById(inv.customer._id)
                            // console.log(userInfo)
                            let membershipDiscount = 0
                            let eventDiscountPrice = 0

                            // Calculate discount for InvoiceBooking
                            if (inv.__t === 'InvoiceBooking' && inv.tickets && inv.tickets[0]) {
                                const discountRate = Number(userInfo.discount) || 0
                                const rawMembershipDiscount = (1 - discountRate) * (inv.tickets[0].originalPrice - inv.tickets[0].priceAfterEventDiscount) * inv.tickets[0].quantity
                                membershipDiscount = Math.round(rawMembershipDiscount)
                                eventDiscountPrice = inv.tickets[0].priceAfterEventDiscount * inv.tickets[0].quantity
                            }

                            return {
                                ...inv,
                                customer: userInfo,
                                membershipDiscount,
                                eventDiscountPrice
                            }
                        } catch (err) {
                            console.error('Error fetching user info for invoice', inv._id, err)
                            return inv
                        }
                    })
                )

                // sort by date desc
                enrichedInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setInvoices(enrichedInvoices)
                setFilteredInvoices(enrichedInvoices)
            } catch (error) {
                console.error('Fetch invoices error', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) fetchInvoices()
    }, [user])

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0'
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'
    }

    const getInvoiceTypeLabel = (invoiceType) => {
        switch (invoiceType) {
            case 'InvoiceBooking':
                return 'Hóa đơn đặt vé'
            case 'InvoiceProduct':
                return 'Hóa đơn sản phẩm'
            default:
                return 'Hóa đơn'
        }
    }

    const handleDateRangeChange = (dates) => {
        setSelectedDateRange(dates)
        setCurrentPage(1) // Reset to first page when filtering
        
        if (!dates || !dates[0] || !dates[1]) {
            // If no date selected, show all invoices
            setFilteredInvoices(invoices)
            return
        }

        const [startDate, endDate] = dates
        const start = startDate.startOf('day')
        const end = endDate.endOf('day')

        const filtered = invoices.filter((inv) => {
            const invDate = dayjs(inv.createdAt)
            return invDate.isAfter(start) && invDate.isBefore(end)
        })

        setFilteredInvoices(filtered)
    }

    const handlePaginationChange = (page, size) => {
        setCurrentPage(page)
        setPageSize(size)
    }

    const handleSortChange = (value) => {
        setSortOption(value)
        setCurrentPage(1) // Reset to first page when sorting
    }

    const handleInvoiceTypeFilter = (value) => {
        setSelectedInvoiceType(value)
        setCurrentPage(1) // Reset to first page when filtering
        if (!value) {
            // If clearing the filter, also reset sort option
            setSortOption('date-desc')
        }
    }

    const handleStatusFilter = (value) => {
        setSelectedStatus(value)
        setCurrentPage(1) // Reset to first page when filtering
        if (!value) {
            // If clearing the filter, also reset sort option
            setSortOption('date-desc')
        }
    }

    const getSortLabel = (sortValue) => {
        const sortOptions = {
            'date-desc': 'Ngày mới nhất',
            'date-asc': 'Ngày cũ nhất',
            'type': 'Loại đơn hàng',
            'status': 'Tình trạng'
        }
        return sortOptions[sortValue] || sortValue
    }

    const getInvoiceTypeFilterLabel = (typeValue) => {
        const typeOptions = {
            'InvoiceBooking': 'Hóa đơn đặt vé',
            'InvoiceProduct': 'Hóa đơn sản phẩm'
        }
        return typeOptions[typeValue] || typeValue
    }

    const getStatusFilterLabel = (statusValue) => {
        const statusOptions = {
            'paid': 'Đã thanh toán',
            'pending': 'Chờ xử lý',
            'unpaid': 'Chưa thanh toán'
        }
        return statusOptions[statusValue] || statusValue
    }

    const clearAllFilters = () => {
        setSelectedDateRange([null, null])
        setSelectedInvoiceType(null)
        setSelectedStatus(null)
        setSortOption('date-desc')
        setCurrentPage(1)
        setFilteredInvoices(invoices)
    }

    const formatISOTime = (time) => {
        return new Date(time).toLocaleString("vi-VN", {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            // hour12: true,
        });
    };

    const sortInvoices = (invoices, option) => {
        const sorted = [...invoices]
        switch (option) {
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            case 'type':
                return sorted.sort((a, b) => {
                    const typeA = a.__t || ''
                    const typeB = b.__t || ''
                    return typeA.localeCompare(typeB)
                })
            case 'status':
                return sorted.sort((a, b) => {
                    const statusA = a.status || ''
                    const statusB = b.status || ''
                    return statusA.localeCompare(statusB)
                })
            default:
                return sorted
        }
    }

    // Apply additional filters based on selectedInvoiceType and selectedStatus
    const applyFilters = useMemo(() => {
        let filtered = [...filteredInvoices]

        if (selectedInvoiceType) {
            filtered = filtered.filter(inv => inv.__t === selectedInvoiceType)
        }

        if (selectedStatus) {
            filtered = filtered.filter(inv => inv.status?.toLowerCase() === selectedStatus.toLowerCase())
        }

        return filtered
    }, [filteredInvoices, selectedInvoiceType, selectedStatus])

    const sortedFilteredInvoices = useMemo(() => {
        return sortInvoices(applyFilters, sortOption)
    }, [applyFilters, sortOption])

    // Calculate paginated invoices
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedInvoices = sortedFilteredInvoices.slice(startIndex, endIndex)

    return (
        <div className="user-history-wrapper">
            <div className="history-header">
                <h2>Lịch sử đơn hàng</h2>
                <div className="history-filter">
                    <div className="filter-item">
                        <label>Tìm kiếm theo ngày:</label>
                        <DatePicker.RangePicker
                            value={selectedDateRange}
                            onChange={handleDateRangeChange}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            format="DD/MM/YYYY"
                            className="date-range-picker"
                        />
                    </div>
                    <div className="filter-item">
                        <label>Sắp xếp theo:</label>
                        <Select
                            value={sortOption}
                            onChange={handleSortChange}
                            style={{ width: 150 }}
                            options={[
                                { value: 'date-desc', label: 'Ngày mới nhất' },
                                { value: 'date-asc', label: 'Ngày cũ nhất' },
                                { value: 'type', label: 'Loại đơn hàng' },
                                { value: 'status', label: 'Tình trạng' }
                            ]}
                        />
                    </div>
                    {sortOption === 'type' && (
                        <div className="filter-item">
                            <label>Lọc theo loại:</label>
                            <Select
                                value={selectedInvoiceType}
                                onChange={handleInvoiceTypeFilter}
                                style={{ width: 150 }}
                                placeholder="Chọn loại hóa đơn"
                                allowClear
                                options={[
                                    { value: 'InvoiceBooking', label: 'Hóa đơn đặt vé' },
                                    { value: 'InvoiceProduct', label: 'Hóa đơn sản phẩm' }
                                ]}
                            />
                        </div>
                    )}
                    {sortOption === 'status' && (
                        <div className="filter-item">
                            <label>Lọc theo tình trạng:</label>
                            <Select
                                value={selectedStatus}
                                onChange={handleStatusFilter}
                                style={{ width: 150 }}
                                placeholder="Chọn tình trạng"
                                allowClear
                                options={[
                                    { value: 'paid', label: 'Đã thanh toán' },
                                    { value: 'pending', label: 'Chờ xử lý' },
                                    { value: 'unpaid', label: 'Chưa thanh toán' }
                                ]}
                            />
                        </div>
                    )}
                </div>
                {/* Active Filters Display */}
                {(selectedDateRange[0] || selectedDateRange[1] || selectedInvoiceType || selectedStatus || sortOption !== 'date-desc') && (
                    <div className="active-filters">
                        <div className="active-filters-header">
                            <span>Bộ lọc đang áp dụng:</span>
                            <button className="clear-all-btn" onClick={clearAllFilters}>
                                Xóa tất cả
                            </button>
                        </div>
                        <div className="active-filters-tags">
                            {selectedDateRange[0] && selectedDateRange[1] && (
                                <span className="filter-tag">
                                    Ngày: {selectedDateRange[0].format('DD/MM/YYYY')} - {selectedDateRange[1].format('DD/MM/YYYY')}
                                    <button onClick={() => handleDateRangeChange([null, null])}>×</button>
                                </span>
                            )}
                            {sortOption !== 'date-desc' && (
                                <span className="filter-tag">
                                    Sắp xếp: {getSortLabel(sortOption)}
                                    <button onClick={() => setSortOption('date-desc')}>×</button>
                                </span>
                            )}
                            {selectedInvoiceType && (
                                <span className="filter-tag">
                                    Loại: {getInvoiceTypeFilterLabel(selectedInvoiceType)}
                                    <button onClick={() => handleInvoiceTypeFilter(null)}>×</button>
                                </span>
                            )}
                            {selectedStatus && (
                                <span className="filter-tag">
                                    Tình trạng: {getStatusFilterLabel(selectedStatus)}
                                    <button onClick={() => handleStatusFilter(null)}>×</button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {loading ? (
                <div className="history-loading">Đang tải...</div>
            ) : filteredInvoices.length === 0 ? (
                <div className="history-empty">
                    {invoices.length === 0 
                        ? 'Bạn chưa có đơn hàng nào trong quá khứ.' 
                        : 'Không có đơn hàng nào trong khoảng thời gian này.'}
                </div>
            ) : (
                <>
                    <ul className="history-list">
                        {paginatedInvoices.map((inv) => (
                            <li key={inv._id} className="history-item" onClick={() => navigate(`/user/invoice/${inv._id}`)}>
                                <div className="history-main">
                                    <div className="history-info">
                                        <div className="history-code">Mã: {inv?.invoiceNumber || inv?.orderCode || inv._id}</div>
                                        <div className="history-type">Loại: {getInvoiceTypeLabel(inv.__t)}</div>
                                        <div className="history-date">{formatISOTime(inv.createdAt)}</div>
                                    </div>
                                    <div className="history-summary">
                                        <div className="history-amount">{formatCurrency(inv.subtotal)}</div>
                                        <div className={`history-status ${inv.status?.toLowerCase()}`}>
                                            {inv.status || 'UNKNOWN'}
                                        </div>
                                    </div>
                                </div>
                                <div className="history-actions">
                                    <button
                                        className="btn btn-default"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (inv.__t === 'InvoiceProduct') {
                                                downloadProductInvoice({
                                                    ...inv,
                                                    subtotal: inv.subtotal,
                                                    qrCode: inv.qrCode,
                                                    name: inv.customer?.firstName ? (inv.customer.firstName + ' ' + inv.customer.lastName) : 'Guest',
                                                    phone: inv.customer?.phoneNumber || '',
                                                    email: inv.customer?.email || '',
                                                    bookingDate: inv.bookingDate
                                                })
                                            } else {
                                                downloadInvoice({
                                                    ...inv,
                                                    membershipDiscount: inv.membershipDiscount || 0,
                                                    eventDiscountPrice: inv.eventDiscountPrice || 0,
                                                    subtotal: inv.subtotal,
                                                    qrCode: inv.qrCode,
                                                    name: inv.customer?.firstName ? (inv.customer.firstName + ' ' + inv.customer.lastName) : 'Guest',
                                                    phone: inv.customer?.phoneNumber || '',
                                                    email: inv.customer?.email || '',
                                                    bookingDate: inv.bookingDate
                                                })
                                            }
                                        }}
                                    >
                                        Tải hoá đơn
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="history-pagination">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={sortedFilteredInvoices.length}
                            onChange={handlePaginationChange}
                            pageSizeOptions={['7','10', '20', '50']}
                            showSizeChanger
                            showTotal={(total) => `Tổng ${total} đơn hàng`}
                            locale={{
                                items_per_page: '/ trang',
                                jump_to: 'Đi đến',
                                jump_to_confirm: 'xác nhận',
                                page: 'trang',
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default UserHistoryContent