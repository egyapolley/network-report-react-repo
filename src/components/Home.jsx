import './Home.css'
import {useState} from 'react'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

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

const pgw_counters = [{path: 'AttPaging_FirstAttempt', label: 'VS_paging_all_req_1stTry'},
    {path: 'NbrSuccessTAU', label: 'VS_UE_TAU_all_succ'},
    {path: 'TauInterMmeSucc', label: 'VS_UE_TAU_IrMME_all_succ'},
    {path: 'AttTAU', label: 'VS_UE_TAU_all_req'},
    {path: 'TauInterMmeAtt', label: 'VS_UE_TAU_IrMME_all_req'}]


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

function Home(props) {

    const [node, setNode] = useState("mme");
    const reportOptions = node === "pgw" ? pgw_counters : mme_counters;
    const [reportCounter, setReportCounter] = useState(reportOptions[0]);
    const [period, setPeriod] = useState("daily")


    return (
        <div className="main-container">
            <div className="form-container">
                <form action="">
                    <div className="form-group">
                        <label htmlFor="node">Select Network Element:</label>
                        <select name="node" id="node" value={node} onChange={event => setNode(event.target.value)}
                                required>
                            <option value="mme">MME</option>
                            <option value="pgw">S-PGW</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reportCounter">Select Report Counter:</label>
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
                                {period_one.map((item, index) => <li key={index}><label><input
                                    type="radio" name="period"
                                    checked={item.path === period}
                                    onChange={event => setPeriod(event.target.value)}
                                    required
                                    value={item.path}/>&nbsp;{item.label}
                                </label></li>)}

                            </ul>
                            <ul className="periodicity-group">
                                {period_two.map((item, index) => <li key={index}>
                                    <label>{String.fromCharCode(item.label)}&nbsp;Hour<input
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
                            <Datetime/>
                        </div>
                    </div>
                    <div className="form-date">
                        <span className="label">End Date:</span>
                        <div className="date-wrapper">
                            <Datetime/>
                        </div>
                    </div>

                    <div className="form-button">

                    </div>

                </form>
            </div>
            <div className="content-container">
                <div className="chart-container">

                </div>
                <div className="table-container">
                    <table>
                        <thead>

                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Home;



