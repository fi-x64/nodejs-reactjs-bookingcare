import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss'
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import { } from '../../../../services/userService';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { getExtraInforDoctorById, postPatientBookAppointment, getDoctorPayment, processPayment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from 'moment';
import Paypal from './PayPalModal';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
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
            isShowLoading: false,
            extraInfor: '',
            selectedBank: '',
            notShowChooseBank: true,
            quantity: '',
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

        let res = await getExtraInforDoctorById(this.props.dataTime.doctorId);
        if (res && res.errCode === 0)
            this.setState({
                extraInfor: res.data,
                quantity: this.props.dataTime.currentNumber ? this.props.dataTime.maxNumber - this.props.dataTime.currentNumber : this.props.dataTime.maxNumber,
            })
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
                let quantity = this.props.dataTime.currentNumber ? this.props.dataTime.maxNumber - this.props.dataTime.currentNumber : this.props.dataTime.maxNumber;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType,
                    quantity: quantity,
                })
            }
        }

        if (this.props.dataTime.doctorId !== prevProps.dataTime.doctorId) {
            let res = await getExtraInforDoctorById(this.props.dataTime.doctorId);
            if (res && res.errCode === 0)
                this.setState({
                    extraInfor: res.data
                })
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
        if (event.target.value === 'vnpay') {
            this.setState({
                notShowChooseBank: false,
                selectedPaymentMethod: event.target.value
            })
        } else {
            this.setState({
                notShowChooseBank: true,
                selectedPaymentMethod: event.target.value
            })
        }
    }

    handleChangeBankSelect = (event) => {
        this.setState({ selectedBank: event.target.value })
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

        this.setState({
            isShowLoading: true
        })
        let date = new Date(this.state.birthday).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);

        var res = await postPatientBookAppointment({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
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
            paymentMethod: this.state.selectedPaymentMethod,
            amount: this.state.extraInfor.priceTypeData.valueVi,
            bankCode: this.state.selectedBank,
        })
        if (res?.dataPayment?.url) {
            window.location.href = res.dataPayment.url;
        }
        this.setState({
            isShowLoading: true
        })
        if (res && res.errCode === 0) {
            toast.success('Booking a new appointment succeed!');

            if (this.state.selectedPaymentMethod === 'paypal') {
                this.render(<Paypal />)

            }
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
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let { extraInfor, quantity } = this.state;
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
                                <h6 className='quantity'>Số lượng đặt khám còn lại: {quantity}</h6>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.firstName" /></label>
                                    <input className='form-control'
                                        value={this.state.firstName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'firstName')} />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.lastName" /></label>
                                    <input className='form-control'
                                        value={this.state.lastName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'lastName')} />
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
                                <div className='col-6 form-group'>
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
                                    {extraInfor.paymentId && extraInfor.paymentId === "PAY1" ? <select className="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="cash">Tiền mặt</option>
                                    </select> : extraInfor.paymentId && extraInfor.paymentId === "PAY2" ? <select className="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="vnpay">VNPay</option>
                                        <option value="paypal">PayPal</option>

                                    </select> : extraInfor.paymentId && extraInfor.paymentId === "PAY3" ? <select className="form-select" onChange={(event) => this.handleChangePaymentSelect(event)} value={this.state.selectedPaymentMethod}>
                                        <option selected>Chọn phương thức thanh toán</option>
                                        <option value="cash">Tiền mặt</option>
                                        <option value="vnpay">VNPay</option>
                                        <option value="paypal">PayPal</option>
                                    </select> : <select className="form-select">
                                        <option selected>Không có phương thức thanh toán</option>
                                    </select>
                                    }
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.booking-modal.amountOfMoney" /></label>
                                    <input className='form-control'
                                        value={extraInfor.priceTypeData?.valueVi ? extraInfor.priceTypeData.valueVi + " VNĐ" : ""}
                                        readOnly />
                                </div>
                                <div className='col-6 form-group' hidden={this.state.notShowChooseBank}>
                                    <label><FormattedMessage id="patient.booking-modal.chooseBank" /></label>
                                    <select className="form-select" onChange={(event) => this.handleChangeBankSelect(event)} value={this.state.selectedBank}>
                                        <option selected>Chọn ngân hàng thanh toán</option>
                                        <option value="NCB"> Ngan hang NCB</option>
                                        <option value="AGRIBANK"> Ngan hang Agribank</option>
                                        <option value="SCB"> Ngan hang SCB</option>
                                        <option value="SACOMBANK">Ngan hang SacomBank</option>
                                        <option value="EXIMBANK"> Ngan hang EximBank</option>
                                        <option value="MSBANK"> Ngan hang MSBANK</option>
                                        <option value="NAMABANK"> Ngan hang NamABank</option>
                                        <option value="VNMART"> Vi dien tu VnMart</option>
                                        <option value="VIETINBANK">Ngan hang Vietinbank</option>
                                        <option value="VIETCOMBANK"> Ngan hang VCB</option>
                                        <option value="HDBANK">Ngan hang HDBank</option>
                                        <option value="DONGABANK"> Ngan hang Dong A</option>
                                        <option value="TPBANK"> Ngân hàng TPBank</option>
                                        <option value="OJB"> Ngân hàng OceanBank</option>
                                        <option value="BIDV"> Ngân hàng BIDV</option>
                                        <option value="TECHCOMBANK"> Ngân hàng Techcombank</option>
                                        <option value="VPBANK"> Ngan hang VPBank</option>
                                        <option value="MBBANK"> Ngan hang MBBank</option>
                                        <option value="ACB"> Ngan hang ACB</option>
                                        <option value="OCB"> Ngan hang OCB</option>
                                        <option value="IVB"> Ngan hang IVB</option>
                                        <option value="VISA"> Thanh toan qua VISA/MASTER</option>
                                    </select>
                                </div>
                            </div>
                            {quantity === 0 ? <h5 className='alert'>Số lượng đặt đã đủ, vui lòng chọn thời gian khác</h5> : null}
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-cancel' onClick={closeBookingModal}><FormattedMessage id="patient.booking-modal.btnCancel" /></button>
                            <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()} disabled={quantity === 0 ? "true" : ""} ><FormattedMessage id="patient.booking-modal.btnConfirm" /></button>
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
