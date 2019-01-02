import React, {Component, Fragment} from 'react'
import {Visibility, Header, Grid, Modal, Button } from 'semantic-ui-react'
import dateFns from "date-fns";


class Calendar extends React.Component {
  
    state = {
    	currentMonth: new Date(),
    	selectedDate: new Date()
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
      			<div className={
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
      </div>
    );
    //increment day for while loop progression
    day = dateFns.addDays(day, 1);
  }
  
  //Each day is constructed as a cell/modal trigger
  //makes the most sense to check scheduled challenges associated and add them to the 'day list'
  rows.push(
    <Modal trigger={<div className="row" key={day}>
      {days}
    </div>}>Insert Challenge Card List</Modal>
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
    
    
    
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}

      </div>
    );
  }
}




export default Calendar;