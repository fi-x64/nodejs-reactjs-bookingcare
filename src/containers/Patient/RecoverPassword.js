import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './RecoverPassword.scss';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { checkEmail } from '../../services/userService'
import { toast } from 'react-toastify';
// import { FormattedMessage } from 'react-intl';
import LoadingOverlay from 'react-loading-overlay';
class RecoverPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            email: '',
            errMessage: '',
            user: '',
            isShowLoading: false,
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        })
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handleProcess();
        }
    }

    handleProcess = async () => {
        this.setState({
            errMessage: '',
        })

        try {
            this.setState({
                isShowLoading: true
            })
            let data = await checkEmail({ email: this.state.email, language: this.props.language });

            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            };
            if (data && data.errCode === 0) {
                if (data.user.token) {
                    toast.success("Email xác thực đã được gửi, vui lòng vào hộp thư của bạn để nhận được link");
                    this.setState({
                        status: true,
                        isShowLoading: false
                    })
                } else {
                    toast.error("Tài khoản này không có token, vui lòng đăng ký lại");
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

    render() {
        // JSX
        let { status } = this.state;
        return (
            <div>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text="Loading...">

                    <HomeHeader />
                    {status ?
                        <div className='notification'>
                            Link xác nhận đã được gủi đến email của bạn
                        </div> : <div className='login-background'>
                            <div className='login-container'>
                                <div className='login-content row'>
                                    <div className='col-12 text-login'>Recover Password</div>
                                    <div className='col-12 form-group login-input'>
                                        <label>Nhập địa chỉ email đã đăng ký tài khoản của bạn:</label>
                                        <input type='text'
                                            className='form-control'
                                            placeholder='Enter your email'
                                            value={this.state.email}
                                            onChange={(event) => this.handleOnChangeEmail(event)}
                                            onKeyDown={(event) => this.handleKeyDown(event)}
                                            required />
                                    </div>
                                    <div className='col-12' style={{ color: 'red' }}>
                                        {this.state.errMessage}
                                    </div>
                                    <div className='col-12'>
                                        <button className='btn-login' onClick={() => { this.handleProcess() }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                </LoadingOverlay >
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

export default connect(mapStateToProps, mapDispatchToProps)(RecoverPassword);
