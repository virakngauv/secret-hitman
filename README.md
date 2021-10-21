# secret-hitman
A fun, competitive word selection game. 

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# TODOs
* Make joining room codes work for mixed cases (upper case doesn't find room)
* Use useContext to avoid passing down params through components
* Rename hint as "messages" and make it an array of strings, and on the GameScreen component, make it so that an Announcer component is generated for each array element
* Display room code on GameScreen component
* Also display a round indicator e.g. Round 1 of 2
* Look into Joi for user input validation (room code (URL), player name, api calls)
* Implement garbage collection for old games
* Prevent making too many games or too many players in a game (thousands)
* Fix keyboard navigation for codemaster hint submission
* Add proper credits page
* Add video recording of rules for how to play
* Make http redirect to https
* Make subdomains redirect to secrethitman.com (e.g. www.secrethitman.com -> secrethitman.com)
* Clean up project files (like unneeded react stuff)