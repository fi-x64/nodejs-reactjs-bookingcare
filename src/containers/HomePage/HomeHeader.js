import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss'
import logo from '../../assets/logo.svg';
import { FormattedMessage } from 'react-intl';
import InputComponent from '../../hoc/IntlPlaceholder';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from "react-router"
import DropdownComponent from './DropdownComponent';

class HomeHeader extends Component {

    componentDidMount() {
        let { userInfo } = this.props;
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
        // fire redux event : actions
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <img className='header-logo' src={logo} onClick={() => this.returnToHome()} />
                            <div className='header-logo'></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.fee" /></b></div>
                                <div className='sub-title'><FormattedMessage id="homeheader.check-health" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'><i className='fas fa-question-circle'></i> <FormattedMessage id="homeheader.support" /></div>
                            {userInfo ? <DropdownComponent /> :
                                <div className='user-tab'>
                                    <a href="/login" className='sign-in'>Đăng nhập</a>
                                    <div className='division'></div>
                                    <a href="/register" className='sign-up'>Đăng ký</a>
                                </div>
                            }
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}><span onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>VN</span></div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}><span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span> </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1" /></div>
                            <div className='title2'><FormattedMessage id="banner.title2" /></div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <InputComponent></InputComponent>
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i className='far fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child1" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child2" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-stethoscope"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child3" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-flask"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child4" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-user-check"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child5" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-syringe"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child6" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-first-aid"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child7" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-pills"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child8" /></div>
                                </div>


                                <div className='option-child'>
                                    <div className='icon-child'><i className="fas fa-address-card"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child9" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
