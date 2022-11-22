import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
// import { FormattedMessage } from 'react-intl';
import { handleLoginApi, handleGoogleLoginApi } from '../../services/userService';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { gapi } from 'gapi-script';
import { googleKeys } from '../../utils/keys';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }

    clientId = '33837392563-1pujuhbnqf9enc95nb7hotlg9qhr81jj.apps.googleusercontent.com'

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value,
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: '',
        })

        try {
            let data = await handleLoginApi(this.state.username, this.state.password);

            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            };
            if (data && data.errCode === 0) {
                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(data));
                    this.props.userLoginSuccess(data.user);
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

    gapiInit() {
        const initClient = () => {
            gapi.client.init({
                clientId: this.clientId,
                scope: ''
            });
        };
        gapi.load('client:auth2', initClient);
    }

    successGoogle = async (response) => {
        this.gapiInit();

        this.setState({
            errMessage: '',
        })

        try {
            let data = await handleGoogleLoginApi(response);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            };
            if (data && data.errCode === 0) {
                if (data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(data));
                    this.props.userLoginSuccess(data.user);
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
    }

    failGoogle = (response) => {
        console.log(response);
    }

    render() {
        // JSX
        return (
            <div>
                <HomeHeader />
                <div className='login-background'>
                    <div className='login-container'>
                        <div className='login-content row'>
                            <div className='col-12 text-login'>Login</div>
                            <div className='col-12 form-group login-input'>
                                <label>Email:</label>
                                <input type='text'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    value={this.state.username}
                                    onChange={(event) => this.handleOnChangeUsername(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />
                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Password:</label>
                                <div className='custom-input-password'>
                                    <input type={this.state.isShowPassword ? 'text' : 'password'}
                                        className='form-control'
                                        placeholder='Enter your password'
                                        onChange={(event) => this.handleOnChangePassword(event)}
                                        onKeyDown={(event) => this.handleKeyDown(event)} />
                                    <span onClick={() => { this.handleShowHidePassword() }}>
                                        <i className={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                    </span>
                                </div>
                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className='col-12'>
                                <button className='btn-login' onClick={() => { this.handleLogin() }}>Login</button>
                            </div>
                            <div className='col-12'>
                                <a href="/recover-password" className='forgot-password'>Forgot your password?</a>
                            </div>
                            <span className='text-center'>Or Login with:</span>
                            <div className='col-12 social-login'>

                                <div className='google-custom'>
                                    <GoogleLogin
                                        clientId={this.clientId}
                                        buttonText="Login with Google"
                                        onSuccess={this.successGoogle}
                                        onFailure={this.failGoogle}
                                        cookiePolicy={'single_host_origin'}
                                        isSignedIn={false}
                                    />
                                </div>
                            </div>
                            <div className='col-12 social-login'>
                                <div>
                                    <FacebookLogin
                                        appId=""
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        callback={this.responseFacebook}
                                        cssClass="facebook-custom"
                                        icon="fa-facebook"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
