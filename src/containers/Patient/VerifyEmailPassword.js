import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { postVerifyRecoverPassword, handleChangePassword } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmailPassword.scss'
import { push } from "connected-react-router";
import { toast } from 'react-toastify';

class VerifyEmailPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
            password: '',
            confirmPassword: '',
            userId: '',
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let userId = urlParams.get('userId');
            let res = await postVerifyRecoverPassword({
                token: token,
                userId: userId,
            })
            console.log("Check res: ", res);

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                    userId: userId,
                })
                toast.success("Xác thực thành công. Vui lòng tạo mật khẩu mới cho tài khoản");
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }

    handleOnChange = (event, field) => {
        if (field === 'password') {
            this.setState({
                password: event.target.value,
            })
        } else if (field === 'confirmPassword') {
            this.setState({
                confirmPassword: event.target.value,
            })
        }
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handleChangePassword();
        }
    }

    redirectToLoginPage = () => {
        const { navigate } = this.props;
        const redirectPath = '/login';
        navigate(`${redirectPath}`);
    }

    handleChangePassword = async () => {
        let { password, confirmPassword, userId } = this.state;
        this.setState({
            errMessage: '',
        })

        if (password === confirmPassword) {
            try {
                let data = await handleChangePassword({
                    userId: userId,
                    password: password,
                });
                console.log("Check data: ".data);
                if (data && data.errCode !== 0) {
                    this.setState({
                        errMessage: data.message
                    })
                };
                if (data && data.errCode === 0) {
                    toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập tài khoản với mật khẩu mới");
                    this.redirectToLoginPage();
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
            toast.error("Password does not match");
            this.setState({
                errMessage: 'Password does not match',
            })
        }
    }

    render() {
        let { statusVerify, errCode } = this.state;
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div>
                            Loading data...
                        </div>
                        :
                        <div>
                            {
                                errCode === 0 ?
                                    <div className='login-background'>
                                        <div className='login-container'>
                                            <div className='login-content row'>
                                                <div className='col-12 text-login'>Change Password</div>
                                                <div className='col-12 form-group login-input'>
                                                    <label>Nhập mật khẩu mới:</label>
                                                    <input type='password'
                                                        className='form-control'
                                                        placeholder='Enter your new password'
                                                        value={this.state.password}
                                                        onChange={(event) => this.handleOnChange(event, "password")}
                                                        onKeyDown={(event) => this.handleKeyDown(event)} />
                                                </div>
                                                <div className='col-12 form-group login-input'>
                                                    <label>Confirm Password:</label>
                                                    <div className='custom-input-password'>
                                                        <input type='password'
                                                            className='form-control'
                                                            placeholder='Enter confirm password'
                                                            onChange={(event) => this.handleOnChange(event, "confirmPassword")}
                                                            onKeyDown={(event) => this.handleKeyDown(event)} />
                                                    </div>
                                                </div>
                                                <div className='col-12' style={{ color: 'red' }}>
                                                    {this.state.errMessage}
                                                </div>
                                                <div className='col-12'>
                                                    <button className='btn-login' onClick={() => { this.handleChangePassword() }}>Change Password</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div> :
                                    <div className='infor-booking'>Đường link không hợp lệ!</div>
                            }
                        </div>
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailPassword);
