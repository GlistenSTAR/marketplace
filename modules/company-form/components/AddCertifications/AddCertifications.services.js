export const SubmitFile = async (values, { setSubmitting }, props) => {
  try {
    if (props.popupValues.uploadedFile) {
      await props.removeAttachment(props.popupValues.uploadedFile.id)
      await props.addAttachment(values.file, values.documentId, {})
      props.onUpload()
    } else {
      await props.addAttachment(values.file, values.documentId, {})
      props.onUpload()
    }
  } catch (e) {
    console.error(e)
  } finally {
    setSubmitting(false)
  }
}