import React, { Component } from 'react';
import { connect } from "react-redux";
import './ListAllSpecialty.scss'
import { LANGUAGES } from '../../../utils'
import { withRouter } from "react-router"
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import ReactPaginate from 'react-paginate';

class ListAllSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSpecialty: '',
        }
    }

    async componentDidMount() {

        let res = await getAllSpecialty();

        if (res && res.errCode == 0) {
            this.setState({
                allSpecialty: res.data,
                itemOffset: 0
            })
        } else {

        }
    }

    componentDidUpdate(prevProps, nextState, snapshot) {

    }

    handleViewDetailSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`)
        }
    }

    Items = ({ currentItems }) => {
        return (
            <>
                <div className="row">
                    <div className='title'>Tất cả chuyên khoa</div>
                    {currentItems.length > 0 && currentItems.map((item, index) => {
                        return (
                            <div className="col-4">
                                <div className='section-customize clinic-child'
                                    key={index}
                                    onClick={() => this.handleViewDetailSpecialty(item)}
                                >
                                    <div className='bg-image section-medical-facility'
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    <div className='clinic-name'>
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

        let { itemOffset, allClinic } = this.state;
        // Simulate fetching items from another resources.
        // (This could be items from props; or items loaded in a local state
        // from an API endpoint with useEffect and useState)
        const endOffset = itemOffset + itemsPerPage;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        const currentItems = allClinic.slice(itemOffset, endOffset);
        const pageCount = Math.ceil(allClinic.length / itemsPerPage);

        // Invoke when user click to request another page.
        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % allClinic.length;
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
                <this.PaginatedItems itemsPerPage={3} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListAllSpecialty));
