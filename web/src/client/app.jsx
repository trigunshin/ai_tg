import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import {green, orange, weapon_orange, purple} from 'item_bonuses.js';
import _ from 'lodash';


const initialState = {
  'base_health': 900000,
  'base_mana': 360000,
  'mana_boost': 0,
  'fighter_career': 116
};

function reducer(state=initialState, action) {
  const reducers = {
    'UPDATE_MANA': (state, action) => {
      return Object.assign({}, state, {'base_mana': action.value});
    },
    'UPDATE_MANA_BOOST': (state, action) => {
      return Object.assign({}, state, {'mana_boost': action.value});
    },
    'UPDATE_HEALTH': (state, action) => {
      return Object.assign({}, state, {'base_health': action.value});
    },
    'UPDATE_FIGHTER_CAREER': (state, action) => {
      return Object.assign({}, state, {'fighter_career': action.value});
    }
  };
  if (reducers[action.type] === void 0) return state;
  return reducers[action.type](state, action);
}
let store = createStore(reducer);

function select(state) {
  return state;
}



const TextInput = React.createClass({
  onChange() {
    console.info('changing', this.props.action_type);
    const action = {
      'type': this.props.action_type,
      'value': this.getData()
    };
    store.dispatch(action);
  },
  getData() {
      // only handle single file case for now
      return ReactDOM.findDOMNode(this.refs.localValue).value;
  },
  render() {
    return (
      <div>
        <label className='col-sm-2' htmlFor={this.props.id}>{this.props.displayName}</label>
        <div className="col-sm-2">
          <input type="text" className="form-control" id={this.props.id} defaultValue={this.props.defaultValue} ref='localValue' onChange={this.onChange}/>
        </div>
      </div>
    );
  }
});

const EquipmentLine = React.createClass({
  propTypes: {
    slot: React.PropTypes.string.isRequired
  },
  getData() {
    return {
      'slot': this.props.slot,
      'tier': ReactDOM.findDOMNode(this.refs.tier).value,
  },
  onChange() {
    /*console.info('changing', this.props.action_type);
    const action = {
      'type': this.props.action_type,
      'value': 
    };
    store.dispatch(action);
    */
  },
  render() {
    return (
      <div className="row form-inline">
        <div className="col-sm-1">{this.props.slot}</div>
        <div className='col-sm-2'>
          <input ref='tier' className='input-sm form-control' type="text" id='hat_tier_input' defaultValue='57' onChange={this.onChange}/>
        </div>
        <div className='col-sm-2'>
          <SelectInput ref='green' selectOptions={_.keys(green)} inputId={this.props.slot+'_green_select'} />
        </div>
        <div className='col-sm-2'>
          <SelectInput ref='orange' selectOptions={_.keys(orange)} inputId={this.props.slot+'_orange_select'} />
        </div>
        <div className='col-sm-2'>
          <SelectInput ref='purple' selectOptions={_.keys(purple)} inputId={this.props.slot+'_purple_select'} />
        </div>
      </div>
    );
  }
});

const SelectInput = React.createClass({
  getData() {
    return ReactDOM.findDOMNode(this.refs.localValue).value;
  },
  render() {
    return (
      <div className='col-sm-2'>
        <select id={this.props.inputId} className='form-control input-sm' ref='localValue'>
          {
            this.props.selectOptions.map((option) => <option key={option} value={option}>{option}</option>)
          }
        </select>
      </div>
    );
  }
});

const Item = React.createClass({
  render() {
    return (
      <div>
        <TextInput />
      </div>
    );
  }
});

const Character = connect(select)(React.createClass({
    getDefaultProps() {
        return {
            inputs: {
              'health': {
                'id': 'health_input',
                'displayName': 'Health',
                'action_type': 'UPDATE_HEALTH'
              },
              'mana': {
                'id': 'mana_input',
                'displayName': 'Mana',
                'action_type': 'UPDATE_MANA'
              },
              'mana_boost': {
                'id': 'mana_boost_input',
                'displayName': 'ManaBoost',
                'action_type': 'UPDATE_MANA_BOOST'
              },
              'fighter_career_input': {
                'id': 'fighter_career_input',
                'displayName': 'Fighter Career',
                'action_type': 'UPDATE_FIGHTER_CAREER'
              }
            }
        }
    },
    calculateMana() {
      const base = parseFloat(this.props.base_mana);
      let base_mult = 1;
      base_mult = base_mult + this.props.fighter_career * .001;
      base_mult = base_mult + this.props.mana_boost * .05;
      return base * base_mult;
    },
    render() {
      return (
        // slot, select/input, grn,oj,pur
        <div>
          <form className='form-horizontal'>
            <div className="form-group form-group-sm">
              <TextInput {...this.props.inputs.health} defaultValue={store.getState().base_health} />
              <TextInput {...this.props.inputs.mana} defaultValue={store.getState().base_mana} />
            </div>
            <div className="form-group form-group-sm">
              <TextInput {...this.props.inputs.fighter_career_input} defaultValue={store.getState().fighter_career} />
              <TextInput {...this.props.inputs.mana_boost} defaultValue={store.getState().mana_boost} />
            </div>

            <div className="row">
              <div className="col-sm-1"><b>Slot</b></div>
              <div className='col-sm-2'><b>Item Tier</b></div>
              <div className='col-sm-2'><b>Green</b></div>
              <div className='col-sm-2'><b>Orange</b></div>
              <div className='col-sm-2'><b>Purple</b></div>
            </div>
            <EquipmentLine slot='Hat'/>
          </form>
          <Statistic displayName='Mana' value={this.calculateMana()} />
        </div>
      );
    }
}));

const Statistic = React.createClass({
    render() {
        return (
            <div className='row'>
                <span className='col-sm-1'>{this.props.displayName}</span>
                <span className='col-sm-1'>{this.props.value}</span>
            </div>
        );
    }
});

const Layout = React.createClass({
    render() {
        return (
            <div className='container'>
                <Character />
            </div>
        );
    }
});

ReactDOM.render((
    <Provider store={store}>
      <Layout />
    </Provider>),
    document.getElementById('app'));

