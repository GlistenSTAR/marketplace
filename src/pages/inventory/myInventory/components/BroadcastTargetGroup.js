import React, {Component} from 'react';
import BroadcastConfig from './BroadcastConfig'

class BroadcastTargetGroup extends Component {

    constructor(props){
        super(props);
        this.brRef = React.createRef();
        this.state = {
            isOpen: false,
            target: [],
            groupSelected: 'include',
            groupChangeType: 'priceMultiplication',
            filter: this.props.filter,
            groupAmount: 0
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.filter !== this.state.filter){
            this.props.updateTargets(this.props.index, []);
            this.setState({filter: nextProps.filter, target: [], groupSelected: 'include', groupChangeType: 'priceMultiplication', isOpen: false,})
        }
    }

    handleChangeAmountGroup(id, value){
        let newTarget = [];
        for(let i = 0; i < this.props.items.length; i++){
            let itemValues = this.checkItemValue(this.props.items[i].company);
            newTarget.push({visibility: itemValues[0] === 'include', 'company': this.props.items[i].company, updateType: itemValues[1],  amount: value})
        }
        this.setState({
            groupAmount: value,
            target: newTarget
        }, ()=> this.props.updateTargets(this.props.index, this.state.target))
    }

    handleChangeUpdateTypeGroup(id, value){
        let newTarget = [];
        for(let i = 0; i < this.props.items.length; i++){
            let itemValues = this.checkItemValue(this.props.items[i].company);
            newTarget.push({visibility: itemValues[0] === 'include', 'company': this.props.items[i].company, updateType: value,  amount: itemValues[2]})
        }
        // if(this.props.type !== 'company') {
        //     this.props.updateTargets(this.props.index, [{[this.props.type]: this.props.id, updateType: value, amount: this.state.groupAmount, visibility: this.state.groupSelected}])
        // }else{
        //     this.props.updateTargets(this.props.index, newTarget)
        // }
        this.setState({
            groupChangeType: value,
            target: newTarget
        }, ()=> this.props.updateTargets(this.props.index, this.state.target))
    }

    handleChangeGroup(id, value){
        let newTarget = this.state.target.slice();
        if(value === 'include' || value === 'exclude'){
            newTarget = [];
            for(let i = 0; i < this.props.items.length; i++){
                let itemValues = this.checkItemValue(this.props.items[i].company);
                newTarget.push({visibility: value === 'include', 'company': this.props.items[i].company, amount: itemValues[2], updateType: itemValues[1]})
            }
            // if(this.props.type !== 'company') {
            //     this.props.updateTargets(this.props.index, [{[this.props.type]: this.props.id, visibility: value === 'include', updateType: this.state.groupChangeType, amount: this.state.groupAmount}])
            // }else{
            //     this.props.updateTargets(this.props.index, newTarget)
            // }
        }
        this.setState({
            groupSelected: value,
            target: newTarget
        }, ()=> this.props.updateTargets(this.props.index, this.state.target))
    }

    handleChangeAmountItem(id, value){
        for(let i = 0; i < this.state.target.length; i++){
            if(this.state.target[i].company === id){
                let newTarget = this.state.target.slice();
                newTarget[i].amount = value;
                this.setState({target: newTarget, groupAmount: ""},()=>{
                    this.props.updateTargets(this.props.index, this.state.target)
                });
                return;
            }
        }
        this.setState({target: [...this.state.target, {visibility: true, company: id, updateType: 'priceMultiplication', amount: value}], groupAmount: ""},()=>{
            this.props.updateTargets(this.props.index, this.state.target)
        })
    }


    handleChangeUpdateTypeItem(id, value){
        for(let i = 0; i < this.state.target.length; i++){
            if(this.state.target[i].company === id){
                let newTarget = this.state.target.slice();
                newTarget[i].updateType = value;
                newTarget[i].amount = newTarget[i].amount || 0;
                this.setState({target: newTarget, groupChangeType: null},()=>{
                    this.props.updateTargets(this.props.index, this.state.target)
                });
                return;
            }
        }
        this.setState({target: [...this.state.target, {visibility: true, company: id, updateType: value, amount: 0}], groupChangeType: null},()=>{
            this.props.updateTargets(this.props.index, this.state.target)
        })
    }

    handleChangeItem(id, value){
        let newGroupState = value === this.state.groupSelected ? value : 'custom';
        for(let i = 0; i < this.state.target.length; i++){
            if(this.state.target[i].company === id){
                let newTarget = this.state.target.slice();
                newTarget[i].visibility = value === 'include';
                this.setState({target: newTarget, groupSelected: newGroupState},()=>{
                    this.props.updateTargets(this.props.index, this.state.target)
                });
                return;
            }
        }
        this.setState({target: [...this.state.target, {visibility: value === 'include', company: id, updateType: 'priceMultiplication', amount: 0}], groupSelected: newGroupState},()=>{
            this.props.updateTargets(this.props.index, this.state.target)
        })
    }

    checkItemValue(id){
        for(let i = 0; i < this.state.target.length; i++){
            if(this.state.target[i].company === id){
                if(this.state.target[i].visibility){
                    return ['include', this.state.target[i].updateType, this.state.target[i].amount]
                }
                return ['exclude', this.state.target[i].updateType, this.state.target[i].amount]
            }
        }
        return ['include', 'priceMultiplication', 0]
    }

    renderItems(){
        return this.props.items.map((item, index) => {
            let itemValues = this.checkItemValue(item.company);
            return (<div key={index} className='br-item-header'>
                <div className='left-group'>
                    {item.name}
                </div>
                <BroadcastConfig item
                                 name={item.name + index}
                                 value={itemValues[0]}
                                 updateType={itemValues[1]}
                                 id={item.company}
                                 amount={itemValues[2]}
                                 changeUpdateType={(id, value)=>this.handleChangeUpdateTypeItem(id, value)}
                                 changeAmount={(id, value)=>this.handleChangeAmountItem(id, value)}
                                 changeBrConfig={(id, value)=>this.handleChangeItem(id, value)}/>
                <div className='clearfix' > </div>
            </div>)
        })
    }

    toggleGroup(e){
        if (this.brRef.current.contains(e.target)) return;
        this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        return (
            <div>
               <div className='br-group-header' onClick={(e)=>this.toggleGroup(e)}>
                   <div className='left-group'>
                       {this.state.isOpen ? <i className="icon fas fa-angle-up"/> : <i className="icon fas fa-angle-down"/>}
                       {this.props.name}
                       {!this.state.isOpen ? <span className='no-targets'>undefined / {this.props.items.length} Companies</span> : null}
                   </div>
                   <span ref={this.brRef}>
                       <BroadcastConfig
                           name={this.props.name}
                           id={this.props.id}
                           value={this.state.groupSelected}
                           updateType={this.state.groupChangeType}
                           amount={this.state.groupAmount}
                           changeUpdateType={(id, value)=>this.handleChangeUpdateTypeGroup(id, value)}
                           changeAmount={(id, value)=>this.handleChangeAmountGroup(id, value)}
                           changeBrConfig={(id, value)=>this.handleChangeGroup(id, value)}/>
                       <div className='clearfix' > </div>
                   </span>
               </div>
                {this.state.isOpen ? this.renderItems() : null}
            </div>
        );
    }
}
export default BroadcastTargetGroup;