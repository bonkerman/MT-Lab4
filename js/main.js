/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const filterSelect = document.querySelector('select#filter');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
let vc = null;
let src = null;


video.onloadeddata = () => {
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	video.height = video.videoHeight;
	video.width = video.videoWidth;
	vc = new cv.VideoCapture(video);
	src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
	processVideo();
};

function processVideo(){
		vc.read(src);
		let result;
		switch(filterSelect.value){
			case 'canny': result = canny(src); break;
			default: result = src; canvas.className = filterSelect.value;
		}
		cv.imshow('canvas', result);
		requestAnimationFrame(processVideo);
};

function canny(src) {
	let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.Canny(dst, dst, 218, 119,
             3, false);
    return dst;
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}



navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);