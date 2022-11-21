import React, { Component } from 'react';
import { connect } from "react-redux";
import './ListAllDoctor.scss'
import { LANGUAGES } from '../../../utils'
import { withRouter } from "react-router"
import { getAllDoctorsService } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import ReactPaginate from 'react-paginate';

class ListAllDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDoctor: '',
        }
    }

    async componentDidMount() {

        let res = await getAllDoctorsService();

        if (res && res.errCode == 0) {
            this.setState({
                allDoctor: res.data,
                itemOffset: 0
            })
        } else {

        }
        console.log('Check res: ', res);
    }

    componentDidUpdate(prevProps, nextState, snapshot) {

    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }

    Items = ({ currentItems }) => {
        let { language } = this.props;

        return (
            <>
                <div className="row">
                    <div className='title'>Tất cả bác sĩ</div>
                    {currentItems.length > 0 && currentItems.map((item, index) => {
                        let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                        let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                        return (
                            <div className="col-4">
                                <div className='section-customize clinic-child'
                                    key={index}
                                    onClick={() => this.handleViewDetailDoctor(item)}
                                >

                                    <div className='bg-image-list section-medical-facility'
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />

                                    <div className='clinic-name-list'>
                                        <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                        {item.name}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    }

    PaginatedItems = ({ itemsPerPage }) => {
        // Here we use item offsets; we could also use page offsets
        // following the API or data you're working with.

        let { itemOffset, allDoctor } = this.state;
        // Simulate fetching items from another resources.
        // (This could be items from props; or items loaded in a local state
        // from an API endpoint with useEffect and useState)
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        const currentItems = allDoctor.slice(itemOffset, endOffset);
        const pageCount = Math.ceil(allDoctor.length / itemsPerPage);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % allDoctor.length;
            console.log(
                `User requested page number ${event.selected}, which is offset ${newOffset}`
            );
            this.setState({
                itemOffset: newOffset
            })
        };
        return (
            <>
                <this.Items currentItems={currentItems} />
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< Previous"
                    renderOnZeroPageCount={null}
                    className="pagination"
                />
            </>
        );
    }

    render() {
        return (
            <>
                <HomeHeader />
                <this.PaginatedItems itemsPerPage={6} />
                <HomeFooter />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListAllDoctor));
