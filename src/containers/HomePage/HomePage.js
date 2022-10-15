import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';

import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HandBook from './Section/HandBook';

class HomePage extends Component {

    render() {
        let settings = {
            arrows: true,
            autoplay: false,
            autoplaySpeed: 4500,
            infinite: true,
            pauseOnFocus: false,
            pauseOnHover: false,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        return (
        <div>
           <HomeHeader />
           <Specialty settings = {settings}/>
           <MedicalFacility settings = {settings}/>
           <OutStandingDoctor settings = {settings}/>
           <HandBook settings = {settings}/>
        </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
