import * as THREE from 'three'
import ArBaseControls from '../threex/threex-arbasecontrols'
import ArMarkerControls from '../threex/arjs-markercontrols'
import ArSmoothedControls from '../threex/threex-arsmoothedcontrols'


var MarkersAreaControls = function(object3d, parameters){
	var _this = this

	ArBaseControls.call(this, object3d)

	this.context = parameters.context
	this.parameters = {
		// list of controls for each sub-marker
		subMarkersControls: [],
		// list of pose for each sub-marker relative to the group
		subMarkerPoses: [],
		// list of pose for each sub-marker relative to the group
		subMarkersEnabled: [],
	}


	// create ArSmoothedControls
	var smoothedControls = new ArSmoothedControls(object3d)
	this._smoothedControls = smoothedControls
	object3d.visible = false


	// honor parameters.debug
	if( parameters.debug === true ){
		this._debugGroup = new THREE.Group()
		this.context.scene.add(this._debugGroup)
		this._debugGroup.add(new THREE.AxisHelper())
	}
}

MarkersAreaControls.prototype = Object.create( ArBaseControls.prototype );
MarkersAreaControls.prototype.constructor = MarkersAreaControls;

//////////////////////////////////////////////////////////////////////////////
//		update method
//////////////////////////////////////////////////////////////////////////////

MarkersAreaControls.prototype.update = function(object3d){
	var _this = this
	var object3d = object3d || this.object3d
	var foundVisible = false
	var debugGroup = this._debugGroup

	// update smoothedControls parameters depending on how many markers are visible
	var nVisible = 0
	this.parameters.subMarkersControls.forEach(function(markerControls, markerIndex){
		if( _this.parameters.subMarkersEnabled[markerIndex] === false )	return
		if( markerControls.object3d.visible === false )	return
		nVisible++
	})
	if( nVisible >= 2 ){
		this._smoothedControls.parameters.lerpPosition = 0.8
		this._smoothedControls.parameters.lerpQuaternion = 0.8
		this._smoothedControls.parameters.lerpScale = 0.8
		this._smoothedControls.parameters.minVisibleDelay = 0
	}else{
		this._smoothedControls.parameters.lerpPosition = 0.4
		this._smoothedControls.parameters.lerpQuaternion = 0.4
		this._smoothedControls.parameters.lerpScale = 0.4
		this._smoothedControls.parameters.minVisibleDelay = 0.2
	}


	// define the current pose of the group based on the visible markers
	this.parameters.subMarkersControls.forEach(function(markerControls, markerIndex){
		// if this marker is not enabled, ignore it
		if( _this.parameters.subMarkersEnabled[markerIndex] === false )	return
		// if this marker is not visible, ignore it
		if( markerControls.object3d.visible === false )	return

		// we got one visible marker!!
		foundVisible = true

		// marker pose in world space
		var markerPose = new THREE.Matrix4().copy(markerControls.object3d.matrix)

		// set the debugGroup to the marker Pose - for debug
		if( debugGroup !== undefined ){
			debugGroup.position.copy(markerControls.object3D.position)
			debugGroup.quaternion.copy(markerControls.object3D.quaternion)
			debugGroup.scale.copy(markerControls.object3D.scale)
		}

		// compute the delta between the marker and the group center
		var markerObject3D = markerControls.object3d
		var subMarkerPose = _this.parameters.subMarkerPoses[markerIndex]

		// compute the matrix of the group center in world space
		var groupMatrix = new THREE.Matrix4()
		groupMatrix.getInverse(subMarkerPose)
		groupMatrix.multiply(markerPose)

		// set the initial position of the group - if not done yet
		if( _this._smoothedControls.isReady === false ){
			_this._smoothedControls.reset()
			_this._smoothedControls.update(groupMatrix)
		}
		// update the group position
		_this._smoothedControls.update(groupMatrix)
	})

	// if no marker is visible, do a reset to avoid stale an old position
	if( foundVisible === false && _this._smoothedControls.isReady === true ){
		_this._smoothedControls.reset()
	}

	// update the object3d visibility
	object3d.visible = this._smoothedControls.object3d.visible
	// update the object3d matrix
	object3d.matrix.copy( this._smoothedControls.object3d.matrix );
	// decompose the matrix into .position, .quaternion, .scale
	object3d.matrix.decompose( object3d.position, object3d.quaternion, object3d.scale );
}

//////////////////////////////////////////////////////////////////////////////
//		utility functions
//////////////////////////////////////////////////////////////////////////////

/**
 * to add a sub marker to the group
 *
 * @param {ARToolkit.Controls} markerControls the controls for this sub-marker
 * @param {THREE.Matrix4} objectMatrix the matrix of this marker from the group center
 */
MarkersAreaControls.prototype.addMarker = function(markerControls, objectMatrix){
	// handle default value for objectMatrix
	objectMatrix = objectMatrix || new THREE.Matrix4()
	// add it to the parameters
	this.parameters.subMarkersControls.push(markerControls)
	this.parameters.subMarkerPoses.push(objectMatrix)
	this.parameters.subMarkersEnabled.push(true)
}

MarkersAreaControls.prototype.removeMarker = function(markerControls){
	var markerIndex = this.parameters.subMarkersControls.indexOf(markerControls)
	if( markerIndex === -1 )	return false

	this.parameters.subMarkersControls.splice(markerIndex,1)
	this.parameters.subMarkerPoses.splice(markerIndex,1)
	this.parameters.subMarkersEnabled.splice(markerIndex,1)

	return true
}


MarkersAreaControls.prototype.enableMarker = function(markerControls){
	var markerIndex = this.parameters.subMarkersControls.indexOf(markerControls)
	if( markerIndex === -1 )	return false
	this.parameters.subMarkersEnabled[markerIndex] = true
	return true
}

MarkersAreaControls.prototype.disableMarker = function(markerControls){
	var markerIndex = this.parameters.subMarkersControls.indexOf(markerControls)
	if( markerIndex === -1 )	return false
	this.parameters.subMarkersEnabled[markerIndex] = false
	return true
}

MarkersAreaControls.prototype.name = function(){
	var context = this.context
	var profile = context.parameters.profile
	var patterns = []
	this.parameters.subMarkersControls.forEach(function(markerControls){
		if( markerControls.parameters.type === 'pattern' ){
			patterns.push( markerControls.parameters.patternUrl )
		}else if( markerControls.parameters.type === 'barcode' ){
			patterns.push( markerControls.parameters.barcodeValue )
		}else console.assert(false)
	})
	return 'area-' + patterns.join('-')
}

export default MarkersAreaControls
