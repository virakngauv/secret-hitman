function RankEmoji(props) {
  const rank = props.rank;

  if (rank === 1) {
    return <span role="img" aria-label="gold">🥇</span>
  } else if (rank === 2) {
    return <span role="img" aria-label="silver">🥈</span>
  } else if (rank === 3) {
    return <span role="img" aria-label="bronze">🥉</span>
  }

  return<span aria-label="unranked"></span>
}

export default RankEmoji;
