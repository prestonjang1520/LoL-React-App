import React, { Component } from 'react';
import spinner from '../spinner.gif';
import './App.css';

/**
 * Parse match data into html string
 *
 * @param 	{json} 		matchData 				parsed json data from Riot API
 * @param 	{string} 	searchedSummonersName	summoner name provided by user to begin the match search
 * @return 	{string} 							html block for a specific match
 */
const parseMatch = function(matchData, searchedSummonersName){
	var matchHtml = '<li>';
	
	matchHtml +=  '<p>Game Duration: ' + matchData.gameDuration + '</p>';
	
	//get the searched summoner participant data
	var searchedSummoner = matchData.participantIdentities.find(o => o.player.summonerName.toLowerCase() == searchedSummonersName.toLowerCase());
	console.log(searchedSummoner);
	matchHtml += '<div><p>' + searchedSummoner.player.summonerName + '</p>'
	
	//get the searched summoner's stats & champion data
	var searchedSummonerStats = matchData.participants.find(p => p.participantId == searchedSummoner.participantId);
	
	//summoner spells
	matchHtml += '<p><label>Summoner Spells</label><br/>';
	matchHtml += '<label>Spell 1: </label>' + searchedSummonerStats.spell1Id + '<br/>';
	matchHtml += '<label>Spell 2: </label>' + searchedSummonerStats.spell2Id;
	matchHtml += '</p>';
	
	//summoner perks
	matchHtml += '<p><label>Summoner Perks</label><br/>';
	matchHtml += '<label>Perk 1: </label>' + searchedSummonerStats.stats.perk0 + '<br/>';
	matchHtml += '<label>Perk 2: </label>' + searchedSummonerStats.stats.perk1 + '<br/>';
	matchHtml += '<label>Perk 3: </label>' + searchedSummonerStats.stats.perk2 + '<br/>';
	matchHtml += '<label>Perk 4: </label>' + searchedSummonerStats.stats.perk3 + '<br/>';
	matchHtml += '<label>Perk 5: </label>' + searchedSummonerStats.stats.perk4 + '<br/>';
	matchHtml += '<label>Perk 6: </label>' + searchedSummonerStats.stats.perk5;
	matchHtml += '</p>';
	
	//champion name and level
	matchHtml += '<p><label>Champion: </label>' + searchedSummonerStats.championId + '</p>';
	matchHtml += '<p><label>Champion Level: </label>' + searchedSummonerStats.stats.champLevel + '</p>';
	
	//KDA
	matchHtml += '<p><label>K/D/A: </label>' + searchedSummonerStats.stats.kills + '/' + searchedSummonerStats.stats.deaths + '/' + searchedSummonerStats.stats.assists + '</p>';
	
	//items bought
	matchHtml += '<p><label>Items Bought</label><br/>';
	matchHtml += '<label>Item 1: </label>' + searchedSummonerStats.stats.item0 + '<br/>';
	matchHtml += '<label>Item 2: </label>' + searchedSummonerStats.stats.item1 + '<br/>';
	matchHtml += '<label>Item 3: </label>' + searchedSummonerStats.stats.item2 + '<br/>';
	matchHtml += '<label>Item 4: </label>' + searchedSummonerStats.stats.item3 + '<br/>';
	matchHtml += '<label>Item 5: </label>' + searchedSummonerStats.stats.item4 + '<br/>';
	matchHtml += '<label>Item 6: </label>' + searchedSummonerStats.stats.item5 + '<br/>';
	matchHtml += '<label>Item 7: </label>' + searchedSummonerStats.stats.item6;
	matchHtml += '</p>';
	
	//total creep score
	matchHtml += '<p>Creeps killed: ' + searchedSummonerStats.stats.totalMinionsKilled + '</p>';
	
	//outcome of match
	if(searchedSummonerStats.stats.win){
		matchHtml += '<p>Match Outcome: Win</p>';
	}
	else{
		matchHtml += '<p>Match Outcome: Loss</p>';
	}
	
	return matchHtml + '</li>';
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {summonerName: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({summonerName: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log('starting api call');
		var summonerName = this.state.summonerName;
		
		//display spinner to let user know the call is occuring
		document.getElementById('spinner').style.display = "block";
		document.getElementById('searchButton').style.display = "none";
		
		fetch(`http://ec2-13-59-58-50.us-east-2.compute.amazonaws.com:4000/getSummonerMatchData?summonerName=${encodeURIComponent(summonerName)}`)
			.then(response => response.json())
			.then(function(data){
				console.log(data);
				var matchResultsHtml = '';
				
				if(data.result.length > 0){
					matchResultsHtml += '<ul>';
					
					for(var i = 0; i < data.result.length; i++){
						matchResultsHtml += parseMatch(data.result[i], summonerName);
					}
					
					matchResultsHtml += '</ul>';
				}
				else{
					matchResultsHtml += '<p>There were no results found matching the summoner provided.</p>';
				}
				
				//hide spinner and populate results
				document.getElementById('spinner').style.display = "none";
				document.getElementById('searchButton').style.display = "inline";
				document.getElementById('results').innerHTML = matchResultsHtml;
				
		}).catch(err => {
			console.log(err);
			document.getElementById('spinner').style.display = "none";
			document.getElementById('searchButton').style.display = "inline";
			document.getElementById('results').innerHTML = '<p>There was an issue trying to grab the information on the provided summoner.</p>';
		});
	}
	
	render(){
		return(
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>league stats</label>
					<input id="summonerNameTextbox" type="text" placeholder="enter summoner name" value={this.state.summonerName} onChange={this.handleChange} /><br/>
					<input type="submit" id="searchButton" value="Search" />
					<img src={spinner} id="spinner" />
				</form>
				<div id="resultWrapper">
					<h2>Results</h2>
					<div id="results"></div>
				</div>
			</div>
		);
	}
}

export default App;