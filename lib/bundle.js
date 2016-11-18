(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"), require("ajv"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable", "ajv"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("immutable"), require("ajv")) : factory(root["immutable"], root["ajv"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Transcript = __webpack_require__(1);

	var _Transcript2 = _interopRequireDefault(_Transcript);

	var _UntimedSegment = __webpack_require__(4);

	var _UntimedSegment2 = _interopRequireDefault(_UntimedSegment);

	var _Word = __webpack_require__(5);

	var _Word2 = _interopRequireDefault(_Word);

	var _Speaker = __webpack_require__(6);

	var _Speaker2 = _interopRequireDefault(_Speaker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  Transcript: _Transcript2.default,
	  UntimedSegment: _UntimedSegment2.default,
	  Word: _Word2.default,
	  Speaker: _Speaker2.default
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _ajv = __webpack_require__(3);

	var _ajv2 = _interopRequireDefault(_ajv);

	var _UntimedSegment = __webpack_require__(4);

	var _UntimedSegment2 = _interopRequireDefault(_UntimedSegment);

	var _Word = __webpack_require__(5);

	var _Word2 = _interopRequireDefault(_Word);

	var _Speaker = __webpack_require__(6);

	var _Speaker2 = _interopRequireDefault(_Speaker);

	var _schema = __webpack_require__(7);

	var _schema2 = _interopRequireDefault(_schema);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TranscriptRecord = new _immutable2.default.Record({
	  speakers: new _immutable2.default.List(),
	  segments: new _immutable2.default.List()
	});

	var Transcript = function (_TranscriptRecord) {
	  _inherits(Transcript, _TranscriptRecord);

	  function Transcript() {
	    _classCallCheck(this, Transcript);

	    return _possibleConstructorReturn(this, (Transcript.__proto__ || Object.getPrototypeOf(Transcript)).apply(this, arguments));
	  }

	  _createClass(Transcript, null, [{
	    key: 'fromJSON',
	    value: function fromJSON(json) {
	      this.validateJSON(json);

	      var speakers = new _immutable2.default.List(json.speakers.map(function (speaker) {
	        return new _Speaker2.default(speaker);
	      }));

	      var segments = new _immutable2.default.List(json.segments.map(function (_ref) {
	        var speaker = _ref.speaker,
	            words = _ref.words;
	        return new _UntimedSegment2.default({
	          speaker: speaker,
	          words: new _immutable2.default.List(words.map(function (_ref2) {
	            var text = _ref2.text;
	            return new _Word2.default({
	              text: text
	            });
	          }))
	        });
	      }));

	      return new Transcript({
	        speakers: speakers,
	        segments: segments
	      });
	    }
	  }, {
	    key: 'validateJSON',
	    value: function validateJSON(json) {
	      var ajv = new _ajv2.default();
	      var valid = ajv.validate(_schema2.default, json);
	      if (!valid) {
	        throw new Error('invalid transcript JSON:\n' + JSON.stringify(ajv.errors, null, 2));
	      }
	      return true;
	    }
	  }]);

	  return Transcript;
	}(TranscriptRecord);

	exports.default = Transcript;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UntimedSegmentRecord = new _immutable2.default.Record({
	  speaker: null,
	  words: new _immutable2.default.List()
	});

	var UntimedSegment = function (_UntimedSegmentRecord) {
	  _inherits(UntimedSegment, _UntimedSegmentRecord);

	  function UntimedSegment() {
	    _classCallCheck(this, UntimedSegment);

	    return _possibleConstructorReturn(this, (UntimedSegment.__proto__ || Object.getPrototypeOf(UntimedSegment)).apply(this, arguments));
	  }

	  _createClass(UntimedSegment, [{
	    key: 'getText',
	    value: function getText() {
	      return this.words.map(function (w) {
	        return w.get('text');
	      }).join(' ');
	    }
	  }]);

	  return UntimedSegment;
	}(UntimedSegmentRecord);

	exports.default = UntimedSegment;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Word = new _immutable2.default.Record({
	  text: ''
	});

	exports.default = Word;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SpeakerRecord = new _immutable2.default.Record({
	  name: null
	});

	var Speaker = function (_SpeakerRecord) {
	  _inherits(Speaker, _SpeakerRecord);

	  function Speaker() {
	    _classCallCheck(this, Speaker);

	    return _possibleConstructorReturn(this, (Speaker.__proto__ || Object.getPrototypeOf(Speaker)).apply(this, arguments));
	  }

	  return Speaker;
	}(SpeakerRecord);

	exports.default = Speaker;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		"type": "object",
		"definitions": {
			"word": {
				"id": "#word",
				"type": "object",
				"properties": {
					"text": {
						"type": "string"
					}
				},
				"required": [
					"text"
				],
				"additionalProperties": false
			},
			"interval": {
				"id": "#interval",
				"type": "object",
				"properties": {
					"start": {
						"type": "number"
					},
					"end": {
						"type": "number"
					},
					"words": {
						"type": "array",
						"items": {
							"$ref": "#word"
						},
						"minItems": 1
					}
				},
				"required": [
					"start",
					"end",
					"words"
				]
			}
		},
		"properties": {
			"speakers": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"name": {
							"type": [
								"string",
								"null"
							]
						}
					},
					"required": [
						"name"
					]
				}
			},
			"segments": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"speaker": {
							"type": "integer"
						},
						"words": {
							"type": "array",
							"items": {
								"$ref": "#word"
							},
							"minItems": 1
						},
						"intervals": {
							"type": "array",
							"items": {
								"$ref": "#interval"
							}
						}
					},
					"required": [
						"speaker"
					],
					"additionalProperties": false
				}
			}
		},
		"additionalProperties": false,
		"required": [
			"speakers",
			"segments"
		]
	};

/***/ }
/******/ ])
});
;