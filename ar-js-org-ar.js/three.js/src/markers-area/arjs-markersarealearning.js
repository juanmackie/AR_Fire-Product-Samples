import * as THREE from 'three'

var MarkersAreaLearning = function(arToolkitContext, subMarkersControls, subMarkerRoot){
	var _this = this
	this.arToolkitContext = arToolkitContext
	this.subMarkersControls = subMarkersControls
	this.subMarkerRoot = subMarkerRoot || new THREE.Group

	this._onMarkerFound = []
	this._onMarkerLost = []

	// listen to arToolkitContext event
	arToolkitContext.addEventListener('initialized', function(event){
		_this._onArToolkitContextInitialized()
	})
	arToolkitContext.addEventListener('arControllerInitialized', function(event){
		_this._onArToolkitControllerInitialized()
	})

	this._arMarkersAreaLearning = new THREEx.ArMarkersAreaLearning(arToolkitContext.arController)
	this._arMarkersAreaLearning.subMarkersControls = subMarkersControls
	this._arMarkersAreaLearning.subMarkerRoot = this.subMarkerRoot

	// store the parameters
	this.newMarkerRoot = new THREE.Group()
	this.newMarkerRoot.name = 'newMarkerRoot'
	this.subMarkerRoot.add(this.newMarkerRoot)

	// listen to visibility event of subMarkersControls
	subMarkersControls.forEach(function(markerControls, markerIndex){
		markerControls.addEventListener('markerFound', function(){
			_this._onMarkerFound[markerIndex] = true
		})
		markerControls.addEventListener('markerLost', function(){
			_this._onMarkerFound[markerIndex] = false
		})
	})
}

// export default MarkersAreaLearning

MarkersAreaLearning.prototype.dispose = function(){
	// TODO unlisten to arToolkitContext event
	// arToolkitContext.removeEventListener('initialized', function(event){
	// 	_this._onArToolkitContextInitialized()
	// })
	// arToolkitContext.removeEventListener('arControllerInitialized', function(event){
	// 	_this._onArToolkitControllerInitialized()
	// })
}

//////////////////////////////////////////////////////////////////////////////
//		Code Separator
//////////////////////////////////////////////////////////////////////////////

MarkersAreaLearning.prototype.update = function(){
	this._arMarkersAreaLearning.update()
}

MarkersAreaLearning.prototype.stats = function(){
	return this._arMarkersAreaLearning.stats()
}

//////////////////////////////////////////////////////////////////////////////
//		callback for arToolkitContext event
//////////////////////////////////////////////////////////////////////////////
MarkersAreaLearning.prototype._onArToolkitContextInitialized = function(){
	var _this = this
	var arController = this.arToolkitContext.arController

	// honor parameters.debugUIEnabled
	if( this.arToolkitContext.parameters.debugUIEnabled === false )	return

	var domElement = document.createElement('div')
	domElement.setAttribute('id', 'arjs-markersarealearning-container')
	domElement.style.position = 'fixed'
	domElement.style.bottom = '10px'
	domElement.style.left = '10px'
	domElement.style.zIndex = 20
	domElement.style.padding = '3px'
	domElement.style.background = 'rgba(127,127,127,0.5)'
	domElement.style.color = 'rgb(220,220,220)'
	domElement.style.fontSize = '12px'
	domElement.style.fontFamily = 'monospace'
	document.body.appendChild(domElement)

	//////////////////////////////////////////////////////////////////////////////
	//		current status
	//////////////////////////////////////////////////////////////////////////////
	var currentStatusElement = document.createElement('div')
	currentStatusElement.innerHTML = 'Current Status: <span class="status"></span>'
	domElement.appendChild(currentStatusElement)
	var statusElement = domElement.querySelector('.status')

	//////////////////////////////////////////////////////////////////////////////
	//		statistics
	//////////////////////////////////////////////////////////////////////////////
	var statisticsElement = document.createElement('div')
	statisticsElement.innerHTML = 'Learning Statistics: <span class="stats"></span>'
	domElement.appendChild(statisticsElement)
	var statsElement = domElement.querySelector('.stats')

	//////////////////////////////////////////////////////////////////////////////
	//		buttons
	//////////////////////////////////////////////////////////////////////////////
	var buttonReset = document.createElement('button')
	buttonReset.innerHTML = 'Reset marker group'
	domElement.appendChild(buttonReset)
	buttonReset.addEventListener('click', function(){
		_this._arMarkersAreaLearning.reset()
	})

	var buttonSave = document.createElement('button')
	buttonSave.innerHTML = 'Save marker group'
	domElement.appendChild(buttonSave)
	buttonSave.addEventListener('click', function(){
		var jsonString = _this._arMarkersAreaLearning.toJSON()
		localStorage.setItem('ARjsMultiMarkerFile', jsonString)
	})

	//////////////////////////////////////////////////////////////////////////////
	//		update loop
	//////////////////////////////////////////////////////////////////////////////
	this.arToolkitContext.addEventListener('sourceProcessed', function(){
		var stats = _this.stats()

		if( stats.learning === true ){
			statusElement.innerHTML = 'Learning...'
			buttonSave.style.display = 'none'
		}else if( stats.completed === true ){
			statusElement.innerHTML = 'Learned :)'
			buttonSave.style.display = 'inline-block'
		}else{
			statusElement.innerHTML = 'Waiting for submarkers...'
			buttonSave.style.display = 'none'
		}

		statsElement.innerHTML = JSON.stringify(stats)
	})
}

MarkersAreaLearning.prototype._onArToolkitControllerInitialized = function(){
	var _this = this
	var arController = this.arToolkitContext.arController
	// honor parameters.debugUIEnabled
	if( this.arToolkitContext.parameters.debugUIEnabled === false )	return

	var markerIndex = 0
	this._arMarkersAreaLearning.subMarkersControls.forEach(function(markerControls){
		// build a debugMesh for it
		var material = new THREE.MeshNormalMaterial({
			transparent : true,
			opacity: 0.5,
			side: THREE.DoubleSide
		});
		var geometry = new THREE.PlaneGeometry(1,1);
		var_debugMesh = new THREE.Mesh( geometry, material );
		_debugMesh.name = 'markerLearnerUIMesh-' + markerIndex++
		_debugMesh.matrixAutoUpdate = false;
		_this.subMarkerRoot.add( _debugMesh )

		// markerControls.addEventListener('markerFound', function(){
		// 	_debugMesh.visible = false
		// })
		// markerControls.addEventListener('markerLost', function(){
		// 	_debugMesh.visible = true
		// })
	})

	this.arToolkitContext.addEventListener('sourceProcessed', function(){
		_this._arMarkersAreaLearning.subMarkersControls.forEach(function(markerControls, markerIndex){
			var debugMesh = _this.subMarkerRoot.getObjectByName( 'markerLearnerUIMesh-' + markerIndex )
			if( markerControls.object3d.visible === true ){
				debugMesh.visible = false
			}else{
				debugMesh.visible = true
				var matrix = _this._arMarkersAreaLearning.markerMatrixFromLearned(markerIndex)
				debugMesh.matrix.copy(matrix)
			}
		})
	})
}

export default MarkersAreaLearning
