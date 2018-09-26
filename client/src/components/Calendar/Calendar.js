import React, { Component } from "react";
import dateFns, { getTime, isEqual, isAfter, isBefore, startOfDay, startOfToday } from "date-fns";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "./Calendar.css";

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = {
      currentMonth: new startOfDay(Date()),
      from: null,
      to: null,
      enteredTo: null,
      unavailable: this.props.unavailable,
      range: true
    }
  }

 

  handleDayClick(day) {
    const { from, to, currentMonth } = this.state;
    if (!this.state.range) {
      isAfter(day, dateFns.endOfMonth(currentMonth))
        ? this.nextMonth()
        : isBefore(day, dateFns.startOfMonth(currentMonth))
          ? this.prevMonth()
          : null
      this.props.updateUnix([day])
      this.setState({ from: day })
    } else {
      from && !to ? this.props.updateUnix([from, day]) : null
      isAfter(day, dateFns.endOfMonth(currentMonth))
        ? this.nextMonth()
        : isBefore(day, dateFns.startOfMonth(currentMonth))
          ? this.prevMonth()
          : null
      if (from && to) {
        this.setState({
          from: day,
          to: null,
          enteredTo: null
        });
        return;
      }
      if (!from) {
        this.setState({
          from: day,
          to: null,
          enteredTo: null
        });
      } else {
        isAfter(day, from)
          ? this.setState({
            to: day,
            enteredTo: day
          })
          : isBefore(day, from)
            ? this.setState({
              from: day,
              to: null,
              enteredTo: null
            })
            : null
      }
    }
  }
  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (from && !to) {
      this.setState({
        enteredTo: day
      });
    }
  }

  toUnix(day) {
    return getTime(day) / 1000
  }

  handleResetClick() {
    this.props.clearUnix();
    this.setState({
      from: null,
      to: null,
      enteredTo: null
    });
  }

 
  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="calHeader row flex-middle toggle-container">
        <div className="toggle-section-parent">

        </div>
        <div className="temp-month-container">
          <div className="column column-center left">
            <div className="icon" onClick={this.prevMonth}>
              <i className="fas fa-angle-double-left"></i>
            </div>
          </div>
          <div className="column column-center month">
            <span>
              {dateFns.format(this.state.currentMonth, dateFormat)}
            </span>
          </div>
          <div className="column column-center right">
            <div className="icon" onClick={this.nextMonth}>
              <i className="fas fa-angle-double-right"></i>
            </div>
          </div>
        </div>


        <div className="reset-button" onClick={this.handleResetClick}>

        </div>
      </div >
    );
  }

  renderInfo() {
    return (
      <div className="row flex-middle">
        <div className="column column-center viewing">
          {this.props.unavailableName ? <span style={{ fontWeight: "bold" }}>Availability for  {this.props.unavailableName}.</span> : null}
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="column column-center" key={i} >
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, from, to, enteredTo } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = startOfDay(day);
        days.push(
          <div
            className={`column cell ${
              isEqual(day, startOfToday())
                ? "today"
                : ""
              } ${
              isBefore(day, startOfToday())
                ? "disabled"
                : ""
              } ${
              this.state.range
                ? isEqual(day, from) || isEqual(day, to) || isEqual(day, enteredTo)
                  ? "selected"
                  : isAfter(day, from) && isBefore(day, enteredTo)
                    ? "range"
                    : ""
                : isEqual(day, from)
                  ? "selected"
                  : ""
              } ${
              this.props.unavailable.includes(getTime(day) / 1000)
                ? "unavailable"
                : ""
              }`}
            key={day}
            onClick={() => this.handleDayClick(dateFns.parse(cloneDay))}
            onMouseEnter={() => this.handleDayMouseEnter(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  }

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  }

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.renderInfo()}
        {/* <UnavailableView
          unavailableName={this.props.unavailableName}
        /> */}
        <div className="small-phone-btns">
          <div className="toggle-section">


          </div>
          <div className="reset-button" onClick={this.handleResetClick}>

          </div>
        </div>
      </div>

    );
  }
}

export default Calendar;