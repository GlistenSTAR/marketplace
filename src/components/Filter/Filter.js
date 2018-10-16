import {Form} from 'react-redux-form';
// import {Translate} from 'react-localize-redux';
import './filter.css';
import FilterGroup from './components/FilterGroup';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {filterNonEmptyAttributes} from "../../utils/functions";

class Filter extends Component {

    constructor(props){
        super(props);
        this.state = {
            isOpen: false
        }
    }

    handleSubmit(inputs){
        let filter = Object.assign({}, inputs,
            {pckgs: Object.entries(inputs.pckgs || {}).filter(([key, value]) => value).map(([key]) => key).join(',')},
            {condition: Object.entries(inputs.condition || {}).filter(([key, value]) => value).map(([key]) => key).join(',')},
            {form: Object.entries(inputs.form || {}).filter(([key, value]) => value).map(([key]) => key).join(',')}
            );
        console.log(filter);
        let params = filterNonEmptyAttributes(filter);
        this.props.filterFunc(params);
        let filterTags = [];
        for(let tag in params){
            filterTags.push({name: tag, value: params[tag]})
        }
        this.props.addFilterTag(filterTags);
        this.props.toggleFilter();
    }

    handleReset(e){
        e.preventDefault();
        this.props.resetForm('forms.filter');
        this.props.filterFunc({});
        this.props.addFilterTag([]);
    }

    componentDidMount() {
    this.props.fetchProductConditions();
    this.props.fetchProductForms();
    this.props.fetchPackagingTypes();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            isOpen: nextProps.isOpen
        })
    }

    render(){
        console.log(this.props);
        return this.state.isOpen ?
            <div className="filter">
                <Form model="forms.filter" onSubmit={(val) => this.handleSubmit(val)}>
                    <FilterGroup className="filterGroup"
                                 header='Chemical Type'
                                 isVisible={!!this.props.chemicalName}
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.chemName}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('chemName', value)}}
                                 inputs={[
                                     {
                                         label: 'Chemical name / CAS #',
                                         model: '.search',
                                         type: 'text',
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 isVisible={!!this.props.quantity}
                                 isOpen={this.props.filterGroupStatus.quantity}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('quantity', value)}}
                                 header='Quantity'
                                 data={this.props.filterData}
                                 split
                                 inputs={[
                                     {
                                         label: 'From Quantity',
                                         model: '.qntylb',
                                         type: 'number',
                                         placeholder: '0'
                                     },
                                     {
                                         label: 'To Quantity',
                                         model: '.qntyub',
                                         type: 'number',
                                         placeholder: '0'
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 header='Price'
                                 split
                                 isVisible={!!this.props.price}
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.price}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('price', value)}}
                                 inputs={[
                                     {
                                         label: 'From Price',
                                         model: '.prclb',
                                         type: 'number',
                                         placeholder: '0'
                                     },
                                     {
                                         label: 'To Price',
                                         model: '.prcub',
                                         type: 'number',
                                         placeholder: '0'
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 header='Packaging'
                                 isVisible={!!this.props.package}
                                 split
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.packaging}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('packaging', value)}}
                                 checkboxModel='pckgs'
                                 inputs={this.props.packagingTypes.map(packagingType => ({
                                        label: packagingType.name,
                                        type: 'checkbox',
                                        id: packagingType.id,
                                        model: `.pckgs[${packagingType.id}]`
                                 }))}/>
                    <FilterGroup className="filterGroup"
                                 header='Condition'
                                 isVisible={!!this.props.condition}
                                 split
                                 data={this.props.productConditions}
                                 isOpen={this.props.filterGroupStatus.condition}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('condition', value)}}
                                 checkboxModel='condition'
                                 inputs={this.props.productConditions.map(condition => ({
                                     label: condition.name,
                                     type: 'checkbox',
                                     id: condition.id,
                                     model: `.condition[${condition.id}]`
                                 }))}/>
                    <FilterGroup className="filterGroup"
                                 header='Form'
                                 isVisible={!!this.props.form}
                                 split
                                 data={this.props.productForms}
                                 isOpen={this.props.filterGroupStatus.form}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('form', value)}}
                                 checkboxModel='form'
                                 inputs={this.props.productForms.map(form => ({
                                     label: form.name,
                                     type: 'checkbox',
                                     id: form.id,
                                     model: `.form[${form.id}]`
                                 }))}/>

                    <FilterGroup className="filterGroup"
                                 header='Chemical Search'
                                 isVisible={!!this.props.chemicalSearch}
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.chemSearch}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('chemSearch', value)}}
                                 inputs={[
                                     {
                                         label: 'Chemical search',
                                         model: '.chemSearch',
                                         type: 'text',
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 header='Product Age'
                                 isVisible={!!this.props.productsAge}
                                 split
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.productAge}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('productAge', value)}}
                                 dispatch={this.props.dispatch}
                                 inputs={[
                                     {
                                         model: 'forms.filter.data.productAge',
                                         type: 'radio',
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 header='Location'
                                 isVisible={!!this.props.loc}
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.loc}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('loc', value)}}
                                 dispatch={this.props.dispatch}
                                 inputs={[
                                     {
                                         label: 'Max. miles away',
                                         model: 'forms.filter.data.loc',
                                         type: 'dropdown',
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 header='Expiration'
                                 split
                                 isVisible={!!this.props.date}
                                 data={this.props.filterData}
                                 isOpen={this.props.filterGroupStatus.date}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('date', value)}}
                                 dispatch={this.props.dispatch}
                                 inputs={[
                                     {
                                         label: 'From',
                                         model: '.dtfr',
                                         type: 'date',
                                     },
                                     {
                                         label: 'To',
                                         model: '.dtto',
                                         type: 'date',
                                     }
                                 ]}/>
                    <FilterGroup className="filterGroup"
                                 isVisible={!!this.props.assay}
                                 isOpen={this.props.filterGroupStatus.assay}
                                 onOpen={(value)=>{this.props.toggleFilterGroup('assay', value)}}
                                 header='Assay'
                                 data={this.props.filterData}
                                 split
                                 inputs={[
                                     {
                                         label: 'Minimum (%)',
                                         model: '.assmin',
                                         type: 'assay',
                                         placeholder: '0'
                                     },
                                     {
                                         label: 'Maximum (%)',
                                         model: '.assmax',
                                         type: 'assay',
                                         placeholder: '0',
                                         bigger:true
                                     }
                                 ]}/>
                    <div className="filterBottom">

                        {/*<button className="filter-button">Apply</button>*/}
                        <button className='button filter-button'>Apply</button>
                        <button className='button disabled filter-button' onClick={(e)=>{this.handleReset(e)}}>Clear filter</button>
                    </div>
                </Form>
            </div> : null;

    }
}

Filter.propTypes = {
    filterFunc: PropTypes.func,
};


export default Filter;
