import * as AT from './action-types'
import * as api from './api'

export function addAttachment(attachment, type) {
  return {
    type: AT.INVENTORY_ADD_ATTACHMENT,
    payload: api.addAttachment(attachment, type)
  }
}

export function addProductOffer(values, poId = false) {

  let params = {
    attachments: values.attachments ? values.attachments : null,
    inStock: !!values.inStock,
    pkgAmount: parseInt(values.pkgAmount),
    pricing: {
      cost: values.pricing.cost ? parseInt(values.pricing.cost) : null,
      price: values.pricing.price ? parseInt(values.pricing.price) : parseInt(values.pricing.tiers[0].price),
      tiers: values.pricing.tiers.map((tier, index) => {
        return {
          price: parseInt(tier.price),
          quantityFrom: parseInt(!index ? values.minimum : tier.quantityFrom)
        }
      })
    },
    processingTimeDays: parseInt(values.processingTimeDays),
    product: parseInt(values.product),
    productCode: values.productCode ? values.productCode : null,
    productCondition: values.productCondition ? parseInt(values.productCondition) : null,
    productForm: values.productForm ? parseInt(values.productForm) : null,
    productGrades: values.productGrades ? values.productGrades.map(pg => {
      return {
        id: parseInt(pg.id)
      }
    }) : null,
    tradeName: values.tradeName ? values.tradeName : null,
    validityDate: values.validityDate ? values.validityDate + "T00:00:00Z" : null,
    warehouse: parseInt(values.warehouse)
  }

  if (!params.lots) {
    params.lots = [{
      expirationDate: values.validityDate ? values.validityDate + "T00:00:00Z" : null,
      lotNumber: "1",
      pkgAmount: params.pkgAmount
    }]
  }

  if (poId) {
    return {
      type: AT.INVENTORY_EDIT_PRODUCT_OFFER,
      payload: api.updateProductOffer(poId, params)
    }
  } else {
    return {
      type: AT.INVENTORY_ADD_PRODUCT_OFFER,
      payload: api.addProductOffer(params)
    }
  }
}

export function errorTooLarge(fileName, fileMaxSize) {
  return {
    type: AT.ERROR_TOO_LARGE_FILE,
    payload: {
      fileName: blob.name,
      maxSize: fileMaxSize
    }
  }
}

export function errorUploadFail(fileName) {
  return {
    type: AT.ERROR_UPLOAD_FILE_FAILED,
    payload: {
      fileName: fileName
    }
  }
}

export function fillProduct(product) {
  return {
    type: AT.INVENTORY_FILL_PRODUCT,
    payload: {
      data: [{
        text: product.casProduct.casIndexName,
        value: product,
        key: product.casProduct.id
      }]
    }
  }
}

export function getProductOffer(productOfferId) {
  return {
    type: AT.INVENTORY_GET_PRODUCT_OFFER,
    payload: api.getProductOffer(productOfferId)
  }
}

export function getWarehouses() {
  return {
    type: AT.INVENTORY_GET_WAREHOUSES,
    payload: api.getWarehouses()
  }
}

export function linkAttachment(isLot, itemId, aId) {
  return {
    type: AT.INVENTORY_LINK_ATTACHMENT,
    payload: api.linkAttachment(isLot, itemId, aId)
  }
}

export function loadFile(attachment) {
  return {
    type: AT.INVENTORY_LOAD_FILE,
    payload: api.loadFile(attachment)
  }
}

export function resetForm() {
  return {
    type: AT.INVENTORY_RESET_FORM,
    payload: {}
  }
}

export function searchProducts(text) {
  return {
    type: AT.INVENTORY_SEARCH_PRODUCTS,
    async payload() {
      const response = await api.searchProducts(text)

      return {
        data: response.data ? response.data.map(p => ({
          text: p.casProduct.casIndexName,
          value: p.id,
          key: p.casProduct.id
        })) : []
      }
    }
  }
}

export function setFileIds(fileId) {
  return {
    type: AT.INVENTORY_SET_FILE_ID,
    payload: {
      fileId: fileId
    }
  }
}

export function uploadDocuments(isLot, productOfferId, fileIds) {
  let files = []
  (function loop(j) {
    if (j < fileIds.length) new Promise((resolve, reject) => {
      files[j] = fileIds[j].id.id
      linkAttachment(isLot, productOfferId, files[j]).then(() => {
        resolve()
      }).catch(e => {
        // TODO: solve errors
        reject()
      });
    }).then(loop.bind(null, j+1));
  })(0)
}