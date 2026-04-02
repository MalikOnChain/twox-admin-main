import { useState } from 'react'

import PhoneInput from '@/components/form/group-input/PhoneInput'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { EnvelopeIcon } from '@/icons'

import { IUserWithProfile } from '@/types/users'

const countries = [
  { code: 'US', label: '+1' },
  { code: 'GB', label: '+44' },
  { code: 'CA', label: '+1' },
  { code: 'AU', label: '+61' },
]

const EditModalOnMetaCard = ({
  user,
  isOpen,
  isSaving,
  closeModal,
  handleSave,
}: {
  user: IUserWithProfile
  isOpen: boolean
  isSaving: boolean
  closeModal: () => void
  handleSave: (formData: any, addressData: any) => void
}) => {
  const [formData, setFormData] = useState({
    fullName: user.profile?.fullName,
    email: user.email,
    phone: user.profile?.phone,
    firstName: user.profile?.firstName,
    lastName: user.profile?.lastName,
  })

  const [addressData, setAddressData] = useState({
    country: user.profile?.country,
    city: user.profile?.city,
    state: user.profile?.state,
    street: user.profile?.street,
    postalCode: user.profile?.postalCode,
    residentialAddress: user.profile?.residentialAddress,
  })

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    postalCode: '',
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(phone)
  }

  const validatePostalCode = (code: string) => {
    const postalRegex = /^[A-Z\d]{3,10}$/i
    return postalRegex.test(code)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, email: value })
    if (!validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email address',
      }))
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
    }
  }

  const handlePhoneChange = (phoneNumber: string) => {
    setFormData({ ...formData, phone: phoneNumber })
    if (!validatePhone(phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Please enter a valid phone number',
      }))
    } else {
      setErrors((prev) => ({ ...prev, phone: '' }))
    }
  }

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAddressData({ ...addressData, postalCode: value })
    if (!validatePostalCode(value)) {
      setErrors((prev) => ({
        ...prev,
        postalCode: 'Please enter a valid postal code',
      }))
    } else {
      setErrors((prev) => ({ ...prev, postalCode: '' }))
    }
  }

  const hasErrors = errors.email || errors.phone || errors.postalCode

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            Edit Personal Information
          </h4>
          <p className='mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400'>
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className='flex flex-col'>
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <h5 className='mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90'>
                Personal Information
              </h5>

              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>First Name</Label>
                  <Input
                    type='text'
                    // value={formData.firstName || formData.fullName}
                    value={formData.firstName || formData.fullName}
                    onChange={(e) => {
                      if (formData.firstName) {
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                        })
                      } else {
                        setFormData({
                          ...formData,
                          fullName: e.target.value,
                          firstName: e.target.value,
                        })
                      }
                    }}
                  />
                </div>

                <div className='col-span-2 lg:col-span-1'>
                  <Label>Last Name</Label>
                  <Input
                    type='text'
                    value={formData.lastName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <div className='col-span-2 lg:col-span-1'>
                  <Label>Email Address</Label>

                  <div className='relative'>
                    <Input
                      placeholder='info@gmail.com'
                      type='text'
                      className='pl-[62px]'
                      value={formData.email}
                      onChange={handleEmailChange}
                      error={errors.email !== ''}
                      errorMessage={errors.email}
                    />
                    <span className='absolute top-1/2 left-0 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400'>
                      <EnvelopeIcon />
                    </span>
                  </div>
                </div>

                <div className='col-span-2 lg:col-span-1'>
                  <Label>Phone</Label>

                  <PhoneInput
                    selectPosition='start'
                    countries={countries}
                    placeholder='+1 (555) 000-0000'
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>City</Label>
                  <Input
                    type='text'
                    value={addressData.city}
                    onChange={(e) =>
                      setAddressData({ ...addressData, city: e.target.value })
                    }
                  />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Country</Label>
                  <Input
                    type='text'
                    value={addressData.country}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        country: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>State</Label>
                  <Input
                    type='text'
                    value={addressData.state}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        state: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Street</Label>
                  <Input
                    type='text'
                    value={addressData.street}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        street: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Postal Code</Label>
                  <Input
                    type='text'
                    value={addressData.postalCode}
                    onChange={handlePostalCodeChange}
                    error={errors.postalCode !== ''}
                    errorMessage={errors.postalCode}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Close
            </Button>
            <Button
              size='sm'
              onClick={() => handleSave(formData, addressData)}
              disabled={!!hasErrors || isSaving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditModalOnMetaCard
