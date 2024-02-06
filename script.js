document.addEventListener('DOMContentLoaded', function() {
    let selectedEmotion = null;
    let selectedRange = null;
    const editor = document.getElementById('editor');
    const emojiSliderContainer = document.getElementById('emoji-slider-container');
    const emojiSelector = document.getElementById('emoji-selector');
    const sliderContainer = document.getElementById('slider-container');
    const generateLineBtn = document.getElementById('generate-line-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
  const loadingContainer = document.getElementById('loading-container');
    const audioPlayer = document.getElementById('audio-player');
  const audioContainer = document.getElementById('audio-feedback-container');
    const slider = document.getElementById('emotion-slider');
    const lessLabel = document.getElementById('less-label');
    const moreLabel = document.getElementById('more-label');
   const tryAgainBtn = document.getElementById('try-again-btn');
  const downloadBtn = document.getElementById('download-btn');
  const emotionToEmoji = {
      'angry': '😠', // Example emoji for angry
      'happy': '😊', // Example emoji for happy
      'sad': '😢', // Example emoji for sad
      'surprised': '😮', // Example emoji for surprised
      'neutral': '😐' // Example emoji for neutral
      // Add more mappings as needed
  };
  const buttonContainer = document.getElementById('button-container');
  const feedbackSection = document.getElementById('feedback-section');
const thankyouMessage = document.getElementById('thank-you-message');
  document.getElementById('thumbs-up-btn').addEventListener('click', function() {
      showFeedback('👍');
  });

  document.getElementById('thumbs-down-btn').addEventListener('click', function() {
      showFeedback('👎');
  });

  function showFeedback(emoji) {
      const thankYouMessage = document.getElementById('thank-you-message');
      thankYouMessage.textContent = emoji + " Thanks for your feedback!";
      thankYouMessage.style.display = 'block';

      // Hide feedback buttons after selection
      document.getElementById('feedback-section').style.display = 'none';
  }

  let isDragging = false;
  let offsetX, offsetY;

  emojiSliderContainer.addEventListener('mousedown', function(e) {
    if (sliderContainer.contains(e.target)) {
      // Do not start dragging if the mousedown event is inside the slider container
      return;
    }

    isDragging = true;
    const rect = emojiSliderContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    emojiSliderContainer.style.position = 'absolute';
  });

  document.addEventListener('mouseup', function() {
      isDragging = false;
  });

  document.addEventListener('mousemove', function(e) {
      if (isDragging) {
          emojiSliderContainer.style.left = e.clientX - offsetX + 'px';
          emojiSliderContainer.style.top = e.clientY - offsetY + 'px';
      }
  });

    editor.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        if (selection.toString().trim() !== '') {
            selectedRange = selection.getRangeAt(0);
            emojiSliderContainer.style.display = 'block';
            emojiSliderContainer.style.left = `${e.clientX}px`;
            emojiSliderContainer.style.top = `${e.clientY}px`;

            emojiSelector.style.display = 'flex';
            sliderContainer.style.display = 'none';
            generateLineBtn.style.display = 'none';
            loadingContainer.style.display = 'none';
            buttonContainer.style.display = 'none';
            feedbackSection.style.display = 'none';

thankyouMessage.style.display = 'none';
            audioPlayer.style.display = 'none';
          audioContainer.style.display = 'none';
            tryAgainBtn.style.display = 'none';
            downloadBtn.style.display = 'none';
        
            document.querySelectorAll('.emoji-btn').forEach(b => b.style.opacity = '1');
        } else {
            emojiSliderContainer.style.display = 'none';
        }
    });

    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.emoji-btn').forEach(b => b.style.opacity = '0.3');
            this.style.opacity = '1';

            selectedEmotion = this.getAttribute('data-emotion');
          if (selectedEmotion === "neutral") {
              // Hide slider and labels for 'neutral' emotion
              sliderContainer.style.display = 'none';
              generateLineBtn.style.display = 'block'; 
              generateLineBtn.style.marginTop = '16px';
          } else {
              // Show slider and labels for other emotions
              lessLabel.textContent = `Less ${selectedEmotion}`;
              moreLabel.textContent = `More ${selectedEmotion}`;
              sliderContainer.style.display = 'block';
              generateLineBtn.style.display = 'block';
          }
        });
    });

generateLineBtn.addEventListener('click', function() {
        emojiSelector.style.display = 'none';
        sliderContainer.style.display = 'none';
        this.style.display = 'none';
        loadingContainer.style.display = 'block'
        loadingSpinner.style.display = 'block';
        buttonContainer.style.display = 'none'; // Hide button container when generating line

thankyouMessage.style.display = 'none';
        feedbackSection.style.display = 'none';

      let counter = 0;
          const interval = setInterval(function() {
              counter++;
              document.getElementById('percentage-counter').textContent = counter + '%';
              if (counter >= 100) clearInterval(interval);
          }, (3000 / 100)); // Adjust interval to match loading time

  setTimeout(function() {
      loadingContainer.style.display = 'none';
      audioPlayer.style.display = 'block';
      audioContainer.style.display = 'block';
      tryAgainBtn.style.display = 'block'; // Show "Try again" button
      downloadBtn.style.display = 'block';
      buttonContainer.style.display = 'flex';
      feedbackSection.style.display = 'flex';

      // Check if the play button already exists, if not create it
      let playButton = document.querySelector('.play-button');
      const emoji = emotionToEmoji[selectedEmotion] || '';

      if (!playButton) {
          playButton = document.createElement('button');
          playButton.className = 'play-button';
          playButton.contentEditable = 'false';
          playButton.onclick = function() {
              audioContainer.style.display = 'block';
              feedbackSection.style.display = 'flex';
              buttonContainer.style.display = 'flex';
              emojiSliderContainer.style.display = 'block';
              emojiSelector.style.display = 'none';
              sliderContainer.style.display = 'none';
          };

          // Update or set inner HTML of the play button
          playButton.innerHTML = '▶️ ' + emoji;
      }

      if (selectedRange) {
          const paragraph = selectedRange.startContainer.parentNode;
          const speakerElement = paragraph.querySelector('.bear, .duck');

          if (speakerElement) {
              speakerElement.parentNode.insertBefore(playButton, speakerElement.nextSibling);
          } else {
              // Fallback: insert at the end of the paragraph if no speaker element found
              paragraph.appendChild(playButton);
          }
      }
  }, 3000);
      });

  tryAgainBtn.addEventListener('click', function() {
      // Reset UI elements for starting the process again
      audioPlayer.style.display = 'none';
      audioContainer.style.display = 'none';
      tryAgainBtn.style.display = 'none';
      downloadBtn.style.display = 'none';
      buttonContainer.style.display = 'none'; // Hide button container when trying again
      feedbackSection.style.display = 'none';

thankyouMessage.style.display = 'none';
      emojiSelector.style.display = 'flex';
      document.querySelectorAll('.emoji-btn').forEach(b => b.style.opacity = '1');
      // Keep slider and generate line button hidden until an emoji is selected again
  });

    slider.addEventListener('input', function() {
        if (!selectedRange) return;

        const span = document.createElement('span');
        span.className = 'emotion-text';
        span.textContent = selectedRange.toString();
        span.setAttribute('data-emotion', selectedEmotion);
        span.setAttribute('data-intensity', slider.value);

        selectedRange.deleteContents();
        selectedRange.insertNode(span);

        window.getSelection().removeAllRanges();
        window.getSelection().addRange(selectedRange);
    });

    emojiSliderContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#emoji-slider-container') && !event.target.closest('#editor')) {
            emojiSliderContainer.style.display = 'none';
        }
    });
});
