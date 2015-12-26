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

const item_slots = ['Hat', 'Pants', 'Shoes', 'Gloves', 'Skin', 'Necklace', 'Earrings', 'Trinket', 'Medal'];

function get_reducer_labels(slot_name) {
  return [
    slot_name+'_tier_input',
    slot_name+'_green_input',
    slot_name+'_orange_input',
    slot_name+'_purple_input'
  ];
}

function reducer(state=initialState, action) {
  let reducers = {
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
  // item slots & input labels
  _.each(item_slots, (slot) => {
    _.each(get_reducer_labels(slot), (label) => {
      reducers[label] = (state, action) => {
        const ret = {};
        ret[action.type] = action.value;
        return Object.assign({}, state, ret);
      };
    });
  });

  if (reducers[action.type] === void 0) return state;
  return reducers[action.type](state, action);
}
let store = createStore(reducer);
function state_filter(state) {
  return state;
}


const TextInput = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    default_value: React.PropTypes.string.isRequired
  },
  onChange() {
    const action = {
      'type': this.props.id,
      'value': this.getData()
    };
    store.dispatch(action);
  },
  getData() {
      return ReactDOM.findDOMNode(this.refs.localValue).value;
  },
  render() {
    return (
      <div>
        <div className="col-sm-2">
          <input type="text" className="form-control" id={this.props.id} defaultValue={this.props.default_value} ref='localValue' onChange={this.onChange}/>
        </div>
      </div>
    );
  }
});

const SelectInput = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    selectOptions: React.PropTypes.array.isRequired
  },
  onChange() {
    const action = {
      'type': this.props.id,
      'value': this.getData()
    };
    store.dispatch(action);
  },
  getData() {
    return ReactDOM.findDOMNode(this.refs.localValue).value;
  },
  render() {
    return (
      <div className='col-sm-2'>
        <select id={this.props.inputId} className='form-control input-sm' ref='localValue' onChange={this.onChange}>
          {
            this.props.selectOptions.map((option) => <option key={option} value={option}>{option}</option>)
          }
        </select>
      </div>
    );
  }
});

const LabelTextInput = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    displayName: React.PropTypes.string.isRequired,
    action_type: React.PropTypes.string.isRequired
  },
  onChange() {
    const action = {
      'type': this.props.action_type,
      'value': this.getData()
    };
    store.dispatch(action);
  },
  getData() {
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
  render() {
    const slot = this.props.slot;
    // slot+... is tightly tied to get_reducer_labels
    return (
      <div className="row form-inline">
        <div className="col-sm-1">{slot}</div>

        <TextInput id={slot+'_tier_input'} default_value='57' />
        <SelectInput id={slot+'_green_input'} selectOptions={_.keys(green)} />
        <SelectInput id={slot+'_orange_input'} selectOptions={_.keys(orange)} />
        <SelectInput id={slot+'_purple_input'} selectOptions={_.keys(purple)}  />
      </div>
    );
  }
});

const Character = connect(state_filter)(React.createClass({
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
      let local_state = store.getState();
      let base_mana = parseFloat(this.props.base_mana);
      let base_mult = 1;
      base_mult = base_mult + this.props.fighter_career * .001;
      base_mult = base_mult + this.props.mana_boost * .05;


      _.each(item_slots, (slot) => {
        const tier = parseInt(local_state[slot+'_tier_input']);
        if(local_state[slot+'_orange_input'] === 'MP') {
          base_mult = base_mult + tier * orange['MP'];
        }
        if(local_state[slot+'_purple_input'] === 'MaxMP') {
          base_mana = base_mana + tier * purple['MaxMP'];
        }
      });

      return base_mana * base_mult;
    },
    render() {
      return (
        // slot, select/input, grn,oj,pur
        <div>
          <form className='form-horizontal'>
            <div className="form-group form-group-sm">
              <LabelTextInput {...this.props.inputs.health} defaultValue={store.getState().base_health} />
              <LabelTextInput {...this.props.inputs.mana} defaultValue={store.getState().base_mana} />
            </div>
            <div className="form-group form-group-sm">
              <LabelTextInput {...this.props.inputs.fighter_career_input} defaultValue={store.getState().fighter_career} />
              <LabelTextInput {...this.props.inputs.mana_boost} defaultValue={store.getState().mana_boost} />
            </div>

            <div className="row">
              <div className="col-sm-1"><b>Slot</b></div>
              <div className='col-sm-2'><b>Item Tier</b></div>
              <div className='col-sm-2'><b>Green</b></div>
              <div className='col-sm-2'><b>Orange</b></div>
              <div className='col-sm-2'><b>Purple</b></div>
            </div>
            {
              _.map(item_slots, (slot) => {
                return <EquipmentLine slot={slot} key={slot} />
              })
            }
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

