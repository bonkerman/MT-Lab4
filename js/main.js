/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const snapshotButton = document.querySelector('button#snapshot');
const filterSelect = document.querySelector('select#filter');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
let vc = null;
let src = null;

snapshotButton.onclick = function() {
	if(filterSelect.value!="canny"){
		canvas.className = filterSelect.value;
  		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	} else {
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		let src = cv.imread('canvas');
		let dst = new cv.Mat();
		cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
		//cv.Canny(image, edges, threshold1, threshold2, apertureSize = 3, L2gradient = false)
		cv.Canny(src, dst, 50, 60, 3, false);
		cv.imshow('canvas', dst);
		src.delete(); dst.delete();
	}
  
};

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
		cv.imshow('canvas', src);
		requestAnimationFrame(processVideo);
};

filterSelect.onchange = function() {
  video.className = filterSelect.value != "canny" ? filterSelect.value : "";

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