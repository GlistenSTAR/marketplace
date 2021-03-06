import React, { useState, useEffect } from 'react'
import {
  Modal,
  FormGroup,
  Grid,
  GridRow,
  GridColumn,
  Image
} from 'semantic-ui-react'
import { Form, Input, Button, Dropdown } from 'formik-semantic-ui-fixed-validation'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
// Components
import ErrorFocus from '../../../../components/error-focus'
import UploadAttachment from '../../../inventory/components/upload/UploadAttachment'
// Services
import { errorMessages } from '../../../../constants/yupValidation'
// Styles
import {
  Required,
  GridStyled,
  DivImageWrapper,
  DivCustomLabel,
  DivLeftLabel,
  DivEmptyImage
} from '../../../../components/constants/layout'

/**
 * Validation of form.
 * @category Admin Settings - Edit Packaging Types
 * @method
 */
const formValidation = Yup.object().shape({
  val0: Yup.string().trim().min(1, 'Too short').required('Required'),
  val1: Yup.number().required('Required'),
  val2: Yup.number().moreThan(0, errorMessages.greaterThan(0)).required('Required'),
  val3: Yup.number().moreThan(0, errorMessages.greaterThan(0)).required('Required'),
  val4: Yup.number().moreThan(0, errorMessages.greaterThan(0)).required('Required'),
  val5: Yup.number().required('Required'),
  val6: Yup.number().integer(errorMessages.integer).min(1, errorMessages.minimum(1)).required('Required'),
  val7: Yup.number().integer(errorMessages.integer).min(1, errorMessages.minimum(1)).required('Required'),
  val8: Yup.number().min(0, errorMessages.minimum(0)).required('Required'),
  val9: Yup.number().required('Required')
})

/**
 * EditUnitOfPackagingPopup Component
 * @category Admin Settings - Edit Packaging Types
 * @components
 */
const EditUnitOfPackagingPopup = props => {
  const [pictureUrl, setPictureUrl] = useState(null)
  const [picture, setPicture] = useState(null)
  const [hasPicture, setHasPicture] = useState(false)
  const [modifiedPicture, setModifiedPicture] = useState(false)

  const {
    closeEditPopup,
    config,
    popupValues,
    postNewRequest,
    putEditedDataRequest,
    measureOptions,
    dimensionUnits,
    weightUnits,
    getPackagingTypeImage,
    uploadPackagingTypeImage,
    deletePackagingTypeImage,
    packagingTypeImageLoading
  } = props

  useEffect(async () => {
    if (popupValues) {
      try {
        const { value } = await getPackagingTypeImage(popupValues.id)
        const file = new Blob([value])
        let fileURL = URL.createObjectURL(file)
        setPicture(value)
        setPictureUrl(fileURL)
        setHasPicture(true)
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  /**
   * Get initial values for form.
   * @category Admin Settings - Edit Packaging Types
   * @method
   */
  const initialFormValues = popupValues
    ? {
      val0: popupValues.name,
      val1: popupValues.measureTypeId,
      val2: popupValues.height,
      val3: popupValues.length,
      val4: popupValues.width,
      val5: popupValues.dimensionUnit?.id,
      val6: popupValues.palletPkgMax,
      val7: popupValues.palletPkgMin,
      val8: popupValues.weight,
      val9: popupValues.weightUnit?.id
    } : {
      val0: '',
      val1: '',
      val2: '',
      val3: '',
      val4: '',
      val5: '',
      val6: '',
      val7: '',
      val8: '',
      val9: ''
    }

  return (
    <Modal closeIcon onClose={() => closeEditPopup()} open centered={false}>
      <Modal.Header>
        {popupValues ? (
          <><FormattedMessage id='global.edit' defaultMessage='Edit' /> {config.addEditText}</>
        ) : (
          <><FormattedMessage id='global.add' defaultMessage='Add' /> {config.addEditText}</>
        )}
      </Modal.Header>
      <Modal.Content>
        <Form
          initialValues={initialFormValues}
          validationSchema={formValidation}
          onReset={closeEditPopup}
          onSubmit={async (values, { setSubmitting }) => {
            let data = {
              [config.edit[0].name]: values.val0.trim(),
              [config.edit[1].name]: values.val1,
              [config.edit[2].name]: parseFloat(values.val2),
              [config.edit[3].name]: parseFloat(values.val3),
              [config.edit[4].name]: parseFloat(values.val4),
              [config.edit[5].name]: values.val5,
              [config.edit[6].name]: parseFloat(values.val6),
              [config.edit[7].name]: parseFloat(values.val7),
              [config.edit[8].name]: parseFloat(values.val8),
              [config.edit[9].name]: values.val9
            }
            try {
              if (popupValues) {

                await putEditedDataRequest(config, popupValues.id, data)
                if (modifiedPicture) {
                  if (hasPicture) {
                    if (picture) await uploadPackagingTypeImage(popupValues.id, picture)
                    else deletePackagingTypeImage(popupValues.id)
                  } else {
                    if (picture) await uploadPackagingTypeImage(popupValues.id, picture)
                  }
                }
              } else {
                const response = await postNewRequest(config, data)
                if (picture) await uploadPackagingTypeImage(response.id, picture)
              }
              if (config.globalReload) props[config.globalReload]()
            } catch (error) {
              console.error(error)
            } finally {
              setSubmitting(false)
            }
          }}>

          <GridStyled>
            <GridRow>
              <GridColumn width={10} data-test='admin_edit_unit_packaging_name_inp'>
                <Input
                  inputProps={{ type: config.edit[0].type }}
                  label={<>{config.edit[0].title}<Required /></>}
                  name='val0'
                />
                <Dropdown
                  label={<>{config.edit[1].title}<Required /></>}
                  options={measureOptions}
                  name='val1'
                  inputProps={{ 'data-test': 'admin_edit_unit_packaging_type_drpdn' }}
                />
              </GridColumn>
              <GridColumn width={6}>
                <DivCustomLabel>
                  <FormattedMessage id='global.image' defaultMessage='Image' />
                </DivCustomLabel>
                <DivImageWrapper>
                  <UploadAttachment
                    acceptFiles='image/jpeg, image/png, image/gif, image/svg'
                    name='packagingTypeImage'
                    filesLimit={1}
                    fileMaxSize={2}
                    loading={packagingTypeImageLoading}
                    onChange={async files => {
                      if (files.length) {
                        try {
                          const file = new Blob([files[0]], { type: files[0].type})
                          let fileURL = URL.createObjectURL(file)
                          setPicture(files[0])
                          setPictureUrl(fileURL)
                          setModifiedPicture(true)
                        } catch (error) {
                          console.error(error)
                        }
                      }
                    }}
                    attachments={pictureUrl ? [pictureUrl] : []}
                    removeAttachment={async () => {
                      setPicture(null)
                      setPictureUrl(null)
                      setModifiedPicture(true)
                    }}
                    emptyContent={
                      <DivEmptyImage>
                        <FormattedMessage id='global.clickToUpload' defaultMessage='Click to upload' />
                      </DivEmptyImage>
                    }
                    uploadedContent={<div>{!!pictureUrl && (<Image src={pictureUrl} />)}</div>}
                  />
                </DivImageWrapper>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn width={9}>
                <DivCustomLabel>
                  <FormattedMessage id='global.dimensions' defaultMessage='Dimensions' />
                </DivCustomLabel>
                <Grid>
                  <GridRow>
                    <GridColumn width={1}>
                      <DivLeftLabel>{config.edit[4].title}<Required /></DivLeftLabel>
                    </GridColumn>
                    <GridColumn width={4} data-test='admin_edit_unit_packaging_width_inp'>
                      <Input
                        inputProps={{ type: config.edit[4].type, step: config.edit[4].step }}
                        name='val4'
                        step={config.edit[4].step}
                      />
                    </GridColumn>
                    <GridColumn width={1}>
                      <DivLeftLabel>{config.edit[3].title}<Required />
                      </DivLeftLabel>
                    </GridColumn>
                    <GridColumn width={4} data-test='admin_edit_unit_packaging_length_inp'>
                      <Input
                        inputProps={{ type: config.edit[3].type, step: config.edit[3].step }}
                        name='val3'
                        step={config.edit[3].step}
                      />
                    </GridColumn>
                    <GridColumn width={1}>
                      <DivLeftLabel>
                        {config.edit[2].title}
                        <Required />
                      </DivLeftLabel>
                    </GridColumn>
                    <GridColumn width={4} data-test='admin_edit_unit_packaging_height_inp'>
                      <Input
                        inputProps={{ type: config.edit[2].type, step: config.edit[2].step }}
                        name='val2'
                        step={config.edit[2].step}
                      />
                    </GridColumn>
                  </GridRow>
                </Grid>
              </GridColumn>

              <GridColumn width={5}>
                <Dropdown
                  label={<>{config.edit[5].title}<Required /></>}
                  options={dimensionUnits}
                  name='val5'
                  inputProps={{ 'data-test': 'admin_add_pallet_pkg_dimension_unit' }}
                />
              </GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn width={4} data-test='admin_add_pallet_pkg_weight'>
                <Input
                  inputProps={{ type: config.edit[8].type, step: config.edit[8].step }}
                  label={<>{config.edit[8].title}<Required /></>}
                  name='val8'
                  step={config.edit[8].step}
                />
              </GridColumn>
              <GridColumn width={5}></GridColumn>
              <GridColumn width={5}>
                <Dropdown
                  label={<>{config.edit[9].title}<Required /></>}
                  options={weightUnits}
                  name='val9'
                  inputProps={{ 'data-test': 'admin_add_pallet_pkg_weight_unit' }}
                />
              </GridColumn>
              <GridColumn width={2}></GridColumn>
            </GridRow>

            <GridRow>
              <GridColumn width={4} data-test='admin_add_pallet_pkg_min_inp'>
                <Input
                  inputProps={{ type: config.edit[7].type, step: config.edit[7].step }}
                  label={<>{config.edit[7].title}<Required /></>}
                  name='val7'
                  step={config.edit[7].step}
                />
              </GridColumn>
              <GridColumn width={5}></GridColumn>
              <GridColumn width={4} data-test='admin_add_pallet_pkg_max_inp'>
                <Input
                  inputProps={{ type: config.edit[6].type, step: config.edit[6].step }}
                  label={<>{config.edit[6].title}<Required /></>}
                  name='val6'
                  step={config.edit[6].step}
                />
              </GridColumn>
              <GridColumn width={3}></GridColumn>
            </GridRow>
          </GridStyled>
          <div style={{ textAlign: 'right' }}>
            <Button.Reset data-test='admin_edit_unit_packaging_cancel_btn'>
              <FormattedMessage id='global.cancel' defaultMessage='Cancel' />
            </Button.Reset>
            <Button.Submit data-test='admin_edit_unit_packaging_save_btn'>
              <FormattedMessage id='global.save' defaultMessage='Save' />
            </Button.Submit>
          </div>
          <ErrorFocus />
        </Form>
      </Modal.Content>
    </Modal>
  )
}

EditUnitOfPackagingPopup.propTypes = {
  dimensionUnits: PropTypes.array,
  weightUnits: PropTypes.array,
  measureOptions: PropTypes.array,
  closeEditPopup: PropTypes.func,
  putEditedDataRequest: PropTypes.func,
  popupValues: PropTypes.object,
  config: PropTypes.object,
  packagingTypeImageLoading: PropTypes.bool
}

EditUnitOfPackagingPopup.defaultValues = {
  dimensionUnits: [],
  weightUnits: [],
  measureOptions: [],
  closeEditPopup: () => {},
  putEditedDataRequest: () => {},
  popupValues: null,
  config: {},
  packagingTypeImageLoading: false
}

export default EditUnitOfPackagingPopup
