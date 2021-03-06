/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';
document.body.classList.add("loading");
const filterSelect = document.querySelector('select#filter');
filterSelect.addEventListener("change", setupSliders);
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
let vc = null;
let src = null;
let dst = null;

const sliders = {
	canny : [["lowThreshold", 0, 600, 300], ["highThreshold", 0, 600, 120]],
	gaussianBlur : [["kernel", 7, 99, 30]]
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
		let result;
		switch(filterSelect.value){
			case 'canny': result = canny(src); break;
			case 'equalizeHist': result = equalizeHist(src); break;
			default: result = src; canvas.className = filterSelect.value;
		}
		dst != null ? dst.delete : "";
		cv.imshow('canvas', result);
		requestAnimationFrame(processVideo);
};

function gaussianBlur(src) {
	canvas.className = "none";
	dst = new cv.Mat();
	cv.GaussianBlur(src, dst, {width: parseFloat($("#kernel").val()), height: parseFloat($("#kernel").val())}, 0, 0, cv.BORDER_DEFAULT);
	return dst;
}

function canny(src) {
	canvas.className = "none";
	dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    try{
    	cv.Canny(dst, dst, parseFloat($("#lowThreshold").val()), parseFloat($("#highThreshold").val()), 3, false);
    }
    catch{
    	dst = src;
    }
    
    return dst;
};

function equalizeHist(src) {
	canvas.className = "none";
	dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.equalizeHist(dst, dst);
    return dst;
};

function setupSliders(){
		$("#sliders").empty();
	if(sliders[filterSelect.value]){
		sliders[filterSelect.value].forEach((item)=>{
			$("#sliders").append("<p>"+item[0]+": <span>"+item[3]+"</span></p>").append($('<input>' ,{
				type: "range",
				id: item[0],
				min: item[1],
				max: item[2],
				value: item[3]
			})).on("change",(e)=>{
				$(e.target).prev().find("span").text(e.target.value);
			});
		});
	} else {
		$("#sliders").empty();
	}
	
};

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  document.body.classList.remove("loading");
};

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(handleSuccess).catch(handleError);
};

function stop() {
	if($("#stopButton").text()=="START"){
		navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
		$("#stopButton").text("STOP");
		src.delete();
	} else {
		window.stream.getTracks().forEach(function(track) {
  		track.stop();
		});
		$("#stopButton").text("START");
	}
};


navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);