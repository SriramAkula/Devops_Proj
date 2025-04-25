const upload = document.getElementById('upload');
const video = document.getElementById('videoPreview');
const output = document.getElementById('output');

upload.addEventListener('change', function () {
  const file = upload.files[0];
  const url = URL.createObjectURL(file);
  video.src = url;
});

function analyze() {
  // Simulated result for now
  const activities = ['Walking', 'Running', 'Jumping', 'Sitting'];
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  output.textContent = randomActivity;

  // In a real app, you'd POST the video to a backend model for inference
}
