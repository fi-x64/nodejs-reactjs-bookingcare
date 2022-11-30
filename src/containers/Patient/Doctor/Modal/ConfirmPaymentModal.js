import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { getDoctorPayment } from '../../../../services/userService';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from 'moment';
import LoadingOverlay
    from 'react-loading-overlay';
class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            genders: '',
            selectedPaymentMethod: '',
            paymentMethod: '',
            doctorId: '',
            timeType: '',
            isShowLoading: false
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    async componentDidMount() {
        this.props.getGenders();
        this.props.getPayment();
    }

    async componentDidUpdate(prevProps, nextState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType,
                })
            }
        }

        if (this.props.dataTime.doctorId !== prevProps.dataTime.doctorId) {
            let doctorPayment = await getDoctorPayment(this.props.dataTime.doctorId);
            if (doctorPayment && doctorPayment.errCode === 0) {
                this.setState({
                    paymentMethod: doctorPayment.data.paymentId
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy,
        })
    }

    handleOnChaneDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption })
    }

    handleChangePaymentSelect = (event) => {
        this.setState({ selectedPaymentMethod: event.target.value })
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        let dateTimeVi = moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY');
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date = language === LANGUAGES.VI ? dateTimeVi.charAt(0).toUpperCase() + dateTimeVi.slice(1) :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - DD/MM/YYYY');

            return `${time} - ${date}`
        }
        return <></>
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}` :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;

            return name;
        }
        return ''
    }

    handleConfirmBooking = async () => {
        //validate input
        if (this.state.selectedPaymentMethod === 'cash') {
            this.setState({
                isShowLoading: true
            })
            let date = new Date(this.state.birthday).getTime();
            let timeString = this.buildTimeBooking(this.props.dataTime);
            let doctorName = this.buildDoctorName(this.props.dataTime);

            let res = await postPatientBookAppointment({
                fullName: this.state.fullName,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                address: this.state.address,
                reason: this.state.reason,
                date: this.props.dataTime.date,
                birthday: date,
                selectedGender: this.state.selectedGender.value,
                doctorId: this.state.doctorId,
                timeType: this.state.timeType,
                language: this.props.language,
                timeString: timeString,
                doctorName: doctorName,
            })

            this.setState({
                isShowLoading: true
            })
            if (res && res.errCode === 0) {
                toast.success('Booking a new appointment succeed!');
                this.props.closeBookingModal();
                this.setState({
                    isShowLoading: false
                })
            } else {
                toast.error('Booking a new appointment failed!');
                this.setState({
                    isShowLoading: false
                })
            }
        } else if (this.state.selectedPaymentMethod === 'vnpay' || this.state.selectedPaymentMethod === 'paypal') {

        } else {
            toast.error("Vui lòng chọn tất cả các trường");
        }
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let { paymentMethod } = this.state;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }

        return (
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text="Loading...">

                <Modal isOpen={isOpenModal} className={"booking-modal-container"}
                    size="lg" centered
                    backdrop={true}>
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>
                                <FormattedMessage id="patient.booking-modal.title" />
                            </span>
                            <span className='right'
                                onClick={closeBookingModal}><i className='fas fa-times'></i></span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-info'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                    <input className='form-control'
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')} />
                                </div>
                                <div className='col-12 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                    <DatePicker onChange={this.handleOnChaneDatePicker}
                                        className="form-control"
                                        value={this.state.birthday} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.paymentMethod" /></label>
                                    {paymentMethod && paymentMethod === "PAY1" ? <select class="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="cash">Tiền mặt</option>
                                    </select> : paymentMethod && paymentMethod === "PAY2" ? <select class="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="vnpay">VNPay</option>
                                        <option value="paypal">PayPal</option>

                                    </select> : paymentMethod && paymentMethod === "PAY3" ? <select class="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="cash">Tiền mặt</option>
                                        <option value="vnpay">VNPay</option>
                                        <option value="paypal">PayPal</option>
                                    </select> : <select class="form-select">
                                        <option selected>Không có phương thức thanh toán</option>
                                    </select>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-cancel' onClick={closeBookingModal}><FormattedMessage id="patient.booking-modal.btnCancel" /></button>
                            <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()}><FormattedMessage id="patient.booking-modal.btnConfirm" /></button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay >
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        allPaymentMethod: state.admin.allPaymentMethod,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
        getPayment: () => dispatch(actions.fetchAllPaymentMethod()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
