import React, {Component} from 'react';
import './SearchProducts.css';
import RemoteComboBox from "../../../../../../components/ComboBox/RemoteComboBox";

class SearchProducts extends Component {

    render() {
        return (
            <div className="test">
                <h6>CHEMICAL SEARCH</h6>

                    <RemoteComboBox items={this.props.searchedProducts} api={(text) => this.props.searchProducts(text)}
                                    className="cas-search" limit={5} placeholder="Search" label="CAS Search"
                                    getObject={(product) => this.props.onSelect(product)} displayAttr="chemicalName"/>

                    <RemoteComboBox items={this.props.mappedProducts} api={(text) => this.props.mapProducts(text)}
                                    className="map-search" limit={5} placeholder="Search" label="Mapped Products Search"
                                    getObject={(productTemplate) => this.props.onSelectProductMapping(productTemplate)}
                                    displayAttr="productName"/>

            </div>
        );
    }
}


export default SearchProducts;