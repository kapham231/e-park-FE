import { useState, useCallback, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  getVoucher,
  getVoucherById,
  createVoucher,
  updateVoucher,
  toggleVoucherStatus,
  duplicateVoucher,
  deleteVoucher
} from '../../ApiService/voucherApi'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import VoucherModal from '../components/VoucherModal'

export default function VouchersManagement() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [query, setQuery] = useState({
    q: '',
    status: '',
    type: '',
    onlyActiveNow: false,
    page: 1,
    limit: 20
  })

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // ---------------- Data load ----------------
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await getVoucher(query)
      setRows(r.data || [])
      setMeta(r.meta || { page: 1, limit: 20, total: 0, pages: 0 })
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(v) {
    setEditing(v)
    setOpen(true)
  }

  function validate(values) {
    const errs = {}
    if (!values.code || values.code.trim().length < 3) errs.code = 'Code must be at least 3 chars'
    if (values.type !== 'FIXED' && values.type !== 'PERCENT') errs.type = 'Type is required'
    if (Number(values.discountAmount) < 0) errs.discountAmount = 'Discount must be ≥ 0'
    if (values.type === 'PERCENT' && Number(values.discountAmount) > 100)
      errs.discountAmount = 'Percent cannot exceed 100'
    const start = new Date(values.startDate)
    const end = new Date(values.expirationDate)
    if (!(start < end)) errs.expirationDate = 'End must be after start'
    if (Number(values.maxUsage) < 1) errs.maxUsage = 'Max usage must be ≥ 1'
    if (Number(values.perUserLimit) < 1) errs.perUserLimit = 'Per-user limit must be ≥ 1'
    return errs
  }

  async function onSubmit(data) {
    const payload = coerceForServer(data)
    const errs = validate(payload)
    if (Object.keys(errs).length) {
      setError(Object.values(errs)[0])
      return
    }
    try {
      setError('')
      if (editing && editing._id) await updateVoucher(editing._id, payload)
      else await createVoucher(payload)
      setOpen(false)
      load()
    } catch (err) {
      setError(String(err.message || err))
    }
  }

  // ---------------- Render ----------------
  return (
    <div className='p-6 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Vouchers</h1>
        <div className='flex items-center gap-2'>
          <button className='px-3 py-2 rounded bg-black text-white' onClick={openCreate}>
            New Voucher
          </button>
          <button className='px-3 py-2 rounded border' onClick={() => {}}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-3 items-end'>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='search'>Search</Label>
          <Input
            type='text'
            id='search'
            placeholder='Search code...'
            value={query.q}
            onChange={(e) => setQuery({ ...query, q: e.target.value, page: 1 })}
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='status'>Status</Label>
          <Select
            className='mt-1 w-full border rounded px-3 py-2'
            value={query.status || 'ALL'}
            onValueChange={(v) => setQuery({ ...query, status: v === 'ALL' ? '' : v, page: 1 })}
          >
            <SelectTrigger id='status' className='w-full'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value='ALL'>All</SelectItem>
                <SelectItem value='ACTIVE'>Active</SelectItem>
                <SelectItem value='INACTIVE'>Inactive</SelectItem>
                <SelectItem value='SCHEDULED'>Scheduled</SelectItem>
                <SelectItem value='EXPIRED'>Expired</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='grid w-full max-w-sm items-center gap-3'>
          <Label htmlFor='type'>Type</Label>
          <Select
            className='mt-1 w-full border rounded px-3 py-2'
            value={query.type || 'ALL'}
            onValueChange={(v) => setQuery({ ...query, type: v === 'ALL' ? '' : v, page: 1 })}
          >
            <SelectTrigger id='status' className='w-full'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value='ALL'>All</SelectItem>
                <SelectItem value='FIXED'>Fixed</SelectItem>
                <SelectItem value='PERCENT'>Percent</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2 h-10 md:col-span-2'>
          <input
            id='onlyActiveNow'
            type='checkbox'
            className='h-4 w-4'
            checked={query.onlyActiveNow}
            onChange={(e) => setQuery({ ...query, onlyActiveNow: e.target.checked, page: 1 })}
          />
          <label htmlFor='onlyActiveNow' className='text-sm'>
            Only active now
          </label>
        </div>
      </div>

      {error && <div className='rounded border border-red-300 bg-red-50 text-red-700 px-3 py-2'>{error}</div>}

      <div className='overflow-x-auto border rounded-lg'>
        <table className='min-w-full text-sm'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-3 py-2 text-left'>Code</th>
              <th className='px-3 py-2 text-left'>Type / Value</th>
              <th className='px-3 py-2 text-left'>Usage</th>
              <th className='px-3 py-2 text-center'>Min Order</th>
              <th className='px-3 py-2 text-left'>Validity</th>
              <th className='px-3 py-2 text-center'>Status</th>
              <th className='px-3 py-2 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v._id} className='border-t'>
                <td className='px-3 py-2 font-medium'>{v.code}</td>
                <td className='px-3 py-2'>
                  {v.type === 'FIXED' ? `-${v.discountAmount}` : `-${v.discountAmount}%`}
                  {v.type === 'PERCENT' && v.maxDiscountAmount ? ` (cap ${v.maxDiscountAmount})` : ''}
                </td>
                <td className='px-3 py-2'>
                  {v.usedCount}/{v.maxUsage} · per user {v.perUserLimit}
                </td>
                <td className='px-3 py-2 text-center'>{v.minOrderAmount}</td>
                <td className='px-3 py-2'>
                  {new Date(v.startDate).toLocaleDateString()} → {new Date(v.expirationDate).toLocaleDateString()}
                </td>
                <td className='px-3 py-2 text-center'>
                  <StatusBadge status={v.status} />
                </td>
                <td className='flex px-3 py-2 text-left gap-1'>
                  <button
                    className='px-2 py-1 border rounded text-blue-400 hover:bg-blue-400 hover:text-white'
                    onClick={() => openEdit(v)}
                  >
                    Edit
                  </button>
                  <button
                    className='px-2 py-1 border rounded text-red-400 hover:bg-red-400 hover:text-white'
                    onClick={() => {
                      if (window.confirm('Delete this voucher?')) deleteVoucher(v._id).then(load)
                    }}
                  >
                    Delete
                  </button>
                  {v.status === 'ACTIVE' && (
                    <button
                      className='px-2 py-1 border rounded text-yellow-400 hover:bg-yellow-400 hover:text-white'
                      onClick={() => toggleVoucherStatus(v._id, 'deactivate').then(load)}
                    >
                      Deactivate
                    </button>
                  )}
                  {v.status === 'INACTIVE' && (
                    <button
                      className='px-2 py-1 border rounded text-green-500 hover:bg-green-300 hover:text-white'
                      onClick={() => toggleVoucherStatus(v._id, 'activate').then(load)}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className='px-3 py-6 text-center text-gray-500'>
                  {loading ? 'Loading…' : 'No vouchers found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <div className='text-sm text-gray-500'>Total: {meta.total}</div>
        <div className='flex gap-2'>
          <button
            className='px-3 py-2 border rounded'
            disabled={meta.page <= 1}
            onClick={() => setQuery({ ...query, page: meta.page - 1 })}
          >
            Prev
          </button>
          <button
            className='px-3 py-2 border rounded'
            disabled={meta.page >= meta.pages}
            onClick={() => setQuery({ ...query, page: meta.page + 1 })}
          >
            Next
          </button>
        </div>
      </div>

      <VoucherModal visible={open} onClose={() => setOpen(false)} onSubmit={onSubmit} initValue={editing} />
    </div>
  )
}

function StatusBadge({ status }) {
  const tone = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-yellow-100 text-yellow-700',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    EXPIRED: 'bg-red-100 text-red-700'
  }
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-bold ${tone[status] || 'bg-gray-100 text-gray-700 uppercase'}`}
    >
      {String(status || '')}
    </span>
  )
}

function coerceForServer(f) {
  return {
    code: (f.code || '').toUpperCase().replace(/\s+/g, ''),
    type: f.type,
    discountAmount: Number(f.discountAmount) || 0,
    maxDiscountAmount: f.type === 'PERCENT' ? Number(f.maxDiscountAmount) || 0 : null,
    minOrderAmount: Number(f.minOrderAmount) || 0,
    maxUsage: Number(f.maxUsage) || 1,
    perUserLimit: Number(f.perUserLimit) || 1,
    combinable: !!f.combinable,
    startDate: new Date(f.startDate),
    expirationDate: new Date(f.expirationDate),
    status: f.status || 'ACTIVE',
    description: f.description || ''
  }
}
