import React from "react";
import ReactTable from "react-table";
import { DateRangePicker } from "react-date-range";
import moment from "moment";

class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      show: false
    };
  }

  handleOnChange({ selection }) {
    const { onDateChange } = this.props;
    this.active = true;
    const { startDate, endDate } = selection;
    this.setState({ startDate, endDate });
    onDateChange && onDateChange({ startDate, endDate })
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  render() {
    const { startDate, endDate, show } = this.state;

    return (
      <div style={Styles.root}>
        <div>
          <button className="btn btn-default" onClick={this.show}>
            {dateIcon}{" "}
            {this.active
              ? moment(startDate).format("ll [ -> ]") +
                moment(endDate).format("ll")
              : "Select Date"}
          </button>
        </div>
        {show ? (
          <div style={Styles.dateRange} onMouseLeave={this.hide}>
            <DateRangePicker
              ranges={[{ startDate, endDate, key: "selection" }]}
              onChange={this.handleOnChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default DateRange;

const Styles = {
  root: {
    position: "relative"
  },
  dateRange: {
    position: "absolute",
    zIndex: 8
  }
};


const dateIcon = (<svg style={{marginRight: '6px'}} width="24" height="18" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path fill="none" d="M0 0h24v24H0z"/></svg>)
