import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './ChangePassword.scss';
// import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { handleChangePassword, processHandleCheckPassword } from '../../services/userService';
import { toast } from 'react-toastify';
import { regexList } from '../../utils/regex';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: '',
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            isShowPassword: false,
            errMessage: '',
            processChangePassword: false,

            errNewPassword: '',
            errConfirmNewPassword: '',
        }
    }

    componentDidMount() {
        this.setState({
            userInfo: this.props.userInfo,
        })
    }

    componentDidUpdate(prevProps, nextState, snapshot) {
        if (this.props.userInfo !== prevProps.userInfo) {
            this.setState({
                userInfo: this.props.userInfo,
            })
        }
    }

    handleOnChangeOldPassword = (event) => {
        if (event.target.value === "") {
            this.setState({
                oldPassword: event.target.value,
                errMessage: 'Mật khẩu cũ không được để trống',
            })
        } else {
            this.setState({
                oldPassword: event.target.value,
                errMessage: '',
            })
        }
    }

    handleOnChangeNewPassword = (event) => {
        if (!regexList["password"].test(event.target.value)) {
            this.setState({
                newPassword: event.target.value,
                errNewPassword: 'Mật khẩu phải ít nhất 8 ký tự, 1 chữ cái in hoa và 1 ký tự đặc biệt'
            })
        } else {
            this.setState({
                newPassword: event.target.value,
                errNewPassword: '',
            })
        }
    }

    handleOnChangeConfirmNewPassword = (event) => {
        this.setState({
            confirmNewPassword: event.target.value,
        })
    }

    handleCheckOldPassword = async () => {
        this.setState({
            errMessage: '',
        })
        if (this.state.oldPassword !== "") {
            try {
                if (this.state.oldPassword !== "") {
                    let data = await processHandleCheckPassword({
                        userId: this.state.userInfo.id,
                        oldPassword: this.state.oldPassword
                    });
                    if (data && data.errCode === 0 && data.check) {
                        this.setState({
                            processChangePassword: true,
                            oldPassword: '',
                            newPassword: '',
                            errMessage: "",
                        })
                    } else {
                        toast.error("Mật khẩu cũ không đúng");
                        this.setState({
                            errMessage: "Mật khẩu cũ không đúng"
                        })
                    }
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.data) {
                        this.setState({
                            errMessage: error.response.data.message
                        })
                    }
                }
            }
        } else {
            this.setState({
                errMessage: "Mật khẩu cũ không được để trống"
            })
        }
    }

    handleChangePassword = async () => {
        this.setState({
            errMessage: '',
        })
        if (!regexList["password"].test(this.state.newPassword)) {
            toast.error("Mật khẩu phải ít nhất 8 ký tự, 1 chữ cái in hoa và 1 ký tự đặc biệt");
            this.setState({
                errNewPassword: "Mật khẩu phải ít nhất 8 ký tự, 1 chữ cái in hoa và 1 ký tự đặc biệt",
            })
        } else if (this.state.newPassword === "") {
            toast.error("Vui lòng nhập đầy đủ các trường");
            this.setState({
                errMessage: "Vui lòng nhập đầy đủ các trường",
            })
        } else if (this.state.newPassword !== this.state.confirmNewPassword) {
            toast.error("Mật khẩu mới không khớp");
            this.setState({
                errMessage: "Mật khẩu mới không khớp",
            })
        } else {
            try {
                let data = await handleChangePassword({
                    userId: this.state.userInfo.id,
                    password: this.state.newPassword
                });
                if (data && data.errCode === 0) {
                    toast.success("Đổi mật khẩu thành công, vui lòng đăng nhập lại với mật khẩu mới");
                    this.setState({
                        processChangePassword: false,
                    })
                } else {
                    toast.error("Đổi mật khẩu không thành công");
                    this.setState({
                        errMessage: data.errMessage
                    })
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.data) {
                        this.setState({
                            errMessage: error.response.data.message
                        })
                    }
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {
        let { processChangePassword } = this.state;
        return (
            <div>
                <HomeHeader />
                {!processChangePassword ?
                    <div className='login-background'>
                        <div className='login-container'>
                            <div className='login-content row'>
                                <div className='col-12 text-login'>ĐỔI MẬT KHẨU</div>
                                <div className='col-12 form-group login-input'>
                                    <label>Nhập mật khẩu cũ:</label>
                                    <div className='custom-input-password'>
                                        <input type={this.state.isShowPassword ? 'text' : 'password'} autoComplete='off'
                                            className='form-control'
                                            placeholder='Enter your old password'
                                            onChange={(event) => this.handleOnChangeOldPassword(event)}
                                            onKeyDown={(event) => this.handleKeyDown(event)} />
                                        <span onClick={() => { this.handleShowHidePassword() }}>
                                            <i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                        </span>
                                    </div>
                                </div>
                                <div className='col-12' style={{ color: 'red' }}>
                                    {this.state.errMessage ? this.state.errMessage : ""}
                                </div>
                                <div className='col-12'>
                                    <button className='btn-login' onClick={() => { this.handleCheckOldPassword() }}>Tiếp theo</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='login-background'>
                        <div className='login-container'>
                            <div className='login-content row'>
                                <div className='col-12 text-login'>TẠO MẬT KHẨU MỚI</div>
                                <div className='col-12 form-group login-input'>
                                    <label>Nhập mật khẩu mới:</label>
                                    <div className='custom-input-password'>
                                        <input type='password' autoComplete='off'
                                            className='form-control'
                                            placeholder='Enter your old password'
                                            onChange={(event) => this.handleOnChangeNewPassword(event)}
                                            onKeyDown={(event) => this.handleKeyDown(event)} />
                                    </div>
                                    <div className='col-12' style={{ color: 'red' }}>
                                        {this.state.errNewPassword}
                                    </div>
                                </div>
                                <div className='col-12 form-group login-input'>
                                    <label>Xác nhận mật khẩu mới:</label>
                                    <div className='custom-input-password'>
                                        <input type='password'
                                            className='form-control'
                                            placeholder='Enter your old password'
                                            onChange={(event) => this.handleOnChangeConfirmNewPassword(event)}
                                            onKeyDown={(event) => this.handleKeyDown(event)} />
                                    </div>
                                </div>
                                <div className='col-12' style={{ color: 'red' }}>
                                    {this.state.errMessage}
                                </div>
                                <div className='col-12'>
                                    <button className='btn-login' onClick={() => { this.handleChangePassword() }}>Đổi mật khẩu</button>
                                </div>
                            </div>
                        </div>
                    </div>}
                <HomeFooter />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
