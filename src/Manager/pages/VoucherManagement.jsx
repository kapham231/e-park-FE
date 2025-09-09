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
  const [form, setForm] = useState(() => defaultForm())

  function defaultForm() {
    const now = new Date()
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    return {
      code: '',
      type: 'FIXED',
      discountAmount: 0,
      maxDiscountAmount: 0,
      minOrderAmount: 0,
      maxUsage: 1,
      perUserLimit: 1,
      combinable: false,
      startDate: toLocalInputValue(now),
      expirationDate: toLocalInputValue(tomorrow),
      status: 'ACTIVE',
      description: ''
    }
  }

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

  // ---------------- Form helpers ----------------
  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  function openCreate() {
    setEditing(null)
    setForm(defaultForm())
    setOpen(true)
  }

  function openEdit(v) {
    setEditing(v)
    setForm({
      code: v.code || '',
      type: v.type || 'FIXED',
      discountAmount: v.discountAmount ?? 0,
      maxDiscountAmount: v.maxDiscountAmount ?? 0,
      minOrderAmount: v.minOrderAmount ?? 0,
      maxUsage: v.maxUsage ?? 1,
      perUserLimit: v.perUserLimit ?? 1,
      combinable: !!v.combinable,
      startDate: toLocalInputValue(new Date(v.startDate)),
      expirationDate: toLocalInputValue(new Date(v.expirationDate)),
      status: v.status || 'ACTIVE',
      description: v.description || ''
    })
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

  async function onSubmit(e) {
    e.preventDefault()
    const payload = coerceForServer(form)
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
        <Select
          className='mt-1 w-full border rounded px-3 py-2'
          value={query.status || 'ALL'}
          onValueChange={(v) => setQuery({ ...query, status: v === 'ALL' ? '' : v, page: 1 })}
        >
          <SelectTrigger id='status' className='w-full'>
            <SelectValue placeholder='All' />
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
        <Select
          className='mt-1 w-full border rounded px-3 py-2'
          value={query.type || 'ALL'}
          onValueChange={(v) => setQuery({ ...query, type: v === 'ALL' ? '' : v, page: 1 })}
        >
          <SelectTrigger id='status' className='w-full'>
            <SelectValue placeholder='All' />
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
                  {v.type === 'FIXED' ? `−${v.discountAmount}` : `−${v.discountAmount}%`}
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
                  <button className='px-2 py-1 border rounded' onClick={() => openEdit(v)}>
                    Edit
                  </button>
                  {v.status === 'ACTIVE' ? (
                    <button
                      className='px-2 py-1 border rounded'
                      onClick={() => toggleVoucherStatus(v._id, 'deactivate').then(load)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className='px-2 py-1 border rounded'
                      onClick={() => toggleVoucherStatus(v._id, 'activate').then(load)}
                    >
                      Activate
                    </button>
                  )}
                  <button
                    className='px-2 py-1 border rounded text-red-600'
                    onClick={() => {
                      if (window.confirm('Delete this voucher?')) deleteVoucher(v._id).then(load)
                    }}
                  >
                    Delete
                  </button>
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

      {/* Create/Edit Modal */}
      {open && (
        <div className='fixed inset-0 z-50 bg-black/40'>
          <div className='flex min-h-screen items-center justify-center p-4 overflow-y-auto'>
            <div
              className='relative bg-white w-full max-w-lg rounded-xl shadow-xl px-4 pb-4
                    max-h-[calc(100vh-2rem)] overflow-y-auto'
            >
              <div className='sticky top-0 z-10 bg-white flex items-center justify-between mb-3 py-4'>
                <h2 className='text-lg font-semibold'>{editing ? 'Edit voucher' : 'New voucher'}</h2>
                <button className='text-gray-500' onClick={() => setOpen(false)}>
                  ✕
                </button>
              </div>

              <form className='space-y-3' onSubmit={onSubmit}>
                <div>
                  <label className='block text-sm text-gray-600'>Code</label>
                  <input
                    className='mt-1 w-full border rounded px-3 py-2'
                    value={form.code}
                    onChange={(e) => setField('code', e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    placeholder='e.g., SUMMER10'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm text-gray-600'>Type</label>
                    <select
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.type}
                      onChange={(e) => setField('type', e.target.value)}
                    >
                      <option value='FIXED'>Fixed</option>
                      <option value='PERCENT'>Percent</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm text-gray-600'>
                      {form.type === 'PERCENT' ? 'Percent (%)' : 'Amount'}
                    </label>
                    <input
                      type='number'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.discountAmount}
                      onChange={(e) => setField('discountAmount', e.target.value)}
                    />
                  </div>
                </div>

                {form.type === 'PERCENT' && (
                  <div>
                    <label className='block text-sm text-gray-600'>Max discount cap</label>
                    <input
                      type='number'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.maxDiscountAmount}
                      onChange={(e) => setField('maxDiscountAmount', e.target.value)}
                    />
                  </div>
                )}

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm text-gray-600'>Min order</label>
                    <input
                      type='number'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.minOrderAmount}
                      onChange={(e) => setField('minOrderAmount', e.target.value)}
                    />
                  </div>
                  <div className='flex items-center gap-2 mt-7'>
                    <input
                      id='combinable'
                      type='checkbox'
                      className='h-4 w-4'
                      checked={!!form.combinable}
                      onChange={(e) => setField('combinable', e.target.checked)}
                    />
                    <label htmlFor='combinable' className='text-sm'>
                      Combinable
                    </label>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm text-gray-600'>Max usage (global)</label>
                    <input
                      type='number'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.maxUsage}
                      onChange={(e) => setField('maxUsage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-600'>Per-user limit</label>
                    <input
                      type='number'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.perUserLimit}
                      onChange={(e) => setField('perUserLimit', e.target.value)}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm text-gray-600'>Start</label>
                    <input
                      type='datetime-local'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.startDate}
                      onChange={(e) => setField('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-600'>End</label>
                    <input
                      type='datetime-local'
                      className='mt-1 w-full border rounded px-3 py-2'
                      value={form.expirationDate}
                      onChange={(e) => setField('expirationDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm text-gray-600'>Status</label>
                  <select
                    className='mt-1 w-full border rounded px-3 py-2'
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value)}
                  >
                    <option value='ACTIVE'>Active</option>
                    <option value='INACTIVE'>Inactive</option>
                    <option value='SCHEDULED'>Scheduled</option>
                    <option value='EXPIRED'>Expired</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm text-gray-600'>Description</label>
                  <input
                    className='mt-1 w-full border rounded px-3 py-2'
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                    placeholder='Optional'
                  />
                </div>

                <div className='flex justify-end gap-2 pt-2'>
                  <button type='button' className='px-3 py-2 border rounded' onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button type='submit' className='px-3 py-2 rounded bg-black text-white'>
                    {editing ? 'Save changes' : 'Create voucher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const tone = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
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

// --------------- utils ----------------
function toLocalInputValue(date) {
  // yyyy-MM-ddThh:mm (local)
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${h}:${mm}`
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
