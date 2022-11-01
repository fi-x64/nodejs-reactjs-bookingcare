import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { getProfileDoctorById } from '../../../../services/userService';
import _ from 'lodash';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
        let id = this.props.doctorId;
        if (id) {
            let res = getProfileDoctorById(id);
        }
    }

    async componentDidUpdate(prevProps, nextState, snapshot) {

    }


    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }

        return (
            <div>
                <Modal isOpen={isOpenModal} className={"booking-modal-container"}
                    size="lg" centered
                    backdrop={true}>
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>Thông tin đặt lịch khám bệnh</span>
                            <span className='right'
                                onClick={closeBookingModal}><i className='fas fa-times'></i></span>
                        </div>
                        <div className='booking-modal-body'>
                            {/* {JSON.stringify(dataTime)} */}
                            <div className='doctor-info'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label>Họ tên</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Số điện thoại</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Địa chỉ Email</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Địa chỉ liên hệ</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-12 form-group'>
                                    <label>Lý do khám</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Đặt cho ai</label>
                                    <input className='form-control'></input>
                                </div>
                                <div className='col-6 form-group'>
                                    <label>Giới tính</label>
                                    <input className='form-control'></input>
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-cancel' onClick={closeBookingModal}>Huỷ</button>
                            <button className='btn-booking-confirm' onClick={closeBookingModal}>Xác nhận</button>
                        </div>
                    </div>
                </Modal>
            </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
