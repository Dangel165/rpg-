//=============================================================================
// RPG Maker MV/MZ - CT_Bolt's Pictures Above Windows Plugin
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [RPG Maker MV/MZ] [Tier 1] [Version 1.12] [CT_Bolt - Pictures Above Windows]
 * @author CT_Bolt
 *
 * @param Pictures Above Windows
 * @text Pictures Above Windows
 * @desc Start with Pictures Above Windows?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @help
 * Place Pictures Above Windows
 * 
 * Script calls:
 *  placePicturesAbove()
 *  placePicturesBelow()
 *  setPicturePlacement(value) // Value is 0 (above) or 1 (below)
 *
 */
//=============================================================================
//=============================================================================
 
var CTB = CTB || {}; CTB.PicturesAboveWindows  = CTB.PicturesAboveWindows || {};
var Imported = Imported || {}; Imported["CTB_PicturesAboveWindows"] = 1.12;

"use strict";
(($_$) => {
    const NAMESPACE   = 'PicturesAboveWindows';
    const PLUGIN_NAME = 'CTB_' + NAMESPACE;

	function getPluginParameters() {var a = document.currentScript || (function() { var b = document.getElementsByTagName('script'); return b[b.length - 1]; })(); return PluginManager.parameters(a.src.substring((a.src.lastIndexOf('/') + 1), a.src.indexOf('.js')));} $_$.params = getPluginParameters();
	//function convertParameters (parameters) {function parseParameters (string) {try {return JSON.parse(string, (key, value) => {try {return parseParameters(value)} catch (e) {return value}})} catch (e) {return string}}; return parseParameters(JSON.stringify(parameters))};
	$_$.params['Pictures Above Windows'] = $_$.params['Pictures Above Windows'] || '';
	if ($_$.params['Pictures Above Windows'] === ''){$_$.params['Pictures Above Windows'] = true};

	// Alias`
	['Scene_Map', 'Scene_Battle'].forEach(v => {
		$_$[v+'.prototype.createAllWindows'] = window[v].prototype.createAllWindows;
		window[v].prototype.createAllWindows = function() {
			$_$[v+'.prototype.createAllWindows'].apply(this, arguments);
			if (eval($_$.params['Pictures Above Windows'])){
				this.placePictureContainer();	
			};			
		};
	}, this);
	
	// New
	Scene_Base.prototype.placePictureContainer = function(mode = 0){
		(mode === 0) ? this.placePicturesAbove() : this.placePicturesBelow();
	};
	
	// New	
	Scene_Base.prototype.placePicturesAbove = function(){
		this.addChild(this._spriteset._pictureContainer);
	};
	
	// New
	Scene_Base.prototype.placePicturesBelow = function(){
		this.removeChild(this._spriteset._pictureContainer)
		this._spriteset.addChild(this._spriteset._pictureContainer);
	};
	
})(CTB.PicturesAboveWindows, this);

// Easy to use Script Calls
function placePicturesAbove() {SceneManager._scene.placePicturesAbove();};
function placePicturesBelow() {SceneManager._scene.placePicturesBelow();};
function setPicturePlacement(value) {SceneManager._scene.placePictureContainer(value);};