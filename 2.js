const poses = [
  {length: 2 * 60, count: 5},
  {length: 15 * 60, count: 3},
]

const speak = (words) => {
  const utterance = new SpeechSynthesisUtterance(words);
  window.speechSynthesis.speak(utterance);
}

const secondsToTime = (seconds) => {
    const m = Math.floor(seconds % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(seconds % 60).toString().padStart(2,'0');
    
    return m + ':' + s;
}

const button = document.querySelector('button');

function start() {
  speak("Welcome to the second half!");
  speak("The pose plan for the rest of the session is:");
  poses.forEach((pose) => {
    speak(`${pose.count} times ${pose.length / 60} minute${pose.length > 1 ? "s" : ""}.`);
  });

  speak(`${poses[0].length / 60} minute pose.`);
  speak("Let me know when you are ready.");

  button.textContent = "Ready"
  button.removeEventListener('click', start)
  button.addEventListener('click', runTimer)
}

function runTimer() {
  speak("Ready, set, go!");
  button.style.display = "none"

  let timerLength = poses[0].length;
  let timeLeft = timerLength;

  let timer = document.getElementById('timeLeft');
  const timerElement = document.querySelector('.timer')
  const timerCircle = timerElement.querySelector('svg > circle + circle');
  timerCircle.style.strokeDashoffset = 1;
    
  let countdownTimer = setInterval(function(){
    if(timeLeft >= 0){
      const timeRemaining = timeLeft--;
      const normalizedTime = (timerLength - timeRemaining) / timerLength;
      timerCircle.style.strokeDashoffset = normalizedTime;
      timer.textContent = secondsToTime(timeRemaining);
      if (timerLength >= 600 && timeLeft == timerLength / 2) {
        speak("Ding! That's the half way sound.");
      }
    } else {
      clearInterval(countdownTimer);
      
      poses[0].count -= 1;

      if (poses[0].count > 0) {
        speak("Next pose please.")
        if (poses[0].length < 600) {
          window.setTimeout(runTimer, 5000)
          return
        }
      } else {
        poses.shift()
        if (!poses.length) {
          speak("That's the end of the session, thank you very much for coming.")
          return;
        }
        speak(`${poses[0].length / 60} minute pose.`);
      }

      speak("Let me know when you are ready.");
      button.style.display = "block"
    }  
  }, 1000);
}

button.addEventListener('click', start)
