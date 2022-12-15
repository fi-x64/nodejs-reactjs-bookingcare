import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '../containers/Header/Header';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
import ManagePatient from '../containers/System/Doctor/ManagePatient';

class Doctor extends Component {
    render() {
        const { isLoggedIn, userInfo, systemMenuPath } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        {userInfo.roleId === "R1" || userInfo.roleId === "R2" ?
                            <Switch>
                                <Route path="/doctor/manage-schedule" component={ManageSchedule} />
                                <Route path="/doctor/manage-patient" component={ManagePatient} />
                            </Switch> : <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        }

                    </div>
                </ div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
