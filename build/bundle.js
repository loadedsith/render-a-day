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
/******/ 	__webpack_require__.p = "/assets/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	import 'pixi.js';
	import 'redux';

	// PIXIJS

	var renderer = PIXI.autoDetectRenderer(window.innerWidth,
	    window.innerHeight);
	document.body.appendChild(renderer.view);

	// create the root of the scene graph
	var stage = new PIXI.Container();

	var texture = PIXI.Texture.fromImage('https://fiddle.jshell.net/img/logo@2x.png');

	var logo = new PIXI.Sprite(texture);
	logo.anchor.x = 0.5;
	logo.anchor.y = 0.5;
	logo.position.x = 100;
	logo.position.y = 100;
	stage.addChild(logo);

	function render() {
	    let state = store.getState();
	    if (logo.rotation != state.rotation) {
	      logo.rotation = state.rotation;
	    }

	     logo.position = state.position;

	    if (state.renderer.height != renderer.view.style.height ||
	        state.renderer.width != renderer.view.style.width
	        ) {
	      renderer.view.style.width = state.renderer.width;
	      renderer.view.style.height = state.renderer.height;
	      renderer.resize(state.renderer.width, state.renderer.height);
	    }

	    // render the container
	    renderer.render(stage);
	}

	// Redux

	function counter (state, action) {
	  if (typeof state == 'undefined') {
	    state = {
	      renderer: {
	        width: window.innerWidth + "px",
	        height: window.innerHeight + "px"
	      },
	      sprites: [],
	    }
	    ;
	  }

	  switch (action.type) {
	    case 'ADD':
	      state.push({
	        rotation: 0,
	        position: {
	          x: 100,
	          y: 100
	        }
	      });
	      break;
	    case 'RESIZE':
	      Object.assign(state.renderer.height, {
	        width: window.innerWidth + "px",
	        height: window.innerHeight + "px"
	      });
	      break;
	    case 'POINT_AT':
	      state.forEach((logo, index) => {
	        if (action[index]) {
	          logo.rotation = action.value || 0;
	        }
	      })
	      break;
	    case 'ROTATE':
	      state.rotation = (state.rotation + .1);
	      break;
	    case 'MOVE':
	      state.position.x = action.event.x;
	      state.position.y = action.event.y;
	      break;
	  }
	  return state;
	}

	var store = Redux.createStore(counter);
	store.subscribe(render);
	render();

	function animation(){
	  requestAnimationFrame(animation);
	}

	animation();

	window.addEventListener('resize', store.dispatch.bind(
	    null, 'RESIZE'));
	store.dispatch.bind(null, 'RESIZE')

	document.addEventListener('mousemove', function(event) {
	  let old_position = store.getState().position;

	  var angle = Math.atan2(event.clientY - old_position.y,
	      event.clientX - old_position.x);

	  while (angle < 0) {
	    angle += 2 * Math.PI;
	  }

	  store.dispatch({
	    type: 'MOVE',
	    event: {
	      x: event.clientX,
	      y: event.clientY
	    }
	  });

	  store.dispatch({
	    type: 'POINT_AT',
	    value: angle
	  });

	});


/***/ }
/******/ ]);