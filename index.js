const poses = [
  {length: 1 * 6, count: 5},
  {length: 2 * 6, count: 5},
  {length: 5 * 6, count: 3},
  {length: 10 * 6, count: 2},
  {length: 2 * 6, count: 5},
  {length: 15 * 6, count: 3},
]

const speak = (words) => {
  const utterance = new SpeechSynthesisUtterance(words);
  window.speechSynthesis.speak(utterance);
}

speak("Welcome to life drawing!");
speak("The pose plan for todays session is:");
poses.forEach((pose) => {
  speak(`${pose.count} times ${pose.length / 60} minute${pose.length > 1 ? "s" : ""}.`);
});

speak(`${poses[0].length / 60} minute pose.`);
speak("Let me know when you are ready.");

function runTimer() {
  speak("Ready, set, go!");
  document.querySelector('button').style.display = "none"

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
      timer.textContent = timeRemaining;
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
        }
        speak(`${poses[0].length / 60} minute pose.`);
      }

      speak("Let me know when you are ready.");
      document.querySelector('button').style.display = "block"
    }  
  }, 1000);
}

document.querySelector('button').addEventListener('click', runTimer)
