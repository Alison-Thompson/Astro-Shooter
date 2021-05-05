// Game global variables.
var playerName;
var gun;
var bulletList = [];
var enemyList = [];

var canvas;
var screenWidth;
var screenHeight;
var fps;
var currentTick;
var lastTick;
var paused;
var isGameOver;
var playAgain;

var initPlayerHealth;
var score;
var wave;
var waveIncremented;

var mousePos = [];

var ctx;

// Game functions.
function initGame() {};
function gameOver() {};
function tick() {};
function getInput() {};
function mousemove() {};
function keyup() {};
function draw() {};
function update() {};
function waveHandler() {};
function saveGame() {};
function bulletListToObjectList() {};
function enemyListToObjectList() {};

// Game helper functions.
function randRange() {};

// Game classes.
function Gun() {};
Gun.prototype.draw = function() {};
Gun.prototype.trackMouse = function() {};
Gun.prototype.changeAngle = function() {};
Gun.prototype.shoot = function() {};
Gun.prototype.drawHealthBar = function() {};
Gun.prototype.getHealth = function() {};
Gun.prototype.setHealth = function() {};

function Bullet() {};
Bullet.prototype.getShouldSpawn = function() {};
Bullet.prototype.getPos = function() {};
Bullet.prototype.getVelocity = function () {};
Bullet.prototype.setShouldSpawn = function() {};
Bullet.prototype.update = function() {};
Bullet.prototype.draw = function() {};

function Enemy() {};
Enemy.prototype.generatePos = function() {};
Enemy.prototype.getShouldSpawn = function() {};
Enemy.prototype.setShouldSpawn = function() {};
Enemy.prototype.setPos = function() {};
Enemy.prototype.setVelocity = function() {};

function BasicEnemy() {};
BasicEnemy.prototype.draw = function() {};
BasicEnemy.prototype.update = function() {};
BasicEnemy.prototype.hitHandler = function() {};
BasicEnemy.prototype.getPos = function() {};
BasicEnemy.prototype.getHealth = function() {};
BasicEnemy.prototype.getFirst = function() {};
BasicEnemy.prototype.getFlag = function() {};

// Handles all server operations.
var server;

function Server() {};
Server.prototype.get = function() {};
Server.prototype.post = function() {};
Server.prototype.put = function() {};
Server.prototype.delete = function() {};

// Start up page functions.
function startup() {};
function createNewPlayerGame() {};
function deletePlayerGame() {};
function loadGameOption() {};
function resetPlayerData() {};
function print() {};
function printHelper() {};
function retrieveDataAndStartGame() {};
function initHelper() {};

// Highscore page functions.
function shakerSort() {};
function loadHighscores() {};
function displayHighscores() {};
function displayHighscoresHelper() {};
function createFooter() {};
function clearPage() {};
function playAgainFunction() {};
function logout() {};

// Login page functions.
function displayLoginPage() {};
function attemptLogin() {};

// Sign up page functions.
function displaySignUpPage() {};
function attemptSignUp() {};