import 'pixi.js';
import * as Redux from 'redux';

// PIXIJS

const renderer = PIXI.autoDetectRenderer(window.innerWidth,
    window.innerHeight);
document.body.appendChild(renderer.view);

// create the root of the scene graph
const stage = new PIXI.Container();
const overlayStage = new PIXI.Container();
const spritesStage = new PIXI.Container();

const web = new PIXI.Graphics();
web.lineStyle(4, 0xffd900, 1);

overlayStage.addChild(web);
stage.addChild(overlayStage);
stage.addChild(spritesStage);

const createLogo = function() {
  const texture = PIXI.Texture.fromImage('img/logo@2x.png');
  const logo = new PIXI.Sprite(texture);
  logo.anchor.x = 0.5;
  logo.anchor.y = 0.5;
  logo.position.x = 100;
  logo.position.y = 100;
  return logo
}

function render() {
  const spritesStore = spriteStore.getState();

  while (spritesStage.children.length < spritesStore.length) {
    spritesStage.addChild(createLogo());
  }

  // if (spritesStore.length > 0) {
  //   web.moveTo(spritesStore[0].position.x, spritesStore[0].position.y);
  // }
  let points = [];

  if (spritesStore.length > 0) {
    points.push(spritesStore[0].position.x);
    points.push(spritesStore[0].position.y);
  }
  for (var i = spritesStore.length - 1; i >= 0; i--) {
    let sprite = spritesStore[i];
    points.push(sprite.position.x);
    points.push(sprite.position.y);
  }

  if (spritesStore.length > 0) {
    points.push(spritesStore[0].position.x);
    points.push(spritesStore[0].position.y);
  }

  // Close the loop.
  if (spritesStore.length > 0) {
    // points.push(spritesStore[spritesStore.length - 1].position.x);
    // points.push(spritesStore[spritesStore.length - 1].position.y);
  }

  // web.removeChildren();
  web.clear();
  web.lineStyle(4, 0xffd900, 1);
  web.drawPolygon(points);

  for (var j = 0; j < spritesStore.length; j++) {
    let sprite = spritesStore[j];
    let child = spritesStage.getChildAt(j);

    child.rotation = sprite.rotation;
    child.position.set(sprite.position.x, sprite.position.y);
  }

  // render the container
  renderer.render(stage);
}

// Redux
function updateStage() {
  const stageState = stageStore.getState();
  const h = stageState.height;
  const w = stageState.width;

  renderer.view.style.width = w + "px";
  renderer.view.style.height = h + "px";

  renderer.resize(w, h);
}

function stageActions (state, action) {
  if (typeof state == 'undefined') {
    state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  switch (action.type) {
    case 'RESIZE':
      Object.assign(state, {
        width: window.innerWidth,
        height: window.innerHeight
      });
      break;
  }

  return state;
}

function spriteActions (sprites, action) {
  if (typeof sprites == 'undefined') {
    sprites = [];
  }

  switch (action.type) {
    case 'ADD':
      sprites.unshift({
        rotation: 0,
        position: {
          x: action.event.x,
          y: action.event.y
        }
      });
      break;
    case 'POINT_AT':
      if (sprites[action.index]) {
        sprites[action.index].rotation = action.value || 0;
      }
      break;
    case 'ROTATE':
      if (sprites[action.index]) {
        sprites[action.index].rotation = (sprites[action.index].rotation + .1);
      }
      break;
    case 'MOVE':
      if (sprites[action.index]) {
        sprites[action.index].position.x = action.event.x;
        sprites[action.index].position.y = action.event.y;
      }
      break;
  }
  return sprites;
}

var stageStore = Redux.createStore(stageActions, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

stageStore.subscribe(updateStage);

var spriteStore = Redux.createStore(spriteActions, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

spriteStore.subscribe(render);

render();

function animation(){
  requestAnimationFrame(animation);
}

animation();

window.addEventListener('resize', stageStore.dispatch.bind(
    null, {type: 'RESIZE'}));

stageStore.dispatch({type: 'RESIZE'})

document.addEventListener('click', function(event) {
  spriteStore.dispatch({
      type: 'ADD',
      event: {
        x: event.clientX,
        y: event.clientY
      }
  });
});

spriteStore.dispatch({
    type: 'ADD',
    event: {
      x: 100,
      y: 100
    }
});

document.addEventListener('mousemove', function(event) {
  const sprites = spriteStore.getState();

  sprites.map((sprite, index) => {
    var angle = Math.atan2(event.clientY - sprite.position.y,
        event.clientX - sprite.position.x);

    while (angle < 0) {
      angle += 2 * Math.PI;
    }

    spriteStore.dispatch({
      type: 'POINT_AT',
      index: index,
      value: angle
    });
  });

  spriteStore.dispatch({
    type: 'MOVE',
    index: 0,
    event: {
      x: event.clientX,
      y: event.clientY
    }
  });
});
