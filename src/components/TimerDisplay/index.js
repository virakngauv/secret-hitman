import Announcer from "../Announcer";
// import { useEffect, useState } from "react";

function TimerDisplay(props) {
  const totalMiliseconds = props.time;
  // const setTimerTime = props.setTimerTime;
  const isTurnPausedOrEnded = props.isTurnPausedOrEnded;

  // const [blinkTime, setBlinkTime] = useState(false);
  // const [blinkTimerID, setBlinkTimerID] = useState();

  function timerString(time) {
    var n = Math.abs(time);
    var zeros = Math.max(0, 2 - Math.floor(n).toString().length);
    var zeroString = Math.pow(10,zeros).toString().substr(1);

    return zeroString+n;
  }

  const totalSeconds = totalMiliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds - (minutes * 60));
  const minutesString = timerString(minutes);
  const secondsString = timerString(seconds);
  const time = isTurnPausedOrEnded ? `Starting in.. ${seconds}` : `${minutesString}:${secondsString}`;

  // useEffect(() => {

  // }, [])

  // if (totalMiliseconds <= 0) {
  //   setInterval(() => {
  //     setBlinkTime(!blinkTime);
  //   }, 600);
  // }

  // useEffect(() => {
  //   let timerID;
  //   if (!blinkTimerID && totalMiliseconds <= 0) {
  //     timerID = setInterval(() => {
  //       setBlinkTime(prevBlinkTime => !prevBlinkTime);
  //       console.log(`should be blinking now.. blinkTime is ${blinkTime}`);
  //     }, 700);
  
  //     setBlinkTimerID(timerID);
    
  //     console.log(`timerID is ${timerID}`);
  //   }

  //   return () => clearInterval(timerID);
  // }, [blinkTime, blinkTimerID, totalMiliseconds])



  // const timerID = setInterval(() => {
  //   setBlinkTime(!blinkTime);
  // }, 600);

  // console.log(`timerID is ${timerID}`);

  return (
    <Announcer message={time}/>
  );
}

export default TimerDisplay;
