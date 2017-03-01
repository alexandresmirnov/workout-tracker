/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var FriendsContainer = React.createClass({
  displayName: 'FriendsContainer',

  getInitialState: function () {
    return {
      name: 'Tyler McGinnis',
      friends: ['Jake Lingwall', 'Murphy Randall', 'Merrick Christensen']
    };
  },
  addFriend: function (friend) {
    this.state.friends.push(friend);
    this.setState({
      friends: this.state.friends
    });
  },
  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        ' Name: ',
        this.state.name,
        ' '
      ),
      React.createElement(AddFriend, { addNew: this.addFriend }),
      React.createElement(ShowList, { names: this.state.friends })
    );
  }
});

var AddFriend = React.createClass({
  displayName: 'AddFriend',

  getInitialState: function () {
    return {
      newFriend: ''
    };
  },
  propTypes: {
    addNew: React.PropTypes.func.isRequired
  },
  updateNewFriend: function (e) {
    this.setState({
      newFriend: e.target.value
    });
  },
  handleAddNew: function () {
    this.props.addNew(this.state.newFriend);
    this.setState({
      newFriend: ''
    });
  },
  render: function () {
    return React.createElement(
      'div',
      null,
      React.createElement('input', { type: 'text', value: this.state.newFriend, onChange: this.updateNewFriend }),
      React.createElement(
        'button',
        { onClick: this.handleAddNew },
        ' Add Friend '
      )
    );
  }
});

var ShowList = React.createClass({
  displayName: 'ShowList',

  getDefaultProps: function () {
    return {
      names: []
    };
  },
  render: function () {
    var listItems = this.props.names.map(function (friend) {
      return React.createElement(
        'li',
        null,
        ' ',
        friend,
        ' '
      );
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'h3',
        null,
        ' Friends '
      ),
      React.createElement(
        'ul',
        null,
        listItems
      )
    );
  }
});

ReactDOM.render(React.createElement(FriendsContainer, null), document.getElementById('app'));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);