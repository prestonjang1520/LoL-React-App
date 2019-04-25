const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const APP_PORT = 4000;
require('dotenv').config();

process.env.LEAGUE_API_PLATFORM_ID = 'na1'
const LeagueJS = require('leaguejs');
const leagueJs = new LeagueJS(process.env.LEAGUE_API_KEY);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

function getMatchDetails(matchID){
	return leagueJs.Match.gettingById(matchID);
}

app.get('/getSummonerMatchData', (req, res) => {
	const name = req.query.summonerName || 'SHERN';
	res.setHeader('Content-Type', 'application/json');
  
	leagueJs.Summoner.gettingByName(name)
	.then(data => {
		
		leagueJs.Match.gettingRecentListByAccount(data.accountId)
		.then(matchListData => {
			
			var promiseArray = [];
			for(var i = 0; i < matchListData.matches.length; i++){
				promiseArray.push(getMatchDetails(matchListData.matches[i].gameId));
			}
			
			Promise.all(promiseArray).then(matchResults => {
				res.send(JSON.stringify({ result: matchResults }));
			});
		});
	})
	.catch(err => {
		console.log(err);
	});
});

app.listen(APP_PORT, () =>
  console.log('Express server is running on localhost:4000')
);