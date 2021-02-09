import PropTypes from 'prop-types'
import { Header, FormGroup } from 'semantic-ui-react'
import { Input, Checkbox } from 'formik-semantic-ui-fixed-validation'
import { FormattedMessage } from 'react-intl'
//Components
import { Required } from '../../../../../../components/constants/layout'
import { AddressForm } from '../../../../../address-form/'
import { PhoneNumber } from '../../../../../phoneNumber'
//Styles
import { CustomSegment } from './BranchesSidebar.styles'
/**
 * Form content for edit or add warehouse.
 * @category Settings - Locations - Branches
 * @component
 */
const BranchesForm = ({ intl, formikProps, sidebarValues }) => {
  const { formatMessage } = intl
  const { setFieldValue, values, setFieldTouched, errors, touched, isSubmitting } = formikProps

  return (
    <>
      <FormGroup widths='equal' style={{ marginTop: '14px' }} data-test='settings_branches_popup_name_inp'>
        <Input
          type='text'
          label={
            <>
              <FormattedMessage id='settings.branchName' defaultMessage='Branch Name' />
              <Required />
            </>
          }
          name='deliveryAddress.addressName'
          inputProps={{
            placeholder: formatMessage({
              id: 'settings.warehouses.enterBranchName',
              defaultMessage: 'Enter Branch Name'
            })
          }}
        />
      </FormGroup>

      <AddressForm
        prefix={'deliveryAddress'}
        required={true}
        setFieldValue={setFieldValue}
        values={values}
        initialZipCodes={[
          {
            key: values.zipID.toString(),
            value: values.deliveryAddress.address.zip,
            text: values.deliveryAddress.address.zip
          }
        ]}
      />

      <Header as='h3'>
        <FormattedMessage id='settings.contactInfo' defaultMessage='Contact Info' />
      </Header>
      <CustomSegment>
        <FormGroup data-test='settings_branches_popup_contactName_inp'>
          <Input
            type='text'
            label={
              <>
                {formatMessage({ id: 'global.contactName', defaultMessage: 'Contact Name' })}
                <Required />
              </>
            }
            name='deliveryAddress.contactName'
            fieldProps={{ width: 16 }}
            inputProps={{
              placeholder: formatMessage({
                id: 'settings.warehouses.enterContactName',
                defaultMessage: 'Enter Contact Name'
              })
            }}
          />
        </FormGroup>
        <FormGroup widths='equal' data-test='settings_branches_popup_phoneEmail_inp'>
          <PhoneNumber
            name='deliveryAddress.contactPhone'
            values={values}
            label={
              <>
                {<FormattedMessage id='global.phone' defaultMessage='Phone' />}
                <Required />
              </>
            }
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
          />
          <Input
            type='text'
            label={
              <>
                {formatMessage({ id: 'global.contactEmail', defaultMessage: 'Contact Email' })}
                <Required />
              </>
            }
            name='deliveryAddress.contactEmail'
            inputProps={{
              placeholder: formatMessage({
                id: 'settings.warehouses.enterEmailAddress',
                defaultMessage: 'Enter Email Address'
              })
            }}
          />
        </FormGroup>
      </CustomSegment>

      {!sidebarValues && (
        <FormGroup data-test='settings_branches_popup_contactName_inp'>
          <Checkbox
            label={formatMessage({
              id: 'settings.alsoCreateAsPickUpLocation',
              defaultMessage: 'Also create as Warehouse'
            })}
            name='alsoCreate'
            inputProps={{ 'data-test': 'settings_branches_popup_pick_up_location_chckb' }}
          />
        </FormGroup>
      )}
    </>
  )
}

BranchesForm.propTypes = {
  intl: PropTypes.object,
  formikProps: PropTypes.object,
  sidebarValues: PropTypes.object
}

BranchesForm.defaultProps = {
  intl: {},
  formikProps: {},
  sidebarValues: null
}

export default BranchesForm
