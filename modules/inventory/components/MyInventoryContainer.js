import React from "react";

import { connect } from 'react-redux'
import Router from 'next/router'
import MyInventory from './MyInventory'
import * as Actions from '../actions'
import { withDatagrid } from '~/modules/datagrid'
import { Label, Popup, List } from "semantic-ui-react";

import { openBroadcast } from '~/modules/broadcast/actions'
import { applyFilter } from '~/modules/filter/actions'

const transformLotNumbers = lots => {
  if (lots.length > 1) {
    let onMouseoverTest = lots.map(d => (d.lotNumber))
    return (
      <div>
        <Popup
          content={<List items={onMouseoverTest} />}
          trigger={<Label>Multiple</Label>}
        />
      </div>
    )
  }
  else {
    return lots[0].lotNumber
  }
}

function mapStateToProps(store, { datagrid }) {
  return {

    ...store.simpleAdd,
    appliedFilter: store.filter.filter.appliedFilter,
    
    rows: datagrid.rows.map(po => {
      const qtyPart = `${po.product.packagingUnit ? po.product.packagingUnit.nameAbbreviation : ''}`
      return {
        id: po.id,
        product: po.product,
        productName: po.product.productName,
        productNumber: po.product.productCode
          ? po.product.productCode
          : "N/A",
        casNumberCombined: po.product.casNumberCombined
          ? po.product.casNumberCombined
          : "Unmapped",
        chemicalName: po.product.casProduct
          ? po.product.casProduct.chemicalName
          : po.product.productName,
        warehouse: po.warehouse.warehouseName,
        productId: po.product.casProduct ? po.product.casProduct.id : 0,
        available: po.pkgAmount.formatNumber(),
        packaging: po.product.packagingType && po.product.packagingType.name ? po.product.packagingType.name : 'N/A',
        pkgAmount: qtyPart ? `${po.product.packagingSize} ${qtyPart}` : 'N/A',
        quantity: qtyPart ? `${(parseInt(po.pkgAmount, 10) * parseInt(po.product.packagingSize, 10)).formatNumber()} ${qtyPart}` : 'N/A',
        cost: po.pricing.cost ? "$" + po.pricing.cost.formatMoney(3) : 'N/A',
        fobPrice: po.pricingTiers.length > 1 ?
          ("$" + po.pricingTiers[po.pricingTiers.length - 1].price.formatMoney(3)
            + ' - ' + "$" + po.pricingTiers[0].price.formatMoney(3))
          : po.pricing.price ? ("$" + po.pricing.price.formatMoney(3)) : 'N/A',
        manufacturer: po.manufacturer && po.manufacturer.name ? po.manufacturer.name : 'N/A',
        broadcasted: po.broadcasted,
        lotNumber: transformLotNumbers(po.lots),
        status: po.status // new broadcasted
      }
    }),
  }
}

export default withDatagrid(connect(mapStateToProps, { ...Actions, openBroadcast, applyFilter })(MyInventory))

