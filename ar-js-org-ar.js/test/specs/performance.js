describe('performance', function(){
	it('measure average fps over 10 seconds', function(){
		// go to the webpage
		browser.url('/three.js/examples/dev.html')
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

		// collect the FPS for 10 seconds
		var measures = browser.execute(function(){
			var measures = []
			var startTime = performance.now()
			var lastTime = startTime
			requestAnimationFrame(function callback(){
				var now = performance.now()
				var delta = now - lastTime
				lastTime = now
				// ignore the first frame - too noisy
				if( measures.length > 0 ){
					measures.push(1000/delta)
				}
				// stop collecting after 10 seconds
				if( now - startTime < 10 * 1000 ){
					requestAnimationFrame(callback)
				}
			})
			return measures
		})

		// wait until measures are completed
		browser.waitUntil(function () {
			return browser.execute(function(){
				return measures.length > 0 && measures[measures.length-1] !== undefined
			}).value
		}, 10*1000 + 2*1000, 'expected measures to be completed');

		// reget measures from the browser
		measures = browser.execute(function(){
			return measures
		}).value

		// console.log('measures', measures)
		// compute the average
		var sum = measures.reduce(function(previous, current) {
			return current += previous;
		});
		var average = sum / measures.length;
		// log the average
		console.log('average fps', average)
	})
})
