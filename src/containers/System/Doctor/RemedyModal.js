import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss'
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { CommonUtils, LANGUAGES } from '../../../utils';
import { toast } from "react-toastify";
import moment from 'moment';

class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: ''
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, nextProps) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }

    handleConfirmBooking = async () => {

    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, isOpenRemedyModal, dataModal } = this.props;

        return (
            <div>
                <Modal isOpen={isOpenModal} className={"booking-modal-container"}
                    size="lg" centered
                    backdrop={true}>

                    <div className='modal-header'>
                        <h5 className='modal-title'>Gửi hoá đơn khám bệnh thành công</h5>
                        <button type='button' className='close' aria-label='Close' onClick={this.props.closeRemedyModal}>
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>Email bệnh nhân</label>
                                <input type='email' className='form-control' value={this.state.email}
                                    onChange={(event) => this.handleOnChangeEmail(event)} />
                            </div>
                            <div className='col-6 form-group'>
                                <label>Chọn file đơn thuốc</label>
                                <input className='form-control-file' type='file'
                                    onChange={(event) => this.handleOnChangeImage(event)} />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.handleSendRemedy()}>Send</Button>{' '}
                        <Button color="secondary" onClick={this.props.closeRemedyModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
