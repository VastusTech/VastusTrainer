import React, {Component, Fragment} from 'react'
import {Visibility, Header, Grid, Modal, Button, Image} from 'semantic-ui-react'
import dateFns from "date-fns";
import ChallengeList from "../components/ChallengeList";
import {convertToISOString} from "../logic/TimeHelper";
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import { connect } from "react-redux";

class Calendar extends React.Component {
  
    state = {
    	currentMonth: new Date(),
    	selectedDate: new Date(),
        grabbedChallenges: false,
        dayChallengeIDs: []
	};

 //constructs the overhead display so you can view which month, year, and days you are viewing
 renderHeader() {
 
 const dateFormat = "MMMM YYYY";
      return (
        <div className="header row flex-middle">
          <div className="col col-start">
            <div className="icon" onClick={this.prevMonth}>
              chevron_left
            </div>
          </div>
          <div className="col col-center">
            <span>
              {dateFns.format(this.state.currentMonth, dateFormat)}
            </span>
          </div>
          <div className="col col-end" onClick={this.nextMonth}>
            <div className="icon">chevron_right</div>
          </div>
        </div>
      );
  }
	
  //Function displays the days of the week
  renderDays() {
  
  const dateFormat = "ddd";
  const days = [];
  
  //startDate is the first day of that particular month
  let startDate = dateFns.startOfWeek(this.state.currentMonth);
  	
  	//for loop for an array of that week
  	for (let i = 0; i < 7; i++) {
    	days.push(
      		<div className="col col-center" key={i}>
        		{dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
      		</div>
    	);
  	}
  	return <div className="days row">{days}</div>;
  }

    getChallengeAttribute(attribute, challengeID) {
        if (challengeID) {
            //alert("Challenge ID: " + challengeID);
            let challenge = this.props.cache.challenges[challengeID];
            if (challenge) {
                //alert("Challenge: " + JSON.stringify(challenge));
                if (attribute.substr(attribute.length - 6) === "Length") {
                    attribute = attribute.substr(0, attribute.length - 6);
                    if (challenge[attribute] && challenge[attribute].length) {
                        return challenge[attribute].length;
                    }
                    else {
                        return 0;
                    }
                }
                /*if(attribute === "tags") {
                    console.log(challenge[attribute]);
                }*/
                //alert("Attribute found: " + challenge[attribute]);
                return challenge[attribute];
            }
        }
        return null;
    }

  getChallengesOnDay = (date) => {
      //return convertToISOString(date).substr(0, 10);
      if (this.props.user.challenges) {
          let dayChallenges = [];
          for (let i = 0; i < this.props.user.challenges.length; i++) {
              if (this.getChallengeAttribute("endTime", this.props.user.challenges[i])) {
                  //alert(this.getChallengeAttribute("endTime", this.props.user.challenges[i]).substr(0, 10) + " vs " + convertToISOString(date).substr(0, 10));
                  if (this.getChallengeAttribute("endTime", this.props.user.challenges[i]).substr(0, 10) === convertToISOString(date).substr(0, 10)) {
                      //let dailyChallenges = this.state.dayChallengeIDs;
                      //alert("Before: " + dailyChallenges.push(this.props.user.challenges[i]));
                      dayChallenges.push(this.props.user.challenges[i]);
                      //alert("After: " + dayChallenges);
                  }
              }
          }
          //alert(dayChallenges);
          if(dayChallenges.length > 0) {
              return (<ChallengeList challengeIDs={dayChallenges}/>);
              //return convertToISOString(date).substr(0, 10);
          }
      }
      return "Nothing today";
  };

    displayChallenges = (date) => {
        //return convertToISOString(date).substr(0, 10);
        if (this.props.user.challenges) {
            let dayChallenges = [];
            for (let i = 0; i < this.props.user.challenges.length; i++) {
                if (this.getChallengeAttribute("endTime", this.props.user.challenges[i])) {
                    //alert(this.getChallengeAttribute("endTime", this.props.user.challenges[i]).substr(0, 10) + " vs " + convertToISOString(date).substr(0, 10));
                    if (this.getChallengeAttribute("endTime", this.props.user.challenges[i]).substr(0, 10) === convertToISOString(date).substr(0, 10)) {
                        //let dailyChallenges = this.state.dayChallengeIDs;
                        //alert("Before: " + dailyChallenges.push(this.props.user.challenges[i]));
                        dayChallenges.push(this.props.user.challenges[i]);
                        //alert("After: " + dayChallenges);
                    }
                }
            }
            //alert(dayChallenges);
            if(dayChallenges.length > 0) {
                //return this.getChallengeAttribute("tags", dayChallenges[0]);
                //this.displayTagIcons(this.getChallengeAttribute("tags", dayChallenges[0]));
                //return convertToISOString(date).substr(0, 10);
                let tags = this.getChallengeAttribute("tags", dayChallenges[0]);
                if (tags.length === 1) {
                    return (
                        <Image style={{height: '20px', width: '20px'}} size='mini' src={require('../img/' + tags[0] + '_icon.png')}/>
                    );
                }
                else if (tags.length === 2) {
                    return (
                        <div>
                            <Image style={{height: '20px', width: '20px'}} src={require('../img/' + tags[0] + '_icon.png')}/>
                            <Image style={{height: '20px', width: '20px'}} src={require('../img/' + tags[1] + '_icon.png')}/>
                        </div>
                    );
                }
                else if (tags.length === 3) {
                    return(
                        <div>
                            <Image style={{height: '20px', width: '20px'}} src={require('../img/' + tags[0] + '_icon.png')}/>
                            <Image style={{height: '20px', width: '20px'}} src={require('../img/' + tags[1] + '_icon.png')}/>
                            <Image style={{height: '20px', width: '20px'}} src={require('../img/' + tags[2] + '_icon.png')}/>
                        </div>
                    );
                }
                else if (tags.length === 4) {
                    return(
                        <div>
                            <Image style={{height: '19px', width: '19px'}} src={require('../img/' + tags[0] + '_icon.png')}/>
                            <Image style={{height: '19px', width: '19px'}} src={require('../img/' + tags[1] + '_icon.png')}/>
                            <Image style={{height: '19px', width: '19px'}} src={require('../img/' + tags[2] + '_icon.png')}/>
                            <Image style={{height: '19px', width: '19px'}} src={require('../img/' + tags[3] + '_icon.png')}/>
                        </div>
                    );
                }
                else {
                    return (
                        // "There ain't no tags round these parts partner " + tags
                        null
                    );
                }
            }
        }
        //return null;
    };
  
  //This grabs info about the current viewed month (days and date) and displays it in a calendar formatted grid
  //section we should associate days with challenge end dates
    renderCells() {
        //defines getDate as grabbing the numerical date of some day; require loads module from date-fns
        let getDate = require('date-fns/get_date')

        const { currentMonth, selectedDate } = this.state;
        //first and last of the month so we can loop from start to finish
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        //Each row's start date so we can loop on a weekly basis
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);
        //current day is the numerical date of whatever today is
        const currentDate = getDate(new Date())
        const dateFormat = "D";
        const rows = [];


        //days are an empty array
        let days = [];
        //start on the first day of the month
        let day = startDate;
        //
        let formattedDate = "";

        //these nested loops allow us to go through all the days in a month then all days per row/week
        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                //
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;

                days.push(
                    <Modal trigger={<div className={
                        `col cell ${
                            !dateFns.isSameMonth(day, monthStart)
                                ? "disabled"
                                : dateFns.isSameDay(day, selectedDate) ? "selected"
                                : dateFns.isSameDay(day, currentDate) ? "current" : ""
                            }`}
                         key={day}
                         onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                        <span className="chalDay">{this.displayChallenges(day)}</span>
                    </div>}>{this.getChallengesOnDay(day)}</Modal>
                );
                //increment day for while loop progression
                day = dateFns.addDays(day, 1);
            }

            //Each day is constructed as a cell/modal trigger
            //makes the most sense to check scheduled challenges associated and add them to the 'day list'
            rows.push(
                <div className="row" key={day}>
                {days}
                </div>
            );

            //empty days for next row
            days = [];
        }
	
	return <div className="body">{rows}</div>;

	}


  
  onDateClick = day => {
  this.setState({
    selectedDate: day
  });
};

  //These two functions allow us to toggle the viewed month
  nextMonth = () => {
  	//Use the dateFns function to add
  	this.setState({
    currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
  });};

  prevMonth = () => {
  	this.setState({
  	//Use the dateFns function to subtract
    currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
  });};
  
  
  render() {
    return (
    
    
    
      <div className="calendar_view">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    user: state.user,
    info: state.info,
    cache: state.cache
});

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserAttributes: (variablesList, dataHandler) => {
            dispatch(fetchUserAttributes(variablesList, dataHandler));
        },
        forceFetchUserAttributes: (variablesList) => {
            dispatch(forceFetchUserAttributes(variablesList));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);