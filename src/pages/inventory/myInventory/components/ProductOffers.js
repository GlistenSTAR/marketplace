import React, {Component} from 'react';
import './ProductOffers.css';
import DataTable from "../../../../components/DataTable";
import BroadcastRule from "./BroadcastRule";

class ProductOffers extends Component {

    state={isOpen: false, brActive: false};

    groupProductOffers(productOffers) {
        return productOffers.reduce((carry, offer) => {
            (carry[offer.product.id] = carry[offer.product.id] || {...offer.product, visible: true, productOffers: []}).productOffers.push(offer);
            return carry;
        }, {});
    }

    render() {
        if(this.props.productOffers.length === 0) return null;
        let rows = Object.values(this.groupProductOffers(this.props.productOffers)).map((product) => {
                return {
                    group:  <React.Fragment><span className="product-casnumber ">{product.casNumber}</span><span className="product-name capitalize">{product.casIndexName}</span></React.Fragment>,
                    countLabel: 'Product Offerings: ',
                    rows: product.productOffers.map((offer)=>({
                        id: offer.id,
                        data: [offer.product.casIndexName,
                            offer.packaging.amount.formatNumber(),
                            offer.packaging.container.name,
                            offer.packaging.capacity,
                            (parseInt(offer.packaging.amount, 10) * parseInt(offer.packaging.capacity, 10)).formatNumber(),
                            "$ " + offer.pricing.cost.formatMoney(3),
                            "$ " + offer.pricing.price.formatMoney(3),
                            offer.name,
                            offer.manufacturer.name,
                            offer.productCondition.name,
                            'Unknown']
                    }))
                };
            });
        return (<div className="App">
                <DataTable id="myInventoryTable"
                           selectable
                           sortFunc={(nameColumn) => console.log(nameColumn)}
                           headerInit={[{name: 'Product Name'}, {name: 'Available'}, {name: 'Packaging'}, {name: 'Pkg. size'}, {name: 'Quantity'}, {name: 'Cost'}, {name: 'FOB Price'}, {name: 'Trade Name'}, {name: 'MFR.'}, {name: 'Condition'}, {name: 'MFG Date'}]}
                           contextMenu={
                               [
                                   {action: (id)=>this.props.history.push(`/inventory/edit-inventory/${id}`), label: 'Edit Listing',},
                                   {action: (id, callback, e)=>callback(e), label: 'Custom Broadcast'},
                                   // {action: (id)=>console.log('delete'), label: 'Delete Listing'}
                               ]
                           }
                           rows={rows}
                           rowComponent={<BroadcastRule
                               submitRules={this.props.submitRules}
                               addPopup={this.props.addPopup}
                               removePopup={this.props.removePopup}
                               getProductOffers={this.props.fetchMyProductOffers}
                               targetGroups={this.props.targetGroups}
                               selections={this.props.selections}
                               setFilter={(type) => this.props.setFilter(type)}
                               currentSelected={this.props.currentSelected}
                               productOffersSelection={this.state.productOffersSelection}
                               setActiveBroadcastButton={active => this.props.setActiveBroadcastButton(active)}/>}
                />
            </div>
        );
    }
}
export default ProductOffers;
