import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss'
import { LANGUAGES } from '../../../utils'
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, nextState, snapshot) {

    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    render() {
        let { isShowDetailInfor } = this.state;
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>ĐỊA CHỈ KHÁM</div>
                    <div className='name-clinic'>Bệnh viện Đa khoa An Việt</div>
                    <div className='detail-address'>Số 1E Trường Chinh - Thanh Xuân - Hà Nội</div>
                </div>
                <div className='content-down'>
                    {isShowDetailInfor === false &&
                        <div className='short-infor'>
                            GIÁ KHÁM: 250.000đ. <span onClick={() => { this.showHideDetailInfor(true) }} >Xem chi tiết</span>
                        </div>
                    }

                    {isShowDetailInfor === true &&
                        <>
                            <div className='title-price'>GIÁ KHÁM:</div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>Giá khám:</span>
                                    <span className='right'> 400.000đ</span>
                                </div>
                                <div>
                                    Được ưu tiên khám trước khi đặt qua BookingCare. Giá khám cho người nước ngoài là 30 USD 400.000đ
                                </div>
                            </div>
                            <div className='payment'>Người bệnh có thể thanh toán chi phí bằng hình thức tiền mặt và quẹt thẻ</div>
                            <div className='hide-price'>
                                <span onClick={() => { this.showHideDetailInfor(false) }}>
                                    Ẩn bảng giá
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
