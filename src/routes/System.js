import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor';
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import StatisticParent from '../containers/System/Admin/Statistic-Parent';
import DashBoard from '../containers/System/DashBoard';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn, userInfo } = this.props;

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        {userInfo.roleId === 'R1' ?
                            <Switch>
                                <Route path="/system/dashboard" component={DashBoard} />
                                <Route path="/system/user-manage" component={UserManage} />
                                <Route path="/system/user-redux" component={UserRedux} />
                                <Route path="/system/manage-doctor" component={ManageDoctor} />
                                <Route path="/system/manage-specialty" component={ManageSpecialty} />
                                <Route path="/system/manage-clinic" component={ManageClinic} />
                                <Route path="/system/statistic" component={StatisticParent} />

                                <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                            </Switch> : userInfo.roleId === "R2" ?
                                <Switch>
                                    <Route path="/system/dashboard" component={DashBoard} />
                                    <Route path="/system/statistic" component={StatisticParent} />
                                </Switch> : <Redirect path="/" />
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

export default connect(mapStateToProps, mapDispatchToProps)(System);
