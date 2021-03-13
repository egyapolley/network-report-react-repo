import './Home.css'
import {useState} from 'react'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import httpService from "../services/httpService";
import {DATA_URL} from "../config.json"
import {Line} from 'react-chartjs-2';

import _ from 'lodash';
import fileDownload from  'js-file-download'
import {parse} from 'json2csv'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import React from 'react';

const mme_counters = [
    {
        path: 'NbrSuccessAttachRequests',
        label: 'Number Of Success Attach Requests'
    },
    {path: 'AttAttachRequests', label: 'VS_UE_attach_req'},
    {
        path: 'NbrAttachReqAbortBefore',
        label: 'VS_UE_attach_abort_BeforeAttachCmp'
    },
    {
        path: 'NbrAttachReqAbortAfter',
        label: 'VS_UE_attach_abort_AfterAttachCmp'
    },
    {
        path: 'NbrFailedAttachRequests_PLMNnotAllowed',
        label: 'VS_UE_attach_fail_rej_PLMNnotAllowed'
    },
    {
        path: 'NbrFailedAttachRequests_EPSandNonEPSnotAllowed',
        label: 'VS_UE_attach_fail_rej_EPSandNonEPSnotAllowed'
    },
    {
        path: 'NbrFailedAttachRequests_CannotDeriveUEid',
        label: 'VS_UE_attach_fail_rej_UEidCannotBeDerived'
    },
    {
        path: 'NbrFailedAttachRequests_NetworkFailure',
        label: 'VS_UE_attach_fail_rej_NetworkFailure'
    },
    {
        path: 'NbrPageRespInLastSeenTA',
        label: 'VS_paging_all_rsp_ENBinLastTA'
    },
    {
        path: 'NbrPageRespNotInLastSeenTA',
        label: 'VS_paging_all_rsp_ENBNotinLastTA'
    },
    {
        path: 'NbrPagingFailures_Timeout',
        label: 'VS_paging_all_fail_OnMaxRetry'
    },
    {path: 'AttPaging_FirstAttempt', label: 'VS_paging_all_req_1stTry'},
    {path: 'NbrSuccessTAU', label: 'VS_UE_TAU_all_succ'},
    {path: 'TauInterMmeSucc', label: 'VS_UE_TAU_IrMME_all_succ'},
    {path: 'AttTAU', label: 'VS_UE_TAU_all_req'},
    {path: 'TauInterMmeAtt', label: 'VS_UE_TAU_IrMME_all_req'},
    {
        path: 'VS_UE_attach_succ_rate_SFL',
        label: 'VS_UE_attach_succ_rate_SFL'
    },
    {
        path: 'VS_paging_all_rsp_rate_copy_1',
        label: 'VS_paging_all_rsp_rate_copy_1'
    },
    {path: 'VS_paging_all_rsp', label: 'VS_paging_all_rsp'},
    {
        path: 'VS_UE_TAU_IaMME_all_succ_rate',
        label: 'VS_UE_TAU_IaMME_all_succ_rate'
    },
    {
        path: 'VS_UE_TAU_IaMME_all_succ',
        label: 'VS_UE_TAU_IaMME_all_succ'
    },
    {path: 'VS_UE_TAU_IaMME_all_req', label: 'VS_UE_TAU_IaMME_all_req'},
    {path: 'UECapacityUsage', label: 'MAF Capacity'},
    {
        path: 'AveNumOfDefaultBearers',
        label: 'Avg Number_Default_Bearers'
    },
    {
        path: 'MaxNumOfDefaultBearers',
        label: 'Max Number_Default_Bearers'
    },
    {
        path: 'AveNumOfDedicatedBearers',
        label: 'Avg Number_Dedicated_Bearers'
    },
    {
        path: 'MaxNumOfDedicatedBearers',
        label: 'Max Number_Dedicated_Bearers'
    },
    {path: 'AveNbrOfRegisteredUE', label: 'Avg Number_Registered_UEs'},
    {path: 'MaxNbrOfRegisteredUE', label: 'Max Number_Registered_UEs'},
    {path: 'AveNbrOfIdleUE', label: 'Max Number_Idle_UEs'},
    {path: 'MaxNbrOfIdleUE', label: 'Avg Number_Idle_UEs'},
    {path: 'AveConnectedUE', label: 'Max Number_Connected_UEs'},
    {path: 'MaxConnectedUE', label: 'Avg Number_Connected_UEs'}
]

const pgw_counters = [{path: 'test data', label: 'test data'}]


const period_one = [
    {path: "hourly", label: "Hourly"},
    {path: "daily", label: "Daily"},
    {path: "weekly", label: "Weekly"},
    {path: "monthly", label: "Monthly"},
    {path: "yearly", label: "Yearly"},
]

const period_two = [
    {path: "15mins", label: 188},
    {path: "30mins", label: 189},
    {path: "45mins", label: 190},
]

const columnHeading = [
    {path: 'date', label: 'Date/Time'},
    {path: 'value', label: 'Value'}
]

const fields = ['date', 'value'];
const opts = { fields, excelStrings:true };


function Home(props) {

    const [node, setNode] = useState("mme");
    const reportOptions = node === "pgw" ? pgw_counters : mme_counters;

    const [reportCounter, setReportCounter] = useState(reportOptions[0].path);
    const [period, setPeriod] = useState("daily")
    const [startDate, setStartDate] = useState(moment().subtract(2, "days"))
    const [endDate, setEndDate] = useState(moment());
    const [showProgress, setShowProgress] = useState(false)
    const [data, setData] = useState([])
    const [reportName, setReportName] = useState("")
    const [sortColumn, setSortColumn] = useState({path:"date", orderBy:"asc"})

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await doSubmit()
    }

    const doSubmit = async () => {
        const body = {
            node: node,
            reportCounter: reportCounter,
            period: period,
            startDate: startDate.format("YYYY-MM-DD HH:mm:ss"),
            endDate: endDate.format("YYYY-MM-DD HH:mm:ss")
        }

        try {
            setShowProgress(true)
            const {data: response} = await httpService.get(DATA_URL, {params: body});
            setData(response.data)
            setReportName(response.reportName)

        } catch (ex) {
            if (ex.response && ex.response.data) {
                toast.error(ex.response.data)

            } else {
                toast.error(ex.message)

            }

        } finally {
            setShowProgress(false)
        }

    }

    const getTableData = (data) => {
        return _.orderBy(data, [sortColumn.path], sortColumn.orderBy)

    }

    const generateChartData = (data) => {
        const labels = []
        const dataValues = []

        if (data.length > 0) {
            for (const item of data) {
                labels.push(item.date)
                dataValues.push(item.value)

            }
        }
        return {labels: labels, dataSet: dataValues}

    }

    const handleTableSorting = (column) => {
        const s_column = {...sortColumn}
        if (column.path === s_column.path){
            s_column.orderBy = s_column.orderBy==='asc'?"desc":"asc"
        }else {
            s_column.path =column.path
            s_column.orderBy="asc"
        }
        setSortColumn(s_column)
    }

    const generateSortImage =(column) => {
        const {path, orderBy} = sortColumn
        if ( column.path ===path){
            if (orderBy === 'asc'){
                return <i className="fas fa-sort-up sort"/>
            }else {
                return <i className="fas fa-sort-down sort"/>
            }
        }

    }
    const handleLogOut = () => {
        localStorage.clear();
        window.location = "/"
    }

    const handleExport =() =>{
        try {
            const csv = parse(data,opts)
            fileDownload(csv, `${reportName}.csv`)
        } catch (ex) {
            console.log(ex)
            toast.error("Error in Exporting file.Please try again or contact SysAdmin")
        }
    }

    const chartData = {
        labels: generateChartData(data).labels,
        datasets: [
            {
                label: reportName,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'deeppink',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(192,159,75)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'deeppink',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: generateChartData(data).dataSet
            }
        ]
    };

    return (
        <div className="main-container">
            <ToastContainer/>

            <div className="form-container">
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                        <label htmlFor="node" className="form-label">Select Network Element:</label>
                        <select name="node" id="node" value={node} onChange={event => setNode(event.target.value)}
                                required>
                            <option value="mme">MME</option>
                            <option value="pgw">S-PGW</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reportCounter" className="form-label">Select Report Counter:</label>
                        <select name="reportCounter" id="reportCounter" value={reportCounter}
                                onChange={event => setReportCounter(event.target.value)}>
                            {reportOptions.map((item, index) => <option key={index}
                                                                        value={item.path}>{item.label}</option>)}
                        </select>
                    </div>
                    <div className="form-period">
                        <span className="label">Periodicity:</span>
                        <div className="period-group-container">
                            <ul className="periodicity-group">
                                {period_one.map((item, index) => <li key={index}><label className="form-label"><input
                                    type="radio" name="period"
                                    checked={item.path === period}
                                    onChange={event => setPeriod(event.target.value)}
                                    required
                                    value={item.path}/>&nbsp;{item.label}
                                </label></li>)}

                            </ul>
                            <ul className="periodicity-group">
                                {period_two.map((item, index) => <li key={index}>
                                    <label className="form-label">{String.fromCharCode(item.label)} Hour&nbsp;<input
                                        type="radio" name="period" value={item.path}
                                        checked={item.path === period}
                                        onChange={event => setPeriod(event.target.value)}
                                        required/></label></li>)}

                            </ul>
                        </div>
                    </div>
                    <div className="form-date">
                        <span className="label">Start Date:</span>
                        <div className="date-wrapper">
                            <Datetime value={startDate} onChange={date => setStartDate(date)} dateFormat="DD-MM-YYYY"/>
                        </div>
                    </div>
                    <div className="form-date">
                        <span className="label">End Date:</span>
                        <div className="date-wrapper">
                            <Datetime value={endDate} onChange={date => setEndDate(date)} dateFormat="DD-MM-YYYY"/>
                        </div>
                    </div>
                    {showProgress && <div className="progressIndicator">
                        <img src="/images/ajax-loader.gif" alt="Processing"/>
                    </div>}

                    <div className="form-button">
                        <button className="btn btn-submit">Submit</button>
                    </div>

                </form>
            </div>
            <div className="logout-container">
                <button onClick={handleLogOut} className="logout-btn"><i
                    className="fa fa-power-off"/>&nbsp;LogOut
                </button>
            </div>
            {data.length > 0 && <div className="content-container">
                <div className="chart-container">
                    <Line data={chartData}/>

                </div>
                <div className="table-container">
                    <button className="export-btn" onClick={handleExport}>Export&nbsp;<i className="far fa-file-excel"/></button>
                    <table>
                        <thead>
                        <tr>
                            {columnHeading.map((column) => <th key={column.path} onClick={()=>handleTableSorting(column)}>{column.label}{generateSortImage(column)}</th>)}
                        </tr>

                        </thead>
                        <tbody>
                        {getTableData(data).map((row, index) => <tr key={index}>
                            <td>{row.date}</td>
                            <td>{row.value}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>}

        </div>
    );
}

export default Home;



