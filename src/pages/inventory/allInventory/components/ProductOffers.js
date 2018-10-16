import React, {Component} from 'react';
import './ProductOffers.css';
import moment from "moment";
import AddCart from '../../../cart/AddCart'
import {DATE_FORMAT} from "../../../../utils/constants";
import {getUnit} from "../../../../utils/functions";
import BroadcastRule from "../../myInventory/components/BroadcastRule";
import DataTable from "../../../../components/DataTable";

class ProductOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            products: this.groupProductOffers(this.props.productOffers)
        };
    }

    componentWillReceiveProps(nextProps){
        this.setState({products: this.groupProductOffers(nextProps.productOffers)});
    }

    groupProductOffers(productOffers) {
        return productOffers.reduce((carry, offer) => {
            (carry[offer.product.id] = carry[offer.product.id] || {...offer.product, visible: true, productOffers: []}).productOffers.push(offer);
            return carry;
        }, {});
    }

   //TODO:: Add to cart
   addCart(id){
        this.props.addPopup(<AddCart id={id}/>)
   }

    render() {
        if(this.props.productOffers.length === 0) return null;
        let rows = Object.values(this.state.products).map((product) => {
            return {
                group:  <React.Fragment><span className="product-casnumber">{product.casNumber}</span><span className="product-name capitalize">{product.casIndexName}</span></React.Fragment>,
                rows: product.productOffers.map((offer)=>{
                const unit = getUnit(offer.packaging.unit.name);
                const packageSize = offer.packaging.capacity;
                const packageUnit = offer.packaging.container.name;
                return{
                    id: offer.id,
                    data: [offer.merchantVisibility ? offer.merchant.email : "Anonymous",
                        offer.packaging.amount.formatNumber(),
                        `${packageSize} ${unit} ${packageUnit}`,
                        (parseInt(offer.packaging.amount, 10) * parseInt(offer.packaging.capacity, 10)).formatNumber() + unit,
                        "$ " + offer.pricing.price.formatMoney(2),
                        offer.name,
                        offer.manufacturer.name,
                        offer.origin.name,
                        offer.expirationDate ? moment(offer.expirationDate).format(DATE_FORMAT) : 'none',
                        'Unknown',
                        offer.productCondition.name,
                        offer.productForm.name,
                        offer.warehouse.name + " (" + offer.warehouse.address.province.name + ")",
                        <button className='info-button' onClick={()=>{this.addCart(offer.id)}}>BUY</button>]
                }})
            };
        });
        return (
            <div className="App ">
                <DataTable id="allInventoryTable"
                           isFetching={this.props.isFetching}
                           sortFunc={(nameColumn) => console.log(nameColumn)}
                           headerInit={[{name: 'Merchant'}, {name: 'Available'}, {name: 'Packaging'}, {name: 'Quantity'}, {name: 'FOB Price'}, {name: 'Trade Name'}, {name: 'MFR.'}, {name: 'Origin'}, {name: 'Expiration'}, {name: 'Assay'}, {name: 'Condition'}, {name: 'Form'}, {name: 'Location'}, {name: null}]}
                           rows={rows}
                />
            </div>
        );
    }
}
export default ProductOffers;