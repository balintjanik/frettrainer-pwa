/*
The MIT License (MIT)
Copyright (c) 2014 Chris Wilson
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Note: autoCorrelate comes from https://github.com/cwilso/PitchDetect/pull/23
with the above license.

*/
import { checkNote, initModel} from "./gamehandler.js";
var audioContext;
var currentNote;
var currentNoteOctave;

function init() {
    var source;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    analyser.minDecibels = -100;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      // No audio allowed
      alert('Sorry, getUserMedia is required for the app.')
      return;
    } else {
      var constraints = {audio: true};
      navigator.mediaDevices.getUserMedia(constraints)
        .then(
          function(stream) {
            // Initialize the SourceNode
            source = audioContext.createMediaStreamSource(stream);
            // Connect the source node to the analyzer
            source.connect(analyser);
            initModel();
            visualize();
          }
        )
        .catch(function(err) {
            alert(err);
          alert('Sorry, microphone permissions are required for the app.')
          window.location.href = ".";
        });
    }
  
    // Visualizing, copied from voice change o matic
    var canvas = document.querySelector('#visualizer');
    var canvasContext = canvas.getContext("2d");
    var WIDTH;
    var HEIGHT;
  
    function visualize() {
      WIDTH = canvas.width;
      HEIGHT = canvas.height;
  
      var drawVisual;
      var drawNoteVisual;
  
      var draw = function() {
        drawVisual = requestAnimationFrame(draw);
        analyser.fftSize = 2048;
        var bufferLength = analyser.fftSize;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
  
        canvasContext.fillStyle = 'rgb(28, 28, 28)';
        canvasContext.fillRect(0, 0, WIDTH, HEIGHT);
  
        canvasContext.lineWidth = 5;
        canvasContext.strokeStyle = 'rgb(52, 152, 219)';
  
        canvasContext.beginPath();
  
        var sliceWidth = WIDTH * 1 / 512;
        var x = 0;
  
        for(var i = 0; i < 512; i++) {
  
          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;
  
          if(i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }
  
          x += sliceWidth;
        }
  
        canvasContext.lineTo(canvas.width, canvas.height/2);
        canvasContext.stroke();
      }
  
      var previousValueToDisplay = 0;
      var smoothingCount = 0;
      var smoothingThreshold = 5;
      var smoothingCountThreshold = 5;
  
      // Thanks to PitchDetect: https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
      var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      function noteFromPitch( frequency ) {
        var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        var pitchClass = (Math.round(noteNum) + 69) % 12;
        var octave = Math.floor((Math.round(noteNum) + 69) / 12);
        return { pitchClass, octave }
      }
  
      var drawNote = function() {
        drawNoteVisual = requestAnimationFrame(drawNote);
        var bufferLength = analyser.fftSize;
        var buffer = new Float32Array(bufferLength);
        analyser.getFloatTimeDomainData(buffer);
        var autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate)
  
        // Handle rounding
        var result = noteFromPitch(autoCorrelateValue);
        currentNote = noteStrings[result.pitchClass];
        currentNoteOctave = result.octave - 1;
  
        if (autoCorrelateValue === -1) {
          // Input is too quiet
          return;
        }
        smoothingThreshold = 0;
        smoothingCountThreshold = 10;

        function noteIsSimilarEnough() {
          // Check threshold for number, or just difference for notes.
          if (typeof(currentNote) == 'number') {
            return Math.abs(currentNote - previousValueToDisplay) < smoothingThreshold;
          } else {
            return currentNote === previousValueToDisplay;
          }
        }
        // Check if this value has been within the given range for n iterations
        if (noteIsSimilarEnough()) {
          if (smoothingCount < smoothingCountThreshold) {
            smoothingCount++;
            return;
          } else {
            previousValueToDisplay = currentNote;
            smoothingCount = 0;
          }
        } else {
          previousValueToDisplay = currentNote;
          smoothingCount = 0;
          return;
        }
        checkNote(currentNote, currentNoteOctave);
        console.log(currentNote + currentNoteOctave)
      }
  
      draw();
      drawNote();
    }
  }
  
  
  // Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
  // From https://github.com/cwilso/PitchDetect/pull/23
  function autoCorrelate(buffer, sampleRate) {
    // Perform a quick root-mean-square to see if we have enough signal
    var SIZE = buffer.length;
    var sumOfSquares = 0;
    for (var i = 0; i < SIZE; i++) {
      var val = buffer[i];
      sumOfSquares += val * val;
    }
    var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
    if (rootMeanSquare < 0.01) {
      return -1;
    }
  
    // Find a range in the buffer where the values are below a given threshold.
    var r1 = 0;
    var r2 = SIZE - 1;
    var threshold = 0.2;
  
    // Walk up for r1
    for (var i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }
  
    // Walk down for r2
    for (var i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) {
        r2 = SIZE - i;
        break;
      }
    }
  
    // Trim the buffer to these ranges and update SIZE.
    buffer = buffer.slice(r1, r2);
    SIZE = buffer.length
  
    // Create a new array of the sums of offsets to do the autocorrelation
    var c = new Array(SIZE).fill(0);
    // For each potential offset, calculate the sum of each buffer value times its offset value
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j+i]
      }
    }
  
    // Find the last index where that value is greater than the next one (the dip)
    var d = 0;
    while (c[d] > c[d+1]) {
      d++;
    }
  
    // Iterate from that index through the end and find the maximum sum
    var maxValue = -1;
    var maxIndex = -1;
    for (var i = d; i < SIZE; i++) {
      if (c[i] > maxValue) {
        maxValue = c[i];
        maxIndex = i;
      }
    }
  
    var T0 = maxIndex;
  
    // Not as sure about this part, don't @ me
    // From the original author:
    // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
    // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
    // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
    var x1 = c[T0 - 1];
    var x2 = c[T0];
    var x3 = c[T0 + 1]
  
    var a = (x1 + x3 - 2 * x2) / 2;
    var b = (x3 - x1) / 2
    if (a) {
      T0 = T0 - b / (2 * a);
    }
  
    return sampleRate/T0;
  }


  const startBtn = document.getElementById('start');
  startBtn.addEventListener("click", function(){
    init();
    startBtn.style.display = 'none';
    
  });