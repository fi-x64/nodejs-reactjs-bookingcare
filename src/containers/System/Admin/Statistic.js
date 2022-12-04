import { useState, useEffect, useRef } from "react";
import "./Statistic.scss";
import BarChart from "../../../components/Charts/BarChart";
import LineChart from "../../../components/Charts/LineChart";
import PieChart from "../../../components/Charts/PieChart";
import { UserData } from "./Data";

function Statistic({ statisticWeek, statisticPatientAddress, statisticCheckoutSuccess }) {

    return (
        <>
            <h2 className="title">TRANG THỐNG KÊ</h2>
            <div className="Statistic">
                <div style={{ width: 700 }}>
                    <h3 className="mt-5">Thống kê theo số lượng đặt lịch khám theo tuần</h3>

                    <BarChart chartData={statisticWeek} />
                </div>
                <div style={{ width: 700 }}>
                    <h3 className="mt-5">Thống kê theo địa chỉ của bệnh nhân</h3>
                    <LineChart chartData={statisticPatientAddress} />
                </div>
                <div style={{ width: 500 }}>
                    <h3 className="mt-5">Thống kê theo đơn đã khám và thanh toán thành công trong tuần</h3>
                    <PieChart chartData={statisticCheckoutSuccess} />
                </div>
            </div>
        </>
    );
}

export default Statistic;