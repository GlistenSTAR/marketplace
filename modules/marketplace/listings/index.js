import ListingsContainer from './components/ListingsContainer'
import { DatagridProvider } from '~/modules/datagrid'
import { CompanyProductInfo } from '~/modules/company-product-info'

export const Listings = props => {
  const urlApiConfig = {
    url: '/prodex/api/product-offers/broadcasted/datagrid/',
    searchToFilter: v => {
      let filters = { or: [], and: [] }
      if (v && v.filterName) {
        filters.or = [
          { operator: 'LIKE', path: 'ProductOffer.companyProduct.intProductName', values: [`%${v.filterName}%`] },
          { operator: 'LIKE', path: 'ProductOffer.companyProduct.intProductCode', values: [`%${v.filterName}%`] },
          {
            operator: 'LIKE',
            path: 'ProductOffer.companyProduct.companyGenericProduct.name',
            values: [`%${v.filterName}%`]
          },
          {
            operator: 'LIKE',
            path: 'ProductOffer.companyProduct.companyGenericProduct.productGroup.tags.name',
            values: [`%${v.filterName}%`]
          }
        ]
      }
      if (v && v.filterTags && v.filterTags.length > 0) {
        filters.and = v.filterTags.map(idTag => {
          return {
            operator: 'EQUALS',
            path: 'ProductOffer.companyProduct.companyGenericProduct.productGroup.tags.id',
            values: [idTag]
          }
        })
      }
      return filters
    }
  }
  return (
    <>
      <CompanyProductInfo fromMarketPlace />
      <DatagridProvider apiConfig={urlApiConfig} preserveFilters skipInitLoad>
        <ListingsContainer {...props} />
      </DatagridProvider>
    </>
  )
}
