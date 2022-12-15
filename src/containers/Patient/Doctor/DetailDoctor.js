import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss'
import { LANGUAGES } from '../../../utils'
import { getDetailInforDoctor, getDetailClinicById } from '../../../services/userService'
import DoctorSchedule from './DoctorSchedule';
import DoctorExtraInfor from './DoctorExtraInfor';
import LikeAndShare from '../SocialPlugin/LikeAndShare';
import Comment from './Comment';

class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
            user: '',
            clinicInfo: '',
        }
    }

    async componentDidMount() {
        let user = localStorage.getItem('user');
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            this.setState({
                currentDoctorId: id,
                user: user
            })

            let res = await getDetailInforDoctor(id);

            if (res && res.errCode == 0) {
                this.setState({
                    detailDoctor: res.data
                })

                if (res.data.Doctor_Infor.clinicId) {
                    let clinicInfo = await getDetailClinicById({
                        id: res.data.Doctor_Infor.clinicId
                    })

                    if (clinicInfo && clinicInfo.errCode == 0) {
                        this.setState({
                            clinicInfo: clinicInfo.data,
                        })
                    }
                }
            }
        }
    }

    componentDidUpdate(prevProps, nextState, snapshot) {

    }

    render() {
        let { language } = this.props;

        let { detailDoctor, clinicInfo } = this.state;
        let nameVi = '', nameEn = '';
        if (detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`
        }
        console.log("Check clinicInfor: ", clinicInfo);
        let currentURL = process.env.REACT_APP_IS_LOCALHOST === 1 ?
            "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href;
        return (
            <>
                <HomeHeader
                    isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left'
                            style={{ backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})` }}>
                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className='down'>{detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.description
                                && <span>
                                    {detailDoctor.Markdown.description}
                                </span>
                            }
                                <div className='like-and-share-plugin'>
                                    <LikeAndShare
                                        dataHref={currentURL}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule
                                doctorIdFromParent={detailDoctor && detailDoctor.id ? detailDoctor.id : -1}
                                clinicInfoFromParent={clinicInfo ? clinicInfo : null}
                            />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfor doctorIdFromParent={detailDoctor && detailDoctor.id ? detailDoctor.id : -1} />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            && <div dangerouslySetInnerHTML={{ __html: detailDoctor.Markdown.contentHTML }}>
                            </div>}
                    </div>
                    <div className='comment-doctor'>
                        <Comment
                            doctorIdFromParent={detailDoctor && detailDoctor.id ? detailDoctor.id : null}
                        />
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
