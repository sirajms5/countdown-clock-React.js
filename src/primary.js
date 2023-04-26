// try component did mount with minutes and seconds remaining to find out break/session change after 0000

class App extends React.Component {
    constructor(props) {
        super(props);
        this.loop = undefined;
        this.audio = React.createRef()
        this.state = {
            addedMinutes: undefined,
            minutes: 25,
            seconds: "00",
            break: "05",
            breakLocked: 5,
            session: 25,
            sessionLocked: 25,
            label: "Session",
            power: "On",
            desiredMinutes: 25,
            loopedDesiredTime: 0,
            desiredBreakMinutes: 5,
            loopedDesiredBreakMinutes: 0,
            requiredDate: 0,
            requiredBreakDate: 0,
            startBreakHandle: 60,
            loopBreakHandle: 0,
            startSessionHandle: 60,
            loopSessionHandle: 0,
            pauseClass: "disabled"
        };
        this.handleBreakDec = this.handleBreakDec.bind(this);
        this.handleBreakInc = this.handleBreakInc.bind(this);
        this.handleSessionDec = this.handleSessionDec.bind(this);
        this.handleSessionInc = this.handleSessionInc.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this)
    }

    handleBreakDec = () => {
        if (this.state.break > 1) {
            if (this.state.break <= 10) {
                this.setState({
                    break: "0" + (this.state.break - 1),
                    desiredBreakMinutes: this.state.break - 1,
                    loopedDesiredBreakMinutes: 0,
                    power: "On"
                })
            } else {
                this.setState({
                    break: this.state.break - 1,
                    desiredBreakMinutes: this.state.break - 1,
                    loopedDesiredBreakMinutes: 0,
                    power: "On"
                })
            }
        } //else {
        //alert("Cannot set break bellow 1 minute")
        //}
        clearInterval(this.loop);
    }

    handleBreakInc = () => {
        if (this.state.break < 60) {
            if (this.state.break >= 9) {
                this.setState({
                    break: (Number(this.state.break) + 1),
                    desiredBreakMinutes: (Number(this.state.break) + 1),
                    loopedDesiredBreakMinutes: 0,
                    power: "On"
                });
            } else {
                this.setState({
                    break: "0" + (Number(this.state.break) + 1),
                    desiredBreakMinutes: (Number(this.state.break) + 1),
                    loopedDesiredBreakMinutes: 0,
                    power: "On"
                });
            }
        } //else {
        //alert("Cannot set break above 60 minutes")
        // }
        clearInterval(this.loop);
    }

    handleSessionDec = () => {
        if (this.state.session > 1) {
            if (this.state.session <= 10) {
                this.setState({
                    session: "0" + (this.state.session - 1),
                    desiredMinutes: this.state.session - 1,
                    minutes: "0" + (this.state.session - 1),
                    seconds: "00",
                    loopedDesiredTime: 0,
                    power: "On"
                })
            } else {
                this.setState({
                    session: this.state.session - 1,
                    desiredMinutes: this.state.session - 1,
                    minutes: this.state.session - 1,
                    seconds: "00",
                    loopedDesiredTime: 0,
                    power: "On"
                })
            }
        }
        clearInterval(this.loop);
    }
    //else {
    //alert("Cannot set session bellow 1 minute")
    //}

    handleSessionInc = () => {
        if (this.state.session < 60) {
            if (this.state.session >= 9) {
                this.setState({
                    session: (Number(this.state.session) + 1),
                    desiredMinutes: (Number(this.state.session) + 1),
                    minutes: (Number(this.state.session) + 1),
                    seconds: "00",
                    loopedDesiredTime: 0,
                    power: "On"
                });
            } else {
                this.setState({
                    session: "0" + (Number(this.state.session) + 1),
                    desiredMinutes: (Number(this.state.session) + 1),
                    minutes: "0" + (Number(this.state.session) + 1),
                    seconds: "00",
                    loopedDesiredTime: 0,
                    power: "On"
                });
            }
        } //else {
        //alert("Cannot set session above 60 minutes")
        // }

        clearInterval(this.loop);
    }

    handleStart = () => {

        $(".on-play").prop("disabled", true);
        $(".cursor-play").addClass("disable-on-play");
        $(".disable-on-play").removeClass("cursor-play");
        $(".fa-pause").prop("disabled", false);
        $(".fa-pause").removeClass("pause-cursor");
        $(".fa-pause").addClass("pause-enabled");
        $(".fa-arrow-down").prop("disabled", true);
        $(".fa-arrow-down").addClass("arrows-control");
        $(".fa-arrow-up").prop("disabled", true);
        $(".fa-arrow-up").addClass("arrows-control");

        this.setState({
            pauseClass: "enabled"
        })

        this.state.requiredDate = (this.state.desiredMinutes * this.state.startSessionHandle) + (this.state.loopedDesiredTime * this.state.loopSessionHandle);

        this.state.requiredBreakDate = (this.state.desiredBreakMinutes * this.state.startBreakHandle) + (this.state.loopedDesiredBreakMinutes * this.state.loopBreakHandle);

        if (this.state.power == "On") {
            this.loop = setInterval(() => {
                if (this.state.label == "Break") {

                    let BreakminutesRemaining = Math.floor((this.state.requiredBreakDate - 1) / 60);
                    let BreaksecondsRemaining = Math.floor((this.state.requiredBreakDate - 1) % 60);
                    this.setState({
                        minutes: BreakminutesRemaining < 10 ? "0" + BreakminutesRemaining : BreakminutesRemaining,
                        seconds: BreaksecondsRemaining < 10 ? "0" + BreaksecondsRemaining : BreaksecondsRemaining,
                        startBreakHandle: 0,
                        loopBreakHandle: 1,
                        loopedDesiredBreakMinutes: this.state.requiredBreakDate - 1, requiredBreakDate: this.state.requiredBreakDate - 1,
                        startSessionHandle: 60,
                        loopSessionHandle: 0,
                        requiredDate: this.state.desiredMinutes * this.state.startSessionHandle,
                        power: "Off"
                    });

                    if (BreakminutesRemaining == 0 && BreaksecondsRemaining == 0) {
                        this.audio.current.play()
                        setTimeout(() => {
                            this.setState({
                                label: "Session",
                                minutes: "0" + this.state.desiredMinutes,
                                seconds: "00",
                            })
                        }, 1000)
                    }
                } else {
                    let minutesRemaining = Math.floor((this.state.requiredDate - 1) / 60)
                    let secondsRemaining = Math.floor((this.state.requiredDate - 1) % 60)
                    this.setState({
                        minutes: minutesRemaining < 10 ? "0" + minutesRemaining : minutesRemaining,
                        seconds: secondsRemaining < 10 ? "0" + secondsRemaining : secondsRemaining,
                        startSessionHandle: 0,
                        loopSessionHandle: 1,
                        loopedDesiredTime: this.state.requiredDate - 1,
                        requiredDate: this.state.requiredDate - 1,
                        requiredBreakDate: this.state.desiredBreakMinutes * this.state.startBreakHandle,
                        loopBreakHandle: 0,
                        startBreakHandle: 60,
                        power: "Off"
                    });
                    if (minutesRemaining == 0 && secondsRemaining == 0) {
                        this.audio.current.play()
                        setTimeout(() => {
                            this.setState({
                                label: "Break",
                                minutes: "0" + this.state.desiredBreakMinutes,
                                seconds: "00"
                            })
                        }, 1000)
                    }
                }
            }, 1000)
        }
    }

    handlePause = () => {

        $(".on-play").prop("disabled", false);
        $(".disable-on-play").addClass("cursor-play")
        $(".cursor-play").removeClass("disable-on-play");
        $(".fa-pause").addClass("pause-cursor");
        $(".fa-pause").removeClass("pause-enabled");
        $(".fa-arrow-down").prop("disabled", true);
        $(".fa-arrow-down").addClass("arrows-control");
        $(".fa-arrow-up").prop("disabled", true);
        $(".fa-arrow-up").addClass("arrows-control");


        if (this.state.power = "Off") {
            clearInterval(this.loop);
            this.setState({
                power: "On",
                loopedDesiredTime: this.state.requiredDate,
                loopedDesiredBreakMinutes: this.state.requiredBreakDate,
                pauseClass: "disabled"
            });
        }
    }

    handleRefresh = () => {

        $(".on-play").prop("disabled", false);
        $(".disable-on-play").addClass("cursor-play")
        $(".cursor-play").removeClass("disable-on-play");
        $(".fa-pause").addClass("pause-cursor");
        $(".fa-pause").removeClass("pause-enabled");
        $(".fa-arrow-down").prop("disabled", false);
        $(".fa-arrow-down").removeClass("arrows-control");
        $(".fa-arrow-up").prop("disabled", false);
        $(".fa-arrow-up").removeClass("arrows-control");

        this.setState({
            addedMinutes: undefined,
            minutes: 25,
            seconds: "00",
            break: "05",
            breakLocked: 5,
            session: 25,
            sessionLocked: 25,
            label: "Session",
            power: "On",
            desiredMinutes: 25,
            loopedDesiredTime: 0,
            desiredBreakMinutes: 5,
            loopedDesiredBreakMinutes: 0,
            requiredDate: 0,
            requiredBreakDate: 0,
            startBreakHandle: 60,
            loopBreakHandle: 0,
            startSessionHandle: 60,
            loopSessionHandle: 0,
            pauseClass: "disabled"
        });
        clearInterval(this.loop)
    }

    componentWillUnmount() {
        clearInterval(this.loop)
    }

    render() {

        if (this.state.pauseClass == "disabled") {
            $("document").ready(() => {
                $(".fa-pause").prop("disabled", true)
            })
        }

        if (this.state.minutes < 1) {
            $("#time-left").css("color", "#C32148");
        } else {
            $("#time-left").css("color", "white");
        }
        return (
            <div>
                <h1 class="text-center">
                    Count-down clock
                </h1>
                <div class="d-flex flex-md-row justify-content-between flex-column">
                    <div class="d-flex flex-column align-items-center">
                        <div id="break-label">
                            Break Length
                        </div>
                        <div class="duration">
                            <button class="fas fa-arrow-down" id="break-decrement" onClick={this.handleBreakDec}></button> <span id="break-length">{this.state.break}</span> <button class="fas fa-arrow-up" id="break-increment" onClick={this.handleBreakInc}></button>
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <div id="session-label">
                            Session Length
                        </div>
                        <div class="duration" >
                            <button class="fas fa-arrow-down" id="session-decrement" onClick={this.handleSessionDec}></button> <span id="session-length">{this.state.session}</span> <button class="fas fa-arrow-up" id="session-increment" onClick={this.handleSessionInc}></button>
                        </div>
                    </div>
                </div>
                <div class="p-3 my-3 col-6 offset-3 text-center" id="counter-pad">
                    <div id="timer-label">
                        {this.state.label}
                    </div>
                    <div id="time-left">
                        {this.state.minutes}: {this.state.seconds}
                    </div>
                </div>
                <div class="text-center d-flex justify-content-center gap-4" id="control-panel">
                    <audio ref={this.audio} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
                    <button id="start_stop" class="fas fa-play cursor-play on-play" onClick={this.handleStart}></button>
                    <button id="start_stop" class="fas fa-pause pause-cursor" onClick={this.handlePause}></button>
                    <button class="fas fa-sync-alt" id="always-clickable" onClick={this.handleRefresh}></button>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("countdown-machine"))