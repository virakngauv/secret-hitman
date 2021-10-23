import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import LobbyFooter from "../LobbyFooter/index.js";
import LobbyRoster from "../LobbyRoster/index.js";
import MenuHeader from "../MenuHeader/index.js";
import RoomCode from "../RoomCode/index.js";
import { getPlayers, leaveRoom, registerListener } from "../../api";

function LobbyScreen(props) {
  // const { roomCode } = useParams();
  const roomCode = props.roomCode;
  const [players, setPlayers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getPlayers(setPlayers);

    // TODO: maybe pull these into API? depends on rest of structure of code
    registerListener("playerChange", () => {
      getPlayers(setPlayers);
    });
    registerListener("playerKicked", (kickedPlayerID) => {
      const playerID = sessionStorage.getItem("playerID");
      if (playerID === kickedPlayerID) {
        history.push("/");
        leaveRoom(roomCode);
      } else {
        console.log("getPlayers cause you weren't kicked but someone else was..")
        getPlayers(setPlayers);
      }
    });
  }, [roomCode, history]);


  // if (players.length === 0) {
  //   getPlayers(roomCode, setPlayers);
  // }
  // console.log("just got players on lobby screen");
  // console.log("players is ", players);

  

  const title = "Lobby";
  const subtitle = "Share your room code below to add more players!";
  // const players = [
  //   {
  //     name: "Alfred", 
  //     status: Status.ACTIVE
  //   },
  //   {
  //     name: "Beth", 
  //     status: Status.ACTIVE
  //   },
  //   {
  //     name: "Crim", 
  //     status: Status.ACTIVE
  //   },
  //   {
  //     name: "Dion", 
  //     status: Status.INACTIVE
  //   },
  //   {
  //     name: "Calphanlopos", 
  //     status: Status.INACTIVE
  //   },
  //   {
  //     name: "Tundra", 
  //     status: Status.ACTIVE
  //   },
  // ];

  return (
    <Container className="screen">
      <MenuHeader title={title} subtitle={subtitle} />
      <RoomCode roomCode={roomCode} />
      <LobbyRoster players={players} />
      <LobbyFooter roomCode={roomCode} players={players} />
    </Container>
  );
}

export default LobbyScreen;
