import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            this.setState({
                roleArr: this.props.roleRedux
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            this.setState({
                positionArr: this.props.positionRedux
            })
        }
    }

    handleOnChangeImage = (event) => {
        let file = event.target.files[0];
        console.log(file);

        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl
            })
        }
    }

    openPreviewImage = () => {
        if(!this.state.previewImgURL) return ;
        this.setState({
            isOpen: true
    })
}

render() {
    let genders = this.state.genderArr;
    let roles = this.state.roleArr;
    let positions = this.state.positionArr;
    let language = this.props.language;
    let isGetGenders = this.props.isLoadingGender;

    console.log('Check state component: ', this.state);
    return (
        <div className='user-redux-container'>
            <div className='title'>
                <div className="text-center" >User Redux</div>
            </div>
            <div className='user-redux-body'>
                <div className='container'>
                    <form className="row g-3">
                        <div className="col-12 my-3"><FormattedMessage id="manage-user.add" /></div>
                        <div className="col-12 my-3">{isGetGenders === true ? 'Loading genders' : ''}</div>

                        <div className="col-md-6">
                            <label htmlFor="inputEmail4" className="form-label"><FormattedMessage id="manage-user.email" /></label>
                            <input type="email" className="form-control" id="inputEmail4" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword4" className="form-label"><FormattedMessage id="manage-user.password" /></label>
                            <input type="password" className="form-control" id="inputPassword4" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword4" className="form-label"><FormattedMessage id="manage-user.first-name" /></label>
                            <input type="text" className="form-control" id="inputPassword4" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="inputPassword4" className="form-label"><FormattedMessage id="manage-user.last-name" /></label>
                            <input type="text" className="form-control" id="inputPassword4" />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="inputState" className="form-label"><FormattedMessage id="manage-user.role" /></label>
                            <select id="inputState" className="form-select">
                                {genders && genders.length > 0 && genders.map((item, index) => {
                                    return (
                                        <option key={index}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-3">
                            <label htmlFor="inputAddress" className="form-label"><FormattedMessage id="manage-user.position" /></label>
                            <select id="inputState" className="form-select">
                                {positions && positions.length > 0 && positions.map((item, index) => {
                                    return (
                                        <option key={index}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-3">
                            <label htmlFor="inputAddress2" className="form-label"><FormattedMessage id="manage-user.role" /></label>
                            <select id="inputState" className="form-select">
                                {roles && roles.length > 0 && roles.map((item, index) => {
                                    return (
                                        <option key={index}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="inputCity" className="form-label"><FormattedMessage id="manage-user.image" /></label>
                            <div className='preview-img-container'>
                                <input type="file" className="form-control"
                                    id="previewImg" hidden
                                    onChange={(event) => this.handleOnChangeImage(event)} />
                                <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i className="fas fa-upload"></i></label>
                                <div className='preview-img'
                                    style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                    onClick={() => this.openPreviewImage()} >
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>

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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart())

        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
