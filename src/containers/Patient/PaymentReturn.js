import React, { Component } from 'react';
import './PaymentReturn.scss';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';
import { handlePaymentReturn } from '../../services/userService';
import { toast } from 'react-toastify';

class PaymentReturn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
        }
    }

    async componentDidMount() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const query = Object.fromEntries(urlSearchParams.entries());
        this.setState({
            query: query,
        })
        let paymentReturn = await handlePaymentReturn(query);
        if (paymentReturn && paymentReturn.errCode === 0) {
            toast.success("Đã xác nhận thanh toán thành công");
        } else {
            toast.error("Xác nhận thánh toán chưa thành công");
        }
    }

    componentWillUnmount() {

    }

    render() {
        const { lang } = this.props;
        let { query } = this.state;

        return (
            <>
                <HomeHeader />
                {query &&
                    <div className="form-container">
                        <div className="form-title">
                            <h1>Thanh toán thành công</h1>
                            <i class="far fa-check-circle check"></i>
                        </div>
                        <div className='form-content'>
                            <h5 className="content-title">Số tiền:</h5>
                            <h5 className='content-value'>{query.vnp_Amount}</h5>
                        </div>
                        <div className='form-content'>
                            <h5 className="content-title">Mã ngân hàng:</h5>
                            <h5 className='content-value'>{query.vnp_BankCode}</h5>
                        </div>
                        <div className='form-content'>
                            <h5 className="content-title">Loại thẻ:</h5>
                            <h5 className='content-value'>{query.vnp_CardType}</h5>
                        </div>
                        <div className='form-content'>
                            <h5 className="content-title">Nội dung:</h5>
                            <h5 className='content-value'>{query.vnp_OrderInfo}</h5>
                        </div>
                        <div className='form-content'>
                            <h5 className="content-title">Mã giao dịch:</h5>
                            <h5 className='content-value'>{query.vnp_TransactionNo}</h5>
                        </div>
                        <a className='btn btn-warning' href='/'>Quay lại trang chủ</a>
                    </div>
                }
                <HomeFooter />
            </>

        )
    }
}

export default PaymentReturn;
