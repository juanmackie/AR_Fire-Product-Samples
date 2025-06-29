import * as THREE from 'three'
import ArMarkerControls from '../threex/arjs-markercontrols'
import MarkersAreaControls from './arjs-markersareacontrols'

var MarkersAreaUtils = {}

/**
 * Create a ARjs.Anchor from a arjs-anchor-parameters
 *
 * @param {Object} parameters - parameters for this anchor
 * @return {ARjs.Anchor} - the created anchor
 */
MarkersAreaUtils.createControls = function(arToolkitContext, object3d, parameters){
	var type = parameters.type

	if( type === 'pattern' ){
		var markerControls = new ArMarkerControls(arToolkitContext, object3d, parameters)
	}else if( type === 'barcode' ){
		var markerControls = new ArMarkerControls(arToolkitContext, object3d, parameters)
	}else if( type === 'area' ){
		var markerControls = new MarkersAreaControls(object3d, parameters)
	}else console.assert(false, 'unknonwn parameters.type ' + type)

	return markerControls
}

MarkersAreaUtils.buildSubMarkerControls = function(arToolkitContext, subMarkerParametersArr, parent3D){
	parent3D = parent3D || new THREE.Group
	parent3D.name = 'subMarkersControlsGroup'
	// create each sub-controls
	var subMarkersControls = []
	subMarkerParametersArr.forEach(function(subMarkerParameters){
		// create a markerRoot
		var markerRoot = new THREE.Group
		markerRoot.name = subMarkerParameters.name || ''
		parent3D.add(markerRoot)
		// create markerControls for our object3d
		var subMarkerControls = MarkersAreaUtils.createControls(arToolkitContext, markerRoot, subMarkerParameters)
		// store it
		subMarkersControls.push(subMarkerControls)
	})
	return subMarkersControls
}

MarkersAreaUtils.init = function(arToolkitContext, subMarkerParametersArr, subMarkerPosesMatrix4, smoothedControlsParameters){
	// handle parameters optional values
	smoothedControlsParameters = smoothedControlsParameters || {}

	// build the subMarkersControls
	var subMarkersControls = this.buildSubMarkerControls(arToolkitContext, subMarkerParametersArr)

	// build a markerRoot
	var markerRoot = new THREE.Group()
	markerRoot.name = 'markerRoot'
	arToolkitContext.scene.add(markerRoot)

	// build a markerControls
	var markersAreaControls = new MarkersAreaControls(markerRoot, smoothedControlsParameters)
	// store it
	subMarkersControls.forEach(function(subMarkerControls, index){
		markersAreaControls.addMarker(subMarkerControls, subMarkerPosesMatrix4[index])
	})

	return markersAreaControls
}

export default MarkersAreaUtils
