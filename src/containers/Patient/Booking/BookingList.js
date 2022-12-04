import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingList.scss';
import { getAllBookingUser } from '../../../services/userService'
import moment, { lang } from 'moment';
import { LANGUAGES } from '../../../utils';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class BookingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            bookingData: [],
        }
    }

    async componentDidMount() {
        this.getBookingData();
    }

    getBookingData = async () => {
        let { user } = this.props;
        this.setState(
            { userInfo: user }
        )

        if (user) {
            let res = await getAllBookingUser(
                user.id
            )

            if (res && res.errCode === 0) {
                this.setState({
                    bookingData: res.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, nextState, snapshot) {
        if (this.props.user != prevProps.user) {
            this.getBookingData();
            this.setState(
                { userInfo: this.props.user }
            )
        }
    }

    render() {
        let { bookingData } = this.state;
        let { language } = this.props;
        return (
            <>
                <HomeHeader />

                <div className='manage-patient-container'>
                    <div className='m-p-title'>
                        Danh sách lịch đã đặt
                    </div>
                    <div className='manage-patient-body row'>
                        <div className='col-12 table-manage-patient'>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian khám</th>
                                        <th>Bác sĩ</th>
                                        <th>Họ tên người đặt</th>
                                        <th>Ngày đặt</th>
                                        <th>Trạng thái đơn</th>
                                        <th>Trạng thái thanh toán</th>
                                        <th>Hình thức thanh toán</th>
                                    </tr>
                                    {bookingData && bookingData.length > 0 ? bookingData.map((item, index) => {
                                        let time = language === LANGUAGES.VI ?
                                            item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;

                                        var t = parseInt(item.date);
                                        t = new Date(t);
                                        t = moment(t, "dddd - DD/MM/YYYY").format("dddd - DD/MM/YYYY");
                                        t = t.charAt(0).toUpperCase() + t.slice(1);

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{time}</td>
                                                <td>{item.doctorBookingData.lastName + " " + item.doctorBookingData.firstName}</td>
                                                <td>{item.patientData.lastName ? item.patientData.lastName : "" + " " + item.patientData.firstName ? item.patientData.firstName : ""}</td>
                                                <td>{t ? t : null}</td>
                                                <td>{item.statusId === "S2" ? 'Chưa khám xong' : item.statusId === "S3" ? 'Đã khám xong' : "Chưa xác nhận"}</td>
                                                <td>{item.Checkout.paymentStatus ? 'Đã thanh toán' : "Chưa thanh toán"}</td>
                                                <td>{item.Checkout.paymentMethod === "cash" ? "Tiền mặt" : item.Checkout.paymentMethod}</td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>No Data</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingList);
