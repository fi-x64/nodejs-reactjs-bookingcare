import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';
import { toast } from 'react-toastify';
import { regexList } from '../../../utils/regex';
class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: '',
            image: '',
            role: '',
            position: '',
            avatar: '',

            action: '',

            userEditId: '',
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;

            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;

            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                phonenumber: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                image: '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: '',
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();

        if (isValid === false) return;

        let { action } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
            //fire redux action
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editAUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phonenumber: this.state.phonenumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            });
        }

        // this.setState({
        //     action : CRUD_ACTIONS.CREATE
        // })
        this.props.fetchUserRedux();
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName',
            'phonenumber', 'address', 'positionArr', 'roleArr', 'avatar'];
        for (let i = 0; i < arrCheck.length - 1; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.error("Trường " + arrCheck[i] + " bắt buộc phải nhập");
                break;
            } else {
                if (arrCheck[i] === 'email') {
                    if (!regexList['email'].test(this.state[arrCheck[i]])) {
                        isValid = false;
                        toast.error("Email không đúng định dạng");
                        break;
                    }
                }

                if (arrCheck[i] === 'password') {
                    if (!regexList['password'].test(this.state[arrCheck[i]])) {
                        isValid = false;
                        toast.error("Mật khẩu ít nhất 8 ký tự bao gồm ít nhất 1 ký tự viết hoa và 1 ký tự đặc biệt");
                        break;
                    }
                }

                if (arrCheck[i] === 'phonenumber') {
                    if (!regexList['phonenumberVi'].test(this.state[arrCheck[i]])) {
                        isValid = false;
                        toast.error("Số điện thoại không đúng định dạng");
                        break;
                    }
                }
            }
        }

        return isValid;
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };

        copyState[id] = event.target.value;

        this.setState({
            ...copyState
        });
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }

        this.setState({
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phonenumber: user.phonenumber,
            gender: user.gender,
            avatar: '',
            role: user.roleId,
            position: user.positionId,
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        })
    }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;
        let { email, password, firstName, lastName,
            phonenumber, address, position, gender, role, avatar
        } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    <div className="text-center" ><FormattedMessage id="manage-user.crud" /></div>
                </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className="row g-3">
                            <div className="col-12 my-3">{isGetGenders === true ? 'Loading genders' : ''}</div>

                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.email" /></label>
                                <input type="email" className="form-control"
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.password" /></label>
                                <input type="password" className="form-control"
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.first-name" /></label>
                                <input type="text" className="form-control"
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.last-name" /></label>
                                <input type="text" className="form-control"
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.phone-number" /></label>
                                <input type="text" className="form-control"
                                    value={phonenumber}
                                    onChange={(event) => this.onChangeInput(event, 'phonenumber')}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label"><FormattedMessage id="manage-user.address" /></label>
                                <input type="text" className="form-control"
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label"><FormattedMessage id="manage-user.gender" /></label>
                                <select id="inputState" className="form-select" value={gender} onChange={(event) => this.onChangeInput(event, 'gender')} >
                                    {genders && genders.length > 0 && genders.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label className="form-label"><FormattedMessage id="manage-user.position" /></label>
                                <select id="inputState" className="form-select" value={position} onChange={(event) => this.onChangeInput(event, 'position')}>
                                    {positions && positions.length > 0 && positions.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label className="form-label"><FormattedMessage id="manage-user.role" /></label>
                                <select id="inputState" className="form-select" value={role} onChange={(event) => this.onChangeInput(event, 'role')}>
                                    {roles && roles.length > 0 && roles.map((item, index) => {
                                        return (
                                            <option key={index} value={item.keyMap}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label"><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>
                                    <input type="file" className="form-control"
                                        id="previewImg" hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                    <label className='label-upload' htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                                    <div className='preview-img'
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                        onClick={(event) => this.openPreviewImage()} >
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 my-3">
                                <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                    onClick={() => this.handleSaveUser()}>
                                    {this.state.action === CRUD_ACTIONS.EDIT ?
                                        <FormattedMessage id="manage-user.edit" /> :
                                        <FormattedMessage id="manage-user.save" />
                                    }
                                </button>
                            </div>

                            <div className='col-12 mb-5'>
                                <TableManageUser
                                    handleEditUserFromParentKey={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
