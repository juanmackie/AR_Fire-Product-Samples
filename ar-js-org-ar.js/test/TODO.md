## Ideas for tests
- make a test for profile
  - make sure it default to good profile based on the device it is running on
  - e.g. if it is a phone, then it default to ```medium``` profile
- make a test for marker generator
  - take a .png as an input
  - take the actual result from the generator
  - compare it to a known good result for this image
- make a test for video source
  - simple check that it is playing
- make a test for image source
  - check that the image is properly loaded
- make a test for webcam source
  - check that it is running
  - take a snapshot of the video
  - compare it to a known good image
    - problem with the light variation from one run to another...
    - maybe do it on a known AR scene with a fixed camera position
- make a test for device orientation camera controls
  - check that it is running
- make a test for orbit camera controls
  - check that it is running
- make a test for AR-Code generator
  - it is a webpage, so it should be tested like any other webpage
  - make it generate a AR-Code for a known value
  - take a snapshot of the generated AR-Code
  - compare it to a known good image for this AR-Code
- make a test for AR-Code decoder
  - it is a webpage, so it should be tested like any other webpage
  - feed it with a known AR-Code image
  - check that it decodes the proper value
- make a test for AR-Code scanner
  - it is a webpage, so it should be tested like any other webpage
  - feed it with a known AR-Code video
  - check that it decodes the proper value
- make a test for markerless
  - it is a webpage, so it should be tested like any other webpage
  - feed it with a known video
  - check that the object is properly positioned
- make a test for marker based
  - it is a webpage, so it should be tested like any other webpage
  - feed it with a known video
  - check that the object is properly positioned

## Test Suites
- test for artoolkit
  - hiro marker
  - kanji marker
  - custom marker
- test for aruco
  - specific marker
- test for hit-testing
  - in artoolkit
  - in aruco
- test for markers-area
  - learning page
  - usage page

## Performance tests
- measure the fps for various devices
  - iphone5
  - android nexus
  - desktop
- measure the time to detect a marker for various devices
- measure the time to learn a marker for various devices

## Test Server
- make the test server serve the proper mime type for .patt files
  - currently it serves ```text/plain```
  - it should serve ```application/octet-stream```
- make the test server serve the proper mime type for .dat files
  - currently it serves ```text/plain```
  - it should serve ```application/octet-stream```
- make the test server serve the proper mime type for .wasm files
  - currently it serves ```text/plain```
  - it should serve ```application/wasm```

## test for webvr-polyfill
- make sure it is loaded
- make sure it is running
- make sure it is not crashing

## test for babylon.js
- make sure it is loaded
- make sure it is running
- make sure it is not crashing
- make sure it is tracking the marker
- make sure it is displaying the object
- make sure it is positioning the object correctly

## test for aframe
- make sure it is loaded
- make sure it is running
- make sure it is not crashing
- make sure it is tracking the marker
- make sure it is displaying the object
- make sure it is positioning the object correctly

## test for three.js
- make sure it is loaded
- make sure it is running
- make sure it is not crashing
- make sure it is tracking the marker
- make sure it is displaying the object
- make sure it is positioning the object correctly

## test for AR.js site
- make sure the site is up
- make sure the site is not crashing
- make sure the site is displaying the proper content
- make sure the site is linking to the proper pages
- make sure the site is linking to the proper external pages

## test for AR.js documentation
- make sure the documentation is up
- make sure the documentation is not crashing
- make sure the documentation is displaying the proper content
- make sure the documentation is linking to the proper pages
- make sure the documentation is linking to the proper external pages

## test for AR.js examples
- make sure the examples are up
- make sure the examples are not crashing
- make sure the examples are displaying the proper content
- make sure the examples are linking to the proper pages
- make sure the examples are linking to the proper external pages
- make sure the examples are working as expected

## test for AR.js blog
- make sure the blog is up
- make sure the blog is not crashing
- make sure the blog is displaying the proper content
- make sure the blog is linking to the proper pages
- make sure the blog is linking to the proper external pages
- make sure the blog is working as expected

## test for AR.js forum
- make sure the forum is up
- make sure the forum is not crashing
- make sure the forum is displaying the proper content
- make sure the forum is linking to the proper pages
- make sure the forum is linking to the proper external pages
- make sure the forum is working as expected

## test for AR.js chat
- make sure the chat is up
- make sure the chat is not crashing
- make sure the chat is displaying the proper content
- make sure the chat is linking to the proper pages
- make sure the chat is linking to the proper external pages
- make sure the chat is working as expected
