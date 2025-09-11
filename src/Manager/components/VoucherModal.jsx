import { useState, useEffect } from 'react'
import { Modal } from 'antd'
import { toLocalInputValue } from '@/utils/localDate'

const VoucherModal = ({ visible, onClose, onSubmit, initValue }) => {
  // const [form] = Form.useForm()
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

  // ---------------- Form helpers ----------------
  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
    console.log(form.code)
  }

  //load initial values
  useEffect(() => {
    if (initValue) {
      setForm({
        code: initValue.code || '',
        type: initValue.type || 'FIXED',
        discountAmount: initValue.discountAmount ?? 0,
        maxDiscountAmount: initValue.maxDiscountAmount ?? 0,
        minOrderAmount: initValue.minOrderAmount ?? 0,
        maxUsage: initValue.maxUsage ?? 1,
        perUserLimit: initValue.perUserLimit ?? 1,
        combinable: !!initValue.combinable,
        startDate: toLocalInputValue(new Date(initValue.startDate)),
        expirationDate: toLocalInputValue(new Date(initValue.expirationDate)),
        status: initValue.status || 'ACTIVE',
        description: initValue.description || ''
      })
    } else {
      setForm(defaultForm())
    }
  }, [initValue, visible])

  const handleOk = () => {
    onSubmit(form)
  }

  const handleCancel = () => {
    setForm(defaultForm())
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
      <form className='space-y-3 gap-3 flex flex-col md:flex-row' onSubmit={onSubmit}>
        <div className='flex-3'>
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
        </div>

        <div className='flex-4'>
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
              <label className='block text-sm text-gray-600'>Start at</label>
              <input
                type='datetime-local'
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.startDate}
                onChange={(e) => setField('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm text-gray-600'>End at</label>
              <input
                type='datetime-local'
                className='mt-1 w-full border rounded px-3 py-2'
                value={form.expirationDate}
                onChange={(e) => setField('expirationDate', e.target.value)}
              />
            </div>
          </div>

          {/* <div>
            <label className='block text-sm text-gray-600'>Status</label>
            <select
              disabled={initValue?.status === 'EXPIRED'}
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.status}
              onChange={(e) => setField('status', e.target.value)}
            >
              <option value='ACTIVE'>Active</option>
              <option value='INACTIVE'>Inactive</option>
              <option value='SCHEDULED'>Scheduled</option>
              <option value='EXPIRED'>Expired</option>
            </select>
          </div> */}

          <div>
            <label className='block text-sm text-gray-600'>Description</label>
            <input
              className='mt-1 w-full border rounded px-3 py-2'
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder='Optional'
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default VoucherModal
