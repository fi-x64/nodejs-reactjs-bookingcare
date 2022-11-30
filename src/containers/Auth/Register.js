import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Register.scss';
// import { FormattedMessage } from 'react-intl';
import { handleRegisterApi } from '../../services/userService';
import { toast } from "react-toastify";
import HomeFooter from '../HomePage/HomeFooter';
import HomeHeader from '../HomePage/HomeHeader';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            firstName: '',
            lastName: '',
            errMessage: ''
        }
    }

    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    redirectToLoginPage = () => {
        const { navigate } = this.props;
        const redirectPath = '/login';
        navigate(`${redirectPath}`);
    }

    handleRegister = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handleRegisterApi(this.state);

            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            };
            console.log('Check data: ', data);
            if (data && data.errCode === 0) {
                toast.success("Tạo tài khoản thành công. Vui lòng đăng nhập với tài khoản vừa tạo");
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
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            this.handleRegister();
        }
    }

    render() {
        // JSX
        return (
            <div>
                <HomeHeader />
                <div className='login-background'>
                    <div className='login-container'>
                        <div className='login-content row'>
                            <div className='col-12 text-login'>Register</div>
                            <div className='col-12 form-group login-input'>
                                <label>Email:</label>
                                <input type='email'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    required
                                    value={this.state.email}
                                    onChange={(event) => { this.handleOnChangeInput(event, "email") }}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />
                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Password:</label>
                                <input type='password'
                                    className='form-control'
                                    required
                                    placeholder='Enter your password'
                                    onChange={(event) => { this.handleOnChangeInput(event, "password") }}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />

                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Confirm Password:</label>

                                <input type='password'
                                    className='form-control'
                                    required
                                    placeholder='Enter confirm password'
                                    onChange={(event) => this.handleOnChangeInput(event, 'confirmPassword')}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />

                            </div>
                            <div className='col-6 form-group login-input'>
                                <label>First name:</label>

                                <input type='text'
                                    className='form-control'
                                    required
                                    placeholder='Enter first name'
                                    onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />

                            </div>
                            <div className='col-6 form-group login-input'>
                                <label>Last name:</label>

                                <input type='text'
                                    className='form-control'
                                    required
                                    placeholder='Enter last name'
                                    onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />

                            </div>
                            <div className='col-12 form-group login-input'>
                                <label>Address:</label>

                                <input type='text'
                                    className='form-control'
                                    placeholder='Enter your address'
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    onKeyDown={(event) => this.handleKeyDown(event)} />

                            </div>
                            <div className='col-12' style={{ color: 'red' }}>
                                {this.state.errMessage}
                            </div>
                            <div className='col-12'>
                                <button className='btn-login' onClick={() => { this.handleRegister() }}>Register</button>
                            </div>
                            <span className='text-center'>Or Login with:</span>
                            <div className='col-12'>
                                <div className='col-12 social-login'>
                                    <i className="fab fa-google google"></i>
                                    <i className="fab fa-facebook-f facebook"></i>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);