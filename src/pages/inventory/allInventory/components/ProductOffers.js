import React, {Component} from 'react';
import './ProductOffers.css';
import moment from "moment";
//import AddCart from '../../../cart/components/AddCart';
import {DATE_FORMAT} from "../../../../utils/constants";
import {getUnit} from "../../../../utils/functions";
import DataTable from "../../../../components/DataTable";
import Spinner from '../../../../components/Spinner/Spinner';
class ProductOffers extends Component {
  componentDidMount(){
      new Promise(resolve => {
          this.props.getMerchant(this.props.identity.data.id, resolve)
      }).then(() => console.log("data fetched"))
  }

    groupProductOffers(productOffers) {
        return productOffers.reduce((carry, offer) => {
            (carry[offer.product.id] = carry[offer.product.id] || {...offer.product, visible: true, productOffers: []}).productOffers.push(offer);
            return carry;
        }, {});
    }

    render() {

        if(this.props.productOffers.length === 0) return <Spinner />;
        let rows = Object.values(this.groupProductOffers(this.props.productOffers)).map((product) => {
            return {
                group: <><span className="product-casnumber">{product.casNumber}</span><span className="product-name capitalize">{product.casIndexName}</span></>,
                rows: product.productOffers.map((offer)=>{
                const unit = getUnit(offer.packaging.unit.name);
                const price = offer.pricing.tiers.length > 1 ? "$" + offer.pricing.tiers[offer.pricing.tiers.length - 1].price.formatMoney(3) + ' - ' + "$" + offer.pricing.tiers[0].price.formatMoney(3): "$" + offer.pricing.price.formatMoney(3);
                const packageSize = offer.packaging.size;
                const packageUnit = offer.packaging.packagingType.name;
                //const countryException = ["USA", "Canada"]
                //const countryName = offer.warehouse.address.province.country ? offer.warehouse.address.province.country.name : null

                const location = (this.props.identity.data.id === offer.merchant.id || this.props.identity.data.branch.id === offer.merchant.id)
                        ? `${offer.warehouse.address.city}, ${offer.warehouse.address.province.name}` : `${offer.warehouse.address.province.name}, ${offer.warehouse.address.country.name}`

                return{
                    id: offer.id,
                    data: [
                        offer.warehouse.warehouseName,
                        offer.pkgAmount.formatNumber(),
                        `${packageSize} ${unit} ${packageUnit}`,
                        `${(parseInt(offer.pkgAmount, 10) * parseInt(offer.packaging.size, 10)).formatNumber()} ${unit}`,
                        price,
                        offer.name,
                        offer.manufacturer.name,
                        offer.origin.name,
                        offer.expirationDate ? moment(offer.expirationDate).format(DATE_FORMAT) : 'none',
                        offer.assayMin + '/' + offer.assayMax,
                        offer.productCondition.name,
                        offer.productForm.name,
                        location
                        ]
                }})
            };
        });
        return (
            <div className="App ">
                <DataTable id="allInventoryTable"
                           sortFunc={(nameColumn) => console.log(nameColumn)}
                           headerInit={[{name: 'Merchant'}, {name: 'Available'}, {name: 'Packaging'}, {name: 'Quantity'}, {name: 'FOB Price'}, {name: 'Trade Name'}, {name: 'MFR.'}, {name: 'Origin'}, {name: 'Expiration'}, {name: 'Assay'}, {name: 'Condition'}, {name: 'Form'}, {name: 'Location'}]}
                           rows={rows}
                           history={this.props.history}
                />
            </div>
        );
    }
}
export default ProductOffers;