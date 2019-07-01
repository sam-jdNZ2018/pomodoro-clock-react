const render = ReactDOM;
const SESSION = "SESSION";
const BREAK = "BREAK";
const INITIAL_STATE = { status: "", time_type: SESSION, time_left: 25 * 60, break_length: 5, session_length: 25 };
const BEEP = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3";

const SettingChanger = props => {
  return (
    React.createElement("div", { class: "setting-cont" },
    React.createElement("div", { id: props.sname + "-label", style: props.labelColor }, props.sname.charAt(0).toUpperCase() + props.sname.slice(1), " Length "),
    React.createElement("div", { class: "setting-inner" },
    React.createElement("button", { id: props.sname + "-decrement", style: props.visible, type: "button", onClick: () => props.changer(-1) }, React.createElement("i", { className: "fas fa-minus" })),
    React.createElement("label", { id: props.sname + "-length", style: props.labelColor }, " ", props.setting),
    React.createElement("button", { id: props.sname + "-increment", style: props.visible, type: "button", onClick: () => props.changer(1) }, React.createElement("i", { className: "fas fa-plus" })))));



};

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.timer = "";
    this.clip = "";
    this.getClockTime = this.getClockTime.bind(this);
    this.changeBreak = this.changeBreak.bind(this);
    this.changeSession = this.changeSession.bind(this);
    this.startStop = this.startStop.bind(this);
    this.tickTime = this.tickTime.bind(this);
    this.reset = this.reset.bind(this);
    this.audio = React.createRef();
  }

  //Convert an amount of seconds into the minutes/seconds format to display on a clock
  getClockTime(seconds) {
    let min = Math.floor(seconds / 60).toString().padStart(2, "0");
    let sec = (seconds % 60).toString().padStart(2, "0");
    return min + ":" + sec;
  }

  //Change the value of the break length by the value provided
  changeBreak(value) {
    let new_break = this.state.break_length + value;
    if (new_break > 0 && new_break <= 60) {
      this.setState({ status: "", time_type: this.state.time_type, time_left: this.state.time_left, break_length: new_break, session_length: this.state.session_length });
    }
  }

  //Change the value of the session length by the value provided
  changeSession(value) {
    let new_session = this.state.session_length + value;
    if (new_session > 0 && new_session <= 60) {
      this.setState({ status: "", time_type: this.state.time_type, time_left: new_session * 60, break_length: this.state.break_length, session_length: new_session });
    }
  }

  //Start the timer if it ic currently stopped or stop it of it is currently ticking
  startStop() {
    //Code between comments is for ensuring asynchronous tests pass
    this.audio.current.load();
    // this.audio.current.volume = 0.00; 
    let promise = this.audio.current.play();
    if (promise !== undefined) {
      promise.then(_ => {
      }).catch(error => {
      });
    }
    //this.audio.current.volume = 1.0;
    //

    if (this.timer == "") {
      this.setState({ status: "playing", time_type: this.state.time_type, time_left: this.state.time_left, break_length: this.state.break_length, session_length: this.state.session_length });
      this.timer = setInterval(this.tickTime, 1000);
    } else
    {
      this.setState({ status: "paused", time_type: this.state.time_type, time_left: this.state.time_left, break_length: this.state.break_length, session_length: this.state.session_length });
      clearInterval(this.timer);
      this.timer = "";
    }
  }

  //A tick of the clock; remove one second of the current time displayed
  tickTime() {
    if (this.state.time_left == 0) {
      /*this.audio.current.volume = 1.0;
                                     */let promise = this.audio.current.play();
      if (promise !== undefined) {
        promise.then(_ => {
        }).catch(error => {
        });
      }
      if (this.state.time_type == SESSION) {
        this.setState({ status: this.state.action, time_type: BREAK, time_left: this.state.break_length * 60, break_length: this.state.break_length, session_length: this.state.session_length });
      } else
      {
        this.setState({ status: this.state.action, time_type: SESSION, time_left: this.state.session_length * 60, break_length: this.state.break_length, session_length: this.state.session_length });
      }
    } else
    {
      this.setState({ status: this.state.action, time_type: this.state.time_type, time_left: this.state.time_left - 1, break_length: this.state.break_length, session_length: this.state.session_length });
    }
  }

  //Reset the time left, break length and session length parameters to their initial states
  reset() {
    this.audio.current.pause();
    this.audio.current.currentTime = 0;
    if (this.timer != "") {
      clearInterval(this.timer);
      this.timer = "";
    }
    this.setState(INITIAL_STATE);
  }

  render() {
    let symbol = "fas fa-play"; //If the play or stop icon is to be displayed
    let symbColor = { color: "#66ff66" };
    let canChange = { visibility: "visible" }; // If the plus/minus icons for the break/session length are visible
    let statusColor = "white";
    if (this.state.status != "") {
      canChange.visibility = "hidden";
    }
    if (this.state.status == "playing") {
      statusColor = "#66ff66";
      symbol = "fas fa-pause";
      symbColor.color = "red";
    }
    if (this.state.status == "paused") {
      statusColor = "red";
    }
    let clockRimStyle = { color: "white", borderColor: statusColor };
    let headColor = { color: statusColor };

    let breakLabelColor = { color: "white" };
    let sessLabelColor = { color: "white" };
    if (this.state.status != "" && this.state.time_type == SESSION) {
      sessLabelColor.color = statusColor;
    } else
    if (this.state.status != "" && this.state.time_type == BREAK) {
      breakLabelColor.color = statusColor;
    }
    return (
      React.createElement("div", { id: "clock-outer" },
      React.createElement("h1", null, "Pomodoro Clock"),
      React.createElement("audio", { ref: this.audio, id: "beep", src: BEEP }),
      React.createElement("div", { id: "center" },








      React.createElement(SettingChanger, { sname: "break", setting: this.state.break_length, changer: this.changeBreak, visible: canChange, labelColor: breakLabelColor }),
      React.createElement("div", { id: "timer-cont" },
      React.createElement("div", { id: "time-center", style: clockRimStyle }, React.createElement("h2", { id: "timer-label", style: headColor }, this.state.time_type), React.createElement("span", { id: "time-left" }, this.getClockTime(this.state.time_left)))),









      React.createElement(SettingChanger, { sname: "session", setting: this.state.session_length, changer: this.changeSession, visible: canChange, labelColor: sessLabelColor })),

      React.createElement("div", { id: "clock-functions-cont" },
      React.createElement("button", { id: "start_stop", type: "button", onClick: this.startStop }, React.createElement("i", { className: symbol })),
      React.createElement("button", { id: "reset", type: "button", onClick: this.reset }, React.createElement("i", { className: "fas fa-redo" })))));


  }}


ReactDOM.render(React.createElement(Pomodoro, null), document.getElementById("main"));