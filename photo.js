(function () {
  "use strict";

  const form = document.getElementById('profile-form');
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('photoCanvas');
  const preview = document.getElementById('photoPreview');
  const startBtn = document.getElementById('startCameraBtn');
  const captureBtn = document.getElementById('captureBtn');
  const retakeBtn = document.getElementById('retakeBtn');
  const uploadInput = document.getElementById('photoUpload');
  const downloadBtn = document.getElementById('downloadPhotoBtn');
  const errorEl = document.getElementById('photoError');
  let stream = null;

  // profile-builder.js reads the photo from here
  window.profilePhoto = { dataUrl: '' };

  function notifyChange() {
    document.dispatchEvent(new CustomEvent('photochange'));
  }

  function stopCamera() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null;
    video.hidden = true;
    captureBtn.hidden = true;
  }

  function showPhoto(dataUrl) {
    window.profilePhoto.dataUrl = dataUrl;
    preview.src = dataUrl;
    preview.hidden = false;
    retakeBtn.hidden = false;
    downloadBtn.hidden = false;
    startBtn.hidden = true;
    errorEl.textContent = '';
    notifyChange();
  }

  async function startCamera() {
    errorEl.textContent = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      errorEl.textContent = 'Camera not supported here. Use "Upload instead".';
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      video.srcObject = stream;
      video.hidden = false;
      preview.hidden = true;
      startBtn.hidden = true;
      captureBtn.hidden = false;
    } catch (err) {
      errorEl.textContent = 'Could not access the camera. Allow permission or use "Upload instead".';
    }
  }

  // Centre-crop to a square and resize to 400x400
  function drawSquare(source, w, h) {
    const size = Math.min(w, h);
    canvas.width = 400;
    canvas.height = 400;
    canvas.getContext('2d').drawImage(source, (w - size) / 2, (h - size) / 2, size, size, 0, 0, 400, 400);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function capture() {
    showPhoto(drawSquare(video, video.videoWidth, video.videoHeight));
    stopCamera();
  }

  function retake() {
    window.profilePhoto.dataUrl = '';
    preview.hidden = true;
    retakeBtn.hidden = true;
    downloadBtn.hidden = true;
    notifyChange();
    startCamera();
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        stopCamera();
        showPhoto(drawSquare(img, img.width, img.height));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // Same file name the generated card uses (getPhotoPath lives in profile-builder.js)
  function downloadPhoto() {
    const nameInput = form.querySelector('[name="name"]');
    const fileName = window.getPhotoPath(nameInput.value).replace('images/', '');
    const a = document.createElement('a');
    a.href = window.profilePhoto.dataUrl;
    a.download = fileName;
    a.click();
  }

  // Require a photo before "Copy HTML".
  // This script loads before profile-builder.js, so this listener runs first.
  form.addEventListener('submit', function (e) {
    if (!window.profilePhoto.dataUrl) {
      e.preventDefault();
      e.stopImmediatePropagation();
      errorEl.textContent = 'Please take or upload a photo.';
      startBtn.focus();
    }
  });

  startBtn.addEventListener('click', startCamera);
  captureBtn.addEventListener('click', capture);
  retakeBtn.addEventListener('click', retake);
  uploadInput.addEventListener('change', handleUpload);
  downloadBtn.addEventListener('click', downloadPhoto);
  window.addEventListener('beforeunload', stopCamera);
})();