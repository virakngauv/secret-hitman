function XEmoji(props) {
  const kickPlayer = props.kickPlayer;

  function handleClick(e) {
    console.log("I was clicked!");
    e.preventDefault();
    e.stopPropagation();
    kickPlayer();
  }
  
  return (
    <span onClick={handleClick} role="button" aria-label="cross-mark">❌</span>
  )
}

export default XEmoji;
