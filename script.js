// Movie data as provided
const movieOptions = {
  Happy: {
    name: "Welcome",
    link: "https://www.primevideo.com/detail/0MJFLZHIV04F9V9V21RAY2Z8ZZ/",
    thumbnail:
      "https://m.media-amazon.com/images/S/pv-target-images/af13e1c59556eb143d2b213c9f95567677f409033d4c9619c553367d71bee982._SX1920_FMwebp_.jpg",
  },
  Sad: {
    name: "Call me Bae",
    link: "https://www.primevideo.com/detail/0TF2BODX83KZOWTP08NXFE897E/",
    thumbnail:
      "https://m.media-amazon.com/images/S/pv-target-images/0cb7ac74d1d6e8eb2e3d59aa5354359714eb54d84fcfaa616d9de19d64b492ca._SX1920_FMwebp_.jpg",
  },
  Excited: {
    name: "Citadel Honey Bunny",
    link: "https://www.primevideo.com/detail/0KYRVT4JDB957NXZO72E2MIFW5",
    thumbnail:
      "https://m.media-amazon.com/images/S/pv-target-images/51c2c75da778c109ccc33ff293ff48f0cccc60b18c3fef8a42afe2a80e07acac._SX1920_FMwebp_.jpg",
  },
  Neutral: {
    name: "Farzi",
    link: "https://www.primevideo.com/detail/0HDHQAUF5LPWOJRCO025LFJSJI",
    thumbnail:
      "https://m.media-amazon.com/images/S/pv-target-images/8aed532f0875925f72c4012aab688ed409773ecbfb3b18e1a39cd9ad1a4dd485._SX1920_FMwebp_.jpg",
  },
  Angry: {
    name: "Agneepath",
    link: "https://www.primevideo.com/detail/0NU7IFXPL2WWSDHNGAR5Z1GUJE/",
    thumbnail:
      "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/1863426056ae862def9a69ca76e8af54cdb6b8a5a2be1100e096e59b00060847._UX1920_.png",
  },
};

// DOM elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const checkMoodBtn = document.getElementById("check-mood");
const noCameraLink = document.getElementById("no-camera");
const confirmMoodBtn = document.getElementById("confirm-mood");
const watchNowBtn = document.getElementById("watch-now");
const scanAgainBtn = document.getElementById("scan-again");
const optionButtons = document.querySelectorAll(".option-button[data-mood]");
const scanLine = document.getElementById("scan-line");

// Screens
const initialScreen = document.getElementById("initial-screen");
const moodSelectionScreen = document.getElementById("mood-selection-screen");
const resultScreen = document.getElementById("result-screen");

// Result elements
const detectedMood = document.getElementById("detected-mood");
const movieName = document.getElementById("movie-name");
const movieThumbnail = document.getElementById("movie-thumbnail");

let selectedMood = null;
let currentMovieLink = "";

// Initialize camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    video.srcObject = stream;
    checkMoodBtn.disabled = false;
  } catch (err) {
    console.error("Error accessing camera:", err);
    // If camera access fails, go directly to manual selection
    showMoodSelectionScreen();
  }
}

// Simulate scanning animation
function simulateScan() {
  return new Promise((resolve) => {
    scanLine.style.display = "block";
    scanLine.style.top = "0";

    let position = 0;
    const interval = setInterval(() => {
      position += 1;
      scanLine.style.top = position + "px";

      if (position >= 220) {
        clearInterval(interval);
        scanLine.style.display = "none";
        resolve();
      }
    }, 10);
  });
}

// Capture image from video
function captureImage() {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg");
}

// Simulate mood detection API call
async function detectMood(imageData) {
  // Normally, you would send the image to an OpenAI API here
  // For now, we'll simulate with a random mood
  const moods = ["Happy", "Excited", "Neutral", "Angry", "Sad"];
  const randomIndex = Math.floor(Math.random() * moods.length);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return moods[randomIndex];
}

// Show movie recommendation based on mood
function showRecommendation(mood) {
  // Default to Neutral if mood not found
  if (!movieOptions[mood]) {
    mood = "Neutral";
  }

  const movie = movieOptions[mood];
  detectedMood.textContent = mood;
  movieName.textContent = movie.name;
  movieThumbnail.src = movie.thumbnail;
  currentMovieLink = movie.link;

  initialScreen.style.display = "none";
  moodSelectionScreen.style.display = "none";
  resultScreen.style.display = "block";
}

// Show mood selection screen
function showMoodSelectionScreen() {
  initialScreen.style.display = "none";
  resultScreen.style.display = "none";
  moodSelectionScreen.style.display = "block";
}

// Reset to initial screen
function resetToInitialScreen() {
  resultScreen.style.display = "none";
  moodSelectionScreen.style.display = "none";
  initialScreen.style.display = "block";

  // Reset selection
  optionButtons.forEach((btn) => btn.classList.remove("selected"));
  confirmMoodBtn.disabled = true;
  selectedMood = null;
}

// Event Listeners
checkMoodBtn.addEventListener("click", async () => {
  await simulateScan();
  const imageData = captureImage();
  const detectedMood = await detectMood(imageData);
  showRecommendation(detectedMood);
});

noCameraLink.addEventListener("click", (e) => {
  e.preventDefault();
  showMoodSelectionScreen();
});

// Mood selection buttons
optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    optionButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
    selectedMood = button.getAttribute("data-mood");
    confirmMoodBtn.disabled = false;
  });
});

confirmMoodBtn.addEventListener("click", () => {
  if (selectedMood) {
    showRecommendation(selectedMood);
  }
});

watchNowBtn.addEventListener("click", () => {
  // Navigate to movie link
  window.open(currentMovieLink, "_blank");
});

scanAgainBtn.addEventListener("click", resetToInitialScreen);

// Initialize the app
initCamera();
