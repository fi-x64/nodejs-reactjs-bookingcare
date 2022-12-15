import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../utils'
import * as actions from '../../store/actions'
import './UserInfo.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getAllUsers, getAllCodeService, updateUserInfo } from '../../services/userService';
import { toast } from 'react-toastify';
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/HomeFooter';

class UserInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: '',
            genderArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            firstName: '',
            lastName: '',
            address: '',
            phonenumber: '',
            gender: '',
            image: '',
            role: '',
            avatar: '',
            userEditId: '',
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    async componentDidMount() {
        let userInfo = this.props.userInfo;

        if (userInfo) {
            let res = await getAllUsers(userInfo.id);
            let userData = res.users;

            this.props.getGenderStart();
            let resGenders = await getAllCodeService("GENDER");
            let arrGenders = resGenders.data;

            this.setState({
                genderArr: arrGenders,
            })

            let imageBase64 = '';
            if (userData.image) {
                imageBase64 = new Buffer(userData.image, 'base64').toString('binary');
            }

            if (res && res.errCode === 0) {
                this.setState({
                    userEditId: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    address: userData.address,
                    phonenumber: userData.phonenumber,
                    gender: userData.gender,
                    image: userData.image,
                    role: userData.roleId === 'R1' ? 'Admin' : userData.roleId === 'R2' ? 'Doctor' : 'User',
                    previewImgURL: imageBase64,
                    avatar: userData.imageBase64,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.userInfo != prevProps.userInfo) {
            let userInfo = this.props.userInfo;

            if (userInfo) {
                let res = await getAllUsers(userInfo.id);
                let userData = res.users;

                this.props.getGenderStart();
                let resGenders = await getAllCodeService("GENDER");
                let arrGenders = resGenders.data;

                this.setState({
                    genderArr: arrGenders,
                })

                let imageBase64 = '';
                if (userData.image) {
                    imageBase64 = new Buffer(userData.image, 'base64').toString('binary');
                }

                if (res && res.errCode === 0) {
                    this.setState({
                        userEditId: userData.id,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        address: userData.address,
                        phonenumber: userData.phonenumber,
                        gender: userData.gender,
                        image: userData.image,
                        role: userData.roleId === 'R1' ? 'Admin' : userData.roleId === 'R2' ? 'Doctor' : 'User',
                        previewImgURL: imageBase64,
                        avatar: userData.imageBase64,
                    })
                }
            }
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

    handleSaveUser = async () => {
        let isValid = this.checkValidateInput();

        if (isValid === false) return;


        let res = await updateUserInfo({
            id: this.state.userEditId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phonenumber: this.state.phonenumber,
            gender: this.state.gender,
            avatar: this.state.avatar,
        });

        if (res && res.errCode === 0) {
            toast.success("Update user info success");
        } else {
            toast.error("Error update user info");
        }
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'firstName', 'lastName',
            'phonenumber', 'address', 'avatar'];
        for (let i = 0; i < arrCheck.length - 1; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
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

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        let isGetGenders = this.props.isLoadingGender;

        let { email, firstName, lastName,
            phonenumber, address, gender, role, avatar
        } = this.state;

        return (
            <div>
                <HomeHeader />
                <div className='user-redux-container'>
                    <div className='title'>
                        <div className="text-center" >Thông tin cá nhân</div>
                    </div>
                    <div className='user-redux-body'>
                        <div className='container'>
                            <div className="row g-3">
                                <div className="col-12 my-3">{isGetGenders === true ? 'Loading genders' : ''}</div>
                                <div className="col-md-12">
                                    <div className='preview-img-container-info'>
                                        <input type="file" className="form-control show-image"
                                            id="previewImg" hidden
                                            onChange={(event) => this.handleOnChangeImage(event)} />
                                        <div className='preview-img-info'
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={(event) => this.openPreviewImage()} >
                                        </div>
                                        <label className='label-upload-info' htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label"><FormattedMessage id="manage-user.email" /></label>
                                    <input type="email" className="form-control"
                                        value={email}
                                        onChange={(event) => this.onChangeInput(event, 'email')}
                                        disabled={true}
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
                                    <label className="form-label"><FormattedMessage id="manage-user.role" /></label>
                                    <input type="text" className="form-control" placeholder="enter dender id" value={role} readOnly />
                                </div>
                                <div className="col-12 my-3">
                                    <button className="btn btn-warning"
                                        onClick={() => this.handleSaveUser()}>
                                        <FormattedMessage id="manage-user.edit" />
                                    </button>
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
                <HomeFooter />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
