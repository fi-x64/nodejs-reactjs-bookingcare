import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import './DropdownComponent.scss';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { gapi } from 'gapi-script';
import { googleKeys } from '../../utils/keys';

class DropdownComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleDropdown = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({
                isOpen: false
            });
        }
    }

    render() {
        const { userInfo, processLogout } = this.props;
        let { isOpen } = this.state;

        return (
            <div className="dropdown-custom" onClick={this.handleDropdown} ref={this.wrapperRef}>
                <a className="btn btn-warning dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <FormattedMessage id="homeheader.welcome" />, {userInfo && userInfo.firstName ? userInfo.firstName : ''}
                </a>

                {isOpen ? <div className="dropdown-list" aria-labelledby="dropdownMenuLink">
                    <a className="dropdown-item" href="/user-info">Thông tin tài khoản</a>
                    <a className="dropdown-item" href="/booking-user-list" hidden={userInfo.roleId === 'R1' || userInfo.roleId === 'R2' ? true : false}>Lịch khám đã đặt</a>
                    <a className="dropdown-item" href="/change-password">Đổi mật khẩu</a>
                    <a className="dropdown-item" href="#" onClick={processLogout}>Đăng xuất</a>
                    {userInfo.roleId === 'R1' ? <a className="dropdown-item" href="/system/dashboard">Chuyển sang trang Admin</a> : null}
                    {userInfo.roleId === 'R2' ? <a className="dropdown-item" href="/system/dashboard">Chuyển sang trang Quản lý bác sĩ</a> : null}
                </div> : null}

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownComponent);
