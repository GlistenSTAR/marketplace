import React, {Component} from 'react';
import {Control, Errors} from 'react-redux-form';
import DropdownRedux from "../../../../../components/Dropdown/DropdownRedux";
// import Checkbox from "../../../../../components/Checkbox/Checkbox";
import IncrementalPricing from './IncrementalPricing';
import CheckboxRedux from "../../../../../components/Checkbox/CheckboxRedux";
import {required, isNumber, min, isCasNumber, messages} from "../../../../../utils/validation";

export default class Pricing extends Component {
    constructor(props){
        super(props);
        this.state = {
            incrementalPricing: false,
            margin:" ",
        }
    }

    componentWillReceiveProps(nextProps){

            if(typeof nextProps.form.addProductOffer.pricing === "undefined"){
                this.setState({margin:" "});
                return;
            }
            let total = ((parseInt(nextProps.form.addProductOffer.pricing.price,10)-parseInt(nextProps.form.addProductOffer.pricing.cost,10)) / parseInt(nextProps.form.addProductOffer.pricing.price,10)) * 100;

            if(isNaN(total) || total < 0){
                this.setState({margin:" "});
                return;
            }
            total = total.toFixed(2);
            this.setState({margin:String(total)});

    }



    render() {
        let incremental = this.state.incrementalPricing ?
            <div className='incremental-wr'>
                <h4>Tiered Pricing</h4>
                <IncrementalPricing splits={15} minimum={20} />
            </div>
            : null;
        return (
            <div>

                    <h6>SET PRICE & RULES</h6>
                <div>
                    <Errors
                        className="form-error"
                        model=".pricing.price"
                        show="touched"
                        messages={{
                            required: messages.required,
                            isNumber: messages.isNumber,
                            min: messages.min
                        }}
                    />
                    <div className='group-item-wr'>
                        <label htmlFor=".pricePr">Price pr (lb)</label>
                        <Control.text model=".pricing.price"
                                      id=".pricePr"
                                      validators={{
                                          min: (val) => min(val, 0),
                                          isNumber,
                                          required
                                      }}
                                      placeholder="$"
                                      defaultValue=""
                        />
                    </div>
                    <Errors
                        className="form-error"
                        model=".pricing.cost"
                        show="touched"
                        messages={{
                            required: messages.required,
                            isNumber: messages.isNumber,
                            min: messages.min
                        }}
                    />
                    <div className='group-item-wr'>
                        <label htmlFor=".costPr">Cost pr (lb)</label>
                        <Control.text model=".pricing.cost"
                                      id=".costPr"
                                      validators={{
                                          min: (val) => min(val, 0),
                                          isNumber,
                                          required
                                      }}
                                      defaultValue=""
                                      placeholder="$"/>
                    </div>


                    <div className='group-item-wr'>
                        <div className='gross-margin'>
                        <h6>Gross Margin</h6>
                        <div>{this.state.margin}%</div>
                        </div>
                    <div className='group-item-wr'>
                        <h6>Total Sales Price</h6>
                        <h6>$ UNDEFINED</h6>
                    </div>
                </div>
                {/*<div>*/}
                    {/*<div className='group-item-wr'>*/}
                        {/*<Checkbox name='incremental'*/}
                                  {/*label='Tiered Pricing'*/}
                                  {/*onChange={(value) => this.setState({incrementalPricing: value})} />*/}
                    {/*</div>*/}
                {/*</div>*/}
                <div>
                    <Errors
                        className="form-error"
                        model=".splits"
                        show="touched"
                        messages={{
                            required: messages.required,
                            isNumber: messages.isNumber
                        }}
                    />
                <div className='group-item-wr'>
                <label htmlFor=".splits">Splits</label>
                <Control.text model=".splits"
                              id=".splits"
                              validators={{
                                  isNumber,
                                  required,
                              }}
                              placeholder="Packages"/>
                </div>
                    <Errors
                        className="form-error"
                        model="forms.addProductOffer.addProductOffer.minimum"
                        show="touched"
                        messages={{
                            required: messages.required,
                        }}
                    />
                <div className='group-item-wr'>
                <label htmlFor=".minimum">Minimum</label>
                <DropdownRedux opns={[{id: 10, name: '10'}]}
                               placeholder='Packages'
                               model="forms.addProductOffer.addProductOffer.minimum"
                               validators={{required}}
                               dispatch={this.props.dispatch}/>
                </div>
                </div>
                <div className='group-item-wr'>
                        <CheckboxRedux model="forms.addProductOffer.addProductOffer.merchantVisibility"
                                       name="merchantVisibility"
                                       label="List Anonymously"
                                       dispatch={this.props.dispatch}/>
                </div>

                {incremental}
            </div>
            </div>
        );
    }
}
