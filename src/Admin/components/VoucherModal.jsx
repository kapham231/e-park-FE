import { useState, useEffect, useMemo } from 'react'
import { Modal } from 'antd'

const VoucherModal = ({ visible, onClose, onSubmit, initValue }) => {
  if (!visible) return null
  // const [form] = Form.useForm()
  const [form, setForm] = useState(() => getInitialForm(initValue))

  const isPercent = useMemo(() => form.type === 'PERCENT', [form.type])

  // Re-hydrate when opening for edit
  useEffect(() => {
    setForm(getInitialForm(initValue))
  }, [initValue])

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleOk = () => {
    const conditions = {
      minTickets: num(form.minTickets),
      ticketTypes: csvToArray(form.ticketTypes),
      minSubtotal: num(form.minSubtotal),
      allowedMemberRanks: csvToArray(form.allowedMemberRanks),
      firstPurchaseOnly: !!form.firstPurchaseOnly
    }

    // Parent controller expects a flat payload. We include conditions
    const payload = {
      code: (form.code || '').toUpperCase().replace(/\s+/g, ''),
      type: form.type,
      discountAmount: num(form.discountAmount),
      maxDiscountAmount: form.type === 'PERCENT' ? num(form.maxDiscountAmount) : null,
      // minOrderAmount: num(form.minOrderAmount),
      maxUsage: Math.max(1, num(form.maxUsage, 1)),
      // perUserLimit: Math.max(1, num(form.perUserLimit, 1)),
      // combinable: !!form.combinable,
      startDate: toDate(form.startDate),
      expirationDate: toDate(form.expirationDate),
      status: form.status || undefined, // optional; backend will derive if omitted
      description: form.description || '',
      conditions
    }

    onSubmit(payload)
  }

  const handleCancel = () => {
    setForm(getInitialForm())
    onClose()
  }

  return (
    <Modal
      title={initValue ? 'Edit voucher' : 'New voucher'}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={initValue ? 'Save changes' : 'Create voucher'}
      cancelText='Cancel'
      centered
      width={{
        // xs: '90%'
        sm: '80%',
        // md: '70%',
        lg: '70%'
        // xl: '50%',
        // xxl: '40%'
      }}
    >
      <form className='space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4'>
        <div>
          {/* Code */}
          <div>
            <label className='block text-sm text-gray-600'>Code</label>
            <input
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.code}
              onChange={(e) => setField('code', e.target.value.toUpperCase().replace(/\s+/g, ''))}
              placeholder='e.g., SUMMER10'
              required
            />
          </div>

          {/* Type & discount */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label className='block text-sm text-gray-600'>Type</label>
              <select
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
                required
              >
                <option value='FIXED'>FIXED</option>
                <option value='PERCENT'>PERCENT</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-600'>
                {isPercent ? 'Discount percent (%)' : 'Discount amount'}
              </label>
              <input
                type='number'
                min={0}
                max={isPercent ? 100 : undefined}
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.discountAmount}
                onChange={(e) => setField('discountAmount', e.target.value)}
                placeholder={isPercent ? 'e.g., 10' : 'e.g., 50000'}
                required
              />
            </div>
          </div>

          {/* Max discount (cap) for percent type */}
          {isPercent && (
            <div>
              <label className='block text-sm text-gray-600'>Max discount amount (cap)</label>
              <input
                type='number'
                min={0}
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.maxDiscountAmount}
                onChange={(e) => setField('maxDiscountAmount', e.target.value)}
                placeholder='e.g., 100000'
              />
            </div>
          )}

          {/* Order minimum and limits */}
          <div className='grid grid-cols-3 gap-2'>
            {/* <div>
              <label className='block text-sm text-gray-600'>Min order amount</label>
              <input
                type='number'
                min={0}
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.minOrderAmount}
                onChange={(e) => setField('minOrderAmount', e.target.value)}
                placeholder='0 = no min'
              />
            </div> */}
            <div>
              <label className='block text-sm text-gray-600'>Max usage</label>
              <input
                type='number'
                min={1}
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.maxUsage}
                onChange={(e) => setField('maxUsage', e.target.value)}
                placeholder='e.g., 100'
              />
            </div>
            {/* <div>
              <label className='block text-sm text-gray-600'>Per-user limit</label>
              <input
                type='number'
                min={1}
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.perUserLimit}
                onChange={(e) => setField('perUserLimit', e.target.value)}
                placeholder='e.g., 1'
              />
            </div> */}
          </div>

          {/* Combinable */}
          {/* <div className='flex items-center gap-2 my-3'>
            <input
              id='combinable'
              type='checkbox'
              className='h-4 w-4'
              checked={form.combinable}
              onChange={(e) => setField('combinable', e.target.checked)}
            />
            <label htmlFor='combinable' className='text-sm'>
              Combinable with other vouchers
            </label>
          </div> */}

          {/* Validity window */}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <label className='block text-sm text-gray-600'>Start date</label>
              <input
                type='datetime-local'
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600'>Expiration date</label>
              <input
                type='datetime-local'
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.expirationDate}
                onChange={(e) => setField('expirationDate', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className='block text-sm text-gray-600'>Description</label>
            <textarea
              className='mt-1 w-full border rounded px-3 py-2'
              rows={2}
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder='Internal note / customer-facing text'
            />
          </div>
        </div>

        {/* --- CONDITIONS --- */}
        <div className='flex-1'>
          {/* minTickets */}
          <div>
            <label className='block text-sm text-gray-600'>Minimum tickets required</label>
            <input
              type='number'
              min={0}
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.minTickets}
              onChange={(e) => setField('minTickets', e.target.value)}
              placeholder='0 = no minimum'
            />
          </div>

          {/* ticketTypes (CSV)
          <div>
            <label className='block text-sm text-gray-600'>Ticket types (comma-separated)</label>
            <input
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.ticketTypes}
              onChange={(e) => setField('ticketTypes', e.target.value)}
              placeholder='e.g., KID,ADULT or IDs'
            />
            <p className='text-xs text-gray-500 mt-1'>Leave empty for any ticket type.</p>
          </div> */}

          {/* minSubtotal */}
          <div>
            <label className='block text-sm text-gray-600'>Minimum order subtotal</label>
            <input
              type='number'
              min={0}
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.minSubtotal}
              onChange={(e) => setField('minSubtotal', e.target.value)}
              placeholder='0 = no minimum'
            />
          </div>

          {/* allowedMemberRanks (CSV)
          <div>
            <label className='block text-sm text-gray-600'>Allowed member ranks (comma-separated)</label>
            <input
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.allowedMemberRanks}
              onChange={(e) => setField('allowedMemberRanks', e.target.value)}
              placeholder='e.g., BRONZE,SILVER,GOLD'
            />
            <p className='text-xs text-gray-500 mt-1'>Leave empty to allow all ranks.</p>
          </div> */}

          {/* firstPurchaseOnly */}
          {/* <div className='flex items-center gap-2 my-3'>
            <input
              id='firstPurchaseOnly'
              type='checkbox'
              className='h-4 w-4'
              checked={form.firstPurchaseOnly}
              onChange={(e) => setField('firstPurchaseOnly', e.target.checked)}
            />
            <label htmlFor='firstPurchaseOnly' className='text-sm'>
              First purchase only
            </label>
          </div> */}
        </div>
      </form>
    </Modal>
  )
}

function getInitialForm(v) {
  const c = v?.conditions || {}

  return {
    // Core
    code: v?.code || '',
    type: v?.type || 'FIXED', // FIXED | PERCENT
    discountAmount: num(v?.discountAmount),
    maxDiscountAmount: v?.type === 'PERCENT' ? num(v?.maxDiscountAmount) : 0,
    minOrderAmount: num(v?.minOrderAmount),
    maxUsage: v?.maxUsage != null ? String(v.maxUsage) : '1',
    perUserLimit: v?.perUserLimit != null ? String(v.perUserLimit) : '1',
    combinable: !!v?.combinable,
    startDate: toLocalInputValue(v?.startDate || new Date()),
    expirationDate: toLocalInputValue(v?.expirationDate || addDays(new Date(), 7)),
    status: v?.status || '',
    description: v?.description || '',

    // Conditions (flat editing fields)
    minTickets: c?.minTickets != null ? String(c.minTickets) : '0',
    ticketTypes: Array.isArray(c?.ticketTypes) ? c.ticketTypes.join(',') : '',
    minSubtotal: c?.minSubtotal != null ? String(c.minSubtotal) : '0',
    allowedMemberRanks: Array.isArray(c?.allowedMemberRanks) ? c.allowedMemberRanks.join(',') : '',
    firstPurchaseOnly: !!c?.firstPurchaseOnly
  }
}

function csvToArray(txt) {
  return String(txt || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function num(v, d = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : d
}

function toDate(localValue) {
  // Accept "YYYY-MM-DDTHH:mm" (from <input type="datetime-local">)
  try {
    // If it's already a Date or ISO string, let Date ctor handle it
    return new Date(localValue)
  } catch {
    return new Date()
  }
}

function toLocalInputValue(dtLike) {
  // Convert Date or ISO string to "YYYY-MM-DDTHH:mm" in local time
  const d = dtLike instanceof Date ? dtLike : new Date(dtLike)
  const pad = (n) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const MM = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default VoucherModal
