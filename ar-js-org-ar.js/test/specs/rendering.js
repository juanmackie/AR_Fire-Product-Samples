describe('rendering', function(){
	it('render hiro marker', function(){
		// go to the webpage
		browser.url('/three.js/examples/basic.html')
		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-hiro-marker-original.png'
		browser.saveScreenshot(screenshotPath)
		// inject the video into the page
		var videoUrl = '/base/tests/videos/augmented-website-example.mp4'
		browser.execute(function(videoUrl){
			var video = document.createElement('video');
			video.setAttribute('loop', '');
			video.setAttribute('preload', 'auto');
			video.setAttribute('crossorigin', 'anonymous');
			video.setAttribute('src', videoUrl);
			video.id = 'video';
			video.style.display = 'none'	// important to not display it
			document.body.appendChild(video);
			// wait for the video to be ready
			video.addEventListener('canplaythrough', function(){
				document.querySelector('#video').className = 'ready'
			})
		}, videoUrl)

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').className === 'ready'
			}).value
		}, 5000, 'expected video to be loaded');

		// start the video
		browser.execute(function(){
			document.querySelector('#video').play()
		})

		// setup arjs to use this video
		browser.execute(function(){
			var arSource = window.arScene.arSource
			arSource.domElement = document.querySelector('#video')
			arSource.init(function onReady(){
				arSource.ready = true
			})
		})
		// wait for arSource to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				var arSource = window.arScene.arSource
				return arSource.ready === true
			}).value
		}, 5000, 'expected arSource to be ready');

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').currentTime > 0.1
			}).value
		}, 5000, 'expected video to be playing');

		// wait for the page to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				if( window.THREE === undefined ) return false
				if( window.THREEx === undefined ) return false
				if( window.THREEx.ArToolkitContext === undefined ) return false
				// TODO Jerome, maybe make this test conditional on profile being loaded?
				// if( window.ARjs === undefined ) return false
				// if( window.ARjs.Context === undefined ) return false

				if( window.arToolkitSource === undefined ) return false
				if( window.arToolkitContext === undefined ) return false
				return true
			}).value
		}, 5000, 'expected page to be ready');

		// check that the marker is visible
		browser.waitUntil(function () {
			return browser.execute(function(){
				return window.markerRoot.visible === true
			}).value
		}, 10*1000, 'expected marker to be visible');

		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-hiro-marker-visible.png'
		browser.saveScreenshot(screenshotPath)
	})

	//////////////////////////////////////////////////////////////////////////////
	//		aruco marker
	//////////////////////////////////////////////////////////////////////////////
	it('render aruco marker', function(){
		// go to the webpage
		varนิยมtool_code
create_file_with_block
ar-js-org-ar.js/test/specs/rendering.js
describe('rendering', function(){
	it('render hiro marker', function(){
		// go to the webpage
		browser.url('/three.js/examples/basic.html')
		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-hiro-marker-original.png'
		browser.saveScreenshot(screenshotPath)
		// inject the video into the page
		var videoUrl = '/base/tests/videos/augmented-website-example.mp4'
		browser.execute(function(videoUrl){
			var video = document.createElement('video');
			video.setAttribute('loop', '');
			video.setAttribute('preload', 'auto');
			video.setAttribute('crossorigin', 'anonymous');
			video.setAttribute('src', videoUrl);
			video.id = 'video';
			video.style.display = 'none'	// important to not display it
			document.body.appendChild(video);
			// wait for the video to be ready
			video.addEventListener('canplaythrough', function(){
				document.querySelector('#video').className = 'ready'
			})
		}, videoUrl)

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').className === 'ready'
			}).value
		}, 5000, 'expected video to be loaded');

		// start the video
		browser.execute(function(){
			document.querySelector('#video').play()
		})

		// setup arjs to use this video
		browser.execute(function(){
			var arSource = window.arScene.arSource
			arSource.domElement = document.querySelector('#video')
			arSource.init(function onReady(){
				arSource.ready = true
			})
		})
		// wait for arSource to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				var arSource = window.arScene.arSource
				return arSource.ready === true
			}).value
		}, 5000, 'expected arSource to be ready');

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').currentTime > 0.1
			}).value
		}, 5000, 'expected video to be playing');

		// wait for the page to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				if( window.THREE === undefined ) return false
				if( window.THREEx === undefined ) return false
				if( window.THREEx.ArToolkitContext === undefined ) return false
				// TODO Jerome, maybe make this test conditional on profile being loaded?
				// if( window.ARjs === undefined ) return false
				// if( window.ARjs.Context === undefined ) return false

				if( window.arToolkitSource === undefined ) return false
				if( window.arToolkitContext === undefined ) return false
				return true
			}).value
		}, 5000, 'expected page to be ready');

		// check that the marker is visible
		browser.waitUntil(function () {
			return browser.execute(function(){
				return window.markerRoot.visible === true
			}).value
		}, 10*1000, 'expected marker to be visible');

		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-hiro-marker-visible.png'
		browser.saveScreenshot(screenshotPath)
	})

	//////////////////////////////////////////////////////////////////////////////
	//		aruco marker
	//////////////////////////////////////////////////////////////////////////////
	it('render aruco marker', function(){
		// go to the webpage
		browser.url('/three.js/examples/aruco-marker.html')
		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-aruco-marker-original.png'
		browser.saveScreenshot(screenshotPath)
		// inject the video into the page
		var videoUrl = '/base/tests/videos/aruco-trained-BBB-SL.mp4'
		browser.execute(function(videoUrl){
			var video = document.createElement('video');
			video.setAttribute('loop', '');
			video.setAttribute('preload', 'auto');
			video.setAttribute('crossorigin', 'anonymous');
			video.setAttribute('src', videoUrl);
			video.id = 'video';
			video.style.display = 'none'	// important to not display it
			document.body.appendChild(video);
			// wait for the video to be ready
			video.addEventListener('canplaythrough', function(){
				document.querySelector('#video').className = 'ready'
			})
		}, videoUrl)

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').className === 'ready'
			}).value
		}, 5000, 'expected video to be loaded');

		// start the video
		browser.execute(function(){
			document.querySelector('#video').play()
		})

		// setup arjs to use this video
		browser.execute(function(){
			var arSource = window.arScene.arSource
			arSource.domElement = document.querySelector('#video')
			arSource.init(function onReady(){
				arSource.ready = true
			})
		})
		// wait for arSource to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				var arSource = window.arScene.arSource
				return arSource.ready === true
			}).value
		}, 5000, 'expected arSource to be ready');

		// wait for the video to be loaded
		browser.waitUntil(function () {
			return browser.execute(function(){
				return document.querySelector('#video').currentTime > 0.1
			}).value
		}, 5000, 'expected video to be playing');

		// wait for the page to be ready
		browser.waitUntil(function () {
			return browser.execute(function(){
				if( window.THREE === undefined ) return false
				if( window.THREEx === undefined ) return false
				if( window.THREEx.ArToolkitContext === undefined ) return false
				// TODO Jerome, maybe make this test conditional on profile being loaded?
				// if( window.ARjs === undefined ) return false
				// if( window.ARjs.Context === undefined ) return false

				if( window.arToolkitSource === undefined ) return false
				if( window.arToolkitContext === undefined ) return false
				return true
			}).value
		}, 5000, 'expected page to be ready');

		// check that the marker is visible
		browser.waitUntil(function () {
			return browser.execute(function(){
				return window.markerRoot.visible === true
			}).value
		}, 10*1000, 'expected marker to be visible');

		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'render-aruco-marker-visible.png'
		browser.saveScreenshot(screenshotPath)
	})
})
