import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import './Dashboard.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {

    }

    render() {
        return (
            <>
                <div className="dashboard-container">
                    <div className='modal-container'>
                        <div className='modal-icon' style={{ color: '#3E6D9C' }}>
                            <i class="far fa-calendar-alt"></i>
                        </div>
                        <div className='modal-title'>
                            Tổng số lịch đặt trên hệ thống
                        </div>
                        <div className='modal-sum'>
                            5
                        </div>
                        <div className='modal-time-update'>
                            Cập nhật vào 5 phút trước
                        </div>
                    </div>
                    <div className='modal-container'>
                        <div className='modal-icon' style={{ color: '#439A97' }}>
                            <i class="fas fa-hospital-alt"></i>
                        </div>
                        <div className='modal-title'>
                            Tổng số cơ sở khám bệnh
                        </div>
                        <div className='modal-sum'>
                            15
                        </div>
                        <div className='modal-time-update'>
                            Cập nhật vào 5 phút trước
                        </div>
                    </div>
                    <div className='modal-container'>
                        <div className='modal-icon' style={{ color: '#9E7676' }}>
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div className='modal-title'>
                            Lượt truy cập trong ngày
                        </div>
                        <div className='modal-sum'>
                            123
                        </div>
                        <div className='modal-time-update'>
                            Cập nhật vào 5 phút trước
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
