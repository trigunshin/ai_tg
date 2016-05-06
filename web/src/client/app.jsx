import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import {green, orange, weapon_orange, purple} from 'item_bonuses.js';
import _ from 'lodash';
import $ from 'jquery';


const initialState = {
  'save_file_data': 'paste contents here',
  'save_json_data': {},
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
    'UPDATE_SAVE_FILE': (state, action) => {
      return Object.assign({}, state, {'save_file_data': action.value});
    },
    'UPDATE_SAVE_DATA': (state, action) => {
      return Object.assign({}, state, {'save_json_data': action.value});
    },
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

const FileInput = React.createClass({
    propTypes: {
        labelText: React.PropTypes.string.isRequired,
        errorText: React.PropTypes.string.isRequired,
        inputId: React.PropTypes.string.isRequired,
        inputText: React.PropTypes.string.isRequired,
        helpText: React.PropTypes.string.isRequired,
        name: React.PropTypes.string
    },
    // http://codepen.io/scobban/pen/XmxmwE
    getInitialState() {
        return {
            fileText: this.props.initialFileText
        };
    },
    getDefaultProps() {
        return {
            initialFileText: 'No file chosen'
        };
    },
    getData() {
        // only handle single file case for now
        const file_data = ReactDOM.findDOMNode(this.refs.localValue).files[0];
        console.info(file_data);
        const ret = new FormData();
        ret.append('file', file_data);

        $.ajax({
            url: 'https://decode-sol.herokuapp.com/decode',
            data: ret,
            method: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            success: (data) => {
              const action = {
                'type': 'UPDATE_SAVE_DATA',
                'value': data.data
              };
              store.dispatch(action);
            },
            error: (xhr, text_status, error) => {console.info(text_status, error);},
        });

        return ReactDOM.findDOMNode(this.refs.localValue).files[0];
    },
    handleInputChange() {
        //don't run in case of IE8/9
        if (!$('html').hasClass('lte-ie9')) {
            this.setState({fileText: this.getData().name});
        }
    },
    handleButtonClick(e) {
        e.preventDefault();
        ReactDOM.findDOMNode(this.refs.localValue).click();
    },
    render() {
        return (
            <div className={this.props.errorText && this.props.errorText.length ? 'form-group has-error has-feedback' : 'form-group'}>
                <label className='control-label' htmlFor={this.props.inputId}>{this.props.labelText}</label>
                <p className='small m-b-xs'>{this.props.helpText}</p>
                <span className='validation-icon-right'>
                    <input id={this.props.inputId} name={this.props.name} className='hidden upload-input visible-lte-ie9-inline' type='file' ref='localValue' onChange={this.handleInputChange}></input>
                    <button id='resumeFileButton' className='btn btn-primary btn-sm hidden-lte-ie9' onClick={this.handleButtonClick}>Choose file</button>
                    {this.props.errorText &&
                        <Glyphicon name='exclamation-sign' extraClassName='form-control-feedback'/>
                    }
                </span>
                <span className='uploaded-file-name hidden-lte-ie9' id='swapText'>{this.state.fileText}</span>
                {this.props.errorText &&
                    <span className='sr-only'>(warning)</span>
                }
                {this.props.errorText &&
                    <span className='help-block'>{this.props.errorText}</span>
                }
            </div>
        );
    }
});

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
              'save': {
                'inputId': 'save_input',
                'labelText': 'Save file (.sol)',
                'action_type': 'UPDATE_SAVE'
              },
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
    getFighterCareer() {
      if (store.getState().save_json_data.careerLevel) {
        console.info(store.getState().save_json_data.careerLevel);
        return store.getState().save_json_data.careerLevel[3];
      } else return 0;
    },
    render() {
      return (
        // slot, select/input, grn,oj,pur
        <div>
          <form className='form-horizontal' encType='multipart/form-data'>
            <div className="form-group form-group-sm">
              <FileInput {...this.props.inputs.save} defaultValue={store.getState().save_file_data} />
            </div>
            <div className="form-group form-group-sm">
              <LabelTextInput {...this.props.inputs.health} defaultValue={store.getState().base_health} />
              <LabelTextInput {...this.props.inputs.mana} defaultValue={store.getState().base_mana} />
            </div>
            <div className="form-group form-group-sm">
              <LabelTextInput {...this.props.inputs.fighter_career_input} defaultValue={this.getFighterCareer()} />
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
          <Statistic displayName='Fighter Career' value={this.getFighterCareer()} />
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

