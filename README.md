# secret-hitman
A fun, competitive word selection game. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# TODOs
* Switching from data connection to wifi breaks listening (probably same issue as new socket not joining the right room, will probably move roomCode to sessionStorage to reestablish correct listeners (but will the listeners be registered on the right socket if it's not via a refresh?))
* Make room codes work for mixed cases (upper case doesn't find room)
* Use useContext to avoid passing down params through components
* Joining game mid-match when turn is "ended" should start as inactive
* Rename hint as "messages" and make it an array of strings, and on the GameScreen component, make it so that an Announcer component is generated for each array element