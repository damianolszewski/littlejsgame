/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

'use strict';

let soundManager;


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // called once after the engine starts up
    // setup the game
    soundManager = new SoundManager();

    GameManager.getInstance();
    GUI.getInstance();

    // post processing
    setupPostProcess();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state

    if(GameManager.getInstance().isInitialized()) {
        GameManager.getInstance().update();
        GUI.getInstance().update();
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects

    drawRect(vec2(0, 0), mainCanvasSize, hsl(.1, .3, .7), 0, false);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // drawTextScreen('Hello World!', mainCanvasSize.scale(.5), 80);
    if(GameManager.getInstance().isInitialized()) {
        GUI.getInstance().render();
    }
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(
    gameInit,
    gameUpdate, 
    gameUpdatePost, 
    gameRender, 
    gameRenderPost, 
    [
        'sprites/animals.png', //0
        'sprites/base_pack.png', //1
        'sprites/new.png', //2
        'sprites/tear.png', //3
        'sprites/tiles.png', //4
        'sprites/rarityText/uncommon.png', //5
        'sprites/rarityText/rare.png', //6
        'sprites/rarityText/epic.png', //7
        'sprites/rarityText/legendary.png', //8
        'sprites/border.png', //9
        'sprites/coin.png', //10
        'sprites/buttons.png', //11
        'sprites/black_and_white.png', //12
        'sprites/3d.png', //13
        'sprites/neon.png' //14
    ]
);