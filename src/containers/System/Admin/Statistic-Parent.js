import React, { Component, Fragment } from 'react';
import Statistic from './Statistic';
import { handleStatisticBookingWeek, handleStatisticPatientAddress } from "../../../services/userService";
import moment from 'moment';

class StatisticParent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statisticWeek: '',
            statisticPatientAddress: '',
        }
    }

    async componentDidMount() {
        let res = await handleStatisticBookingWeek();
        let dataStatisticBookingWeek = {
            labels: res.data.map((data) => {
                var t = parseInt(data.date);
                t = new Date(t);
                t = moment(t, "dddd - DD/MM/YYYY").format("dddd - DD/MM/YYYY");
                t = t.charAt(0).toUpperCase() + t.slice(1)
                return t
            }),
            datasets: [
                {
                    label: "Thống kê theo số lượng đặt lịch khám theo tuần",
                    data: res.data.map((data) => data.dateCount),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }
        res = await handleStatisticPatientAddress();
        console.log("Check res: ", res);
        let dataStatisticPatientAddress = {
            labels: res.data.map((data) => {
                if (data.address != null)
                    return data.address
                else return "Undefined address"
            }),
            datasets: [
                {
                    label: "Thống kê theo địa chỉ của bệnh nhân",
                    data: res.data.map((data) => data.addressCount),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0",
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                },
            ],
        }
        this.setState({
            statisticWeek: dataStatisticBookingWeek,
            statisticPatientAddress: dataStatisticPatientAddress
        })
    }

    componentDidUpdate = () => {

    }

    render() {
        return (
            <>
                {this.state.statisticWeek && this.state.statisticPatientAddress && <Statistic
                    statisticWeek={this.state.statisticWeek}
                    statisticPatientAddress={this.state.statisticPatientAddress}
                />}

            </>
        );
    }

}

export default StatisticParent;
