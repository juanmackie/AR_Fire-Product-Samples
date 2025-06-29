describe('markers-area', function(){
	it('learner page should be able to learn', function(){
		// go to the webpage
		browser.url('/three.js/examples/multi-markers/examples/learner.html')
		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'markers-area-learner-original.png'
		browser.saveScreenshot(screenshotPath)
		// inject the video into the page
		var videoUrl = '/base/tests/videos/multi-markers-area-trained-ABCDG.mp4'
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

		// wait for the markers to be learned
		browser.waitUntil(function () {
			return browser.execute(function(){
				return window.markersAreaLearner.stats().completed === true
			}).value
		}, 30*1000, 'expected markers to be learned');

		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'markers-area-learner-learned.png'
		browser.saveScreenshot(screenshotPath)
	})

	//////////////////////////////////////////////////////////////////////////////
	//		Code Separator
	//////////////////////////////////////////////////////////////////////////////

	it('player page should be able to play', function(){
		// go to the webpage
		browser.url('/three.js/examples/multi-markers/examples/player.html')
		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'markers-area-player-original.png'
		browser.saveScreenshot(screenshotPath)
		// inject the video into the page
		var videoUrl = '/base/tests/videos/multi-markers-area-trained-ABCDG.mp4'
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

		// wait for the markers-area to be detected
		browser.waitUntil(function () {
			return browser.execute(function(){
				return window.markerObject3D.visible === true
			}).value
		}, 10*1000, 'expected markers-area to be detected');

		// take a screenshot
		var screenshotPath = TEST_SCREENSHOTS_FOLDER + 'markers-area-player-detected.png'
		browser.saveScreenshot(screenshotPath)
	})
})
