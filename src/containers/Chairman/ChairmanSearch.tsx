import './../../assets/styles/styles.css';

import { useCallback, useEffect, useState, useRef } from 'react';
import { finalService } from "../../lib/api/final";
import moment from "moment";
import { additionalService } from "../../lib/api/additional";
import Table from "../../components/Table";
import { goodstandingService } from "../../lib/api/goodstanding";
import { provisionalService } from "../../lib/api/provisional";
import { nocService } from "../../lib/api/noc";
import { renewalService } from "../../lib/api/renewals";
import Swal from "sweetalert2";

const ChairmanSearch = () => {
    const fetchIdRef = useRef(0);
    const [finals, setFinals] = useState([]);
    const [loading, setLoading] = useState(false)
    const [reqType, setReqType] = useState('select');
    const [mobileNo, setMobileNo] = useState('');
    const [docName, setdocName] = useState('');
    const [pageCount, setPageCount] = useState(0);
    useEffect(() => {
    }, []);
    const getDoctorDetailsByMobile = async () => {
        try {
            const fetchId = ++fetchIdRef.current
            const pageSize = 10;
            const pageIndex = 0
            let result = [];
            if (reqType === "select") {
                Swal.fire({
                    text: "Please select Registration  Type",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return false;
            } 

            if (mobileNo.length === 10) {
                const formData = new FormData();
                formData.append("mobileNo", mobileNo);
                formData.append("docName", "");
               if (reqType === "pmr") {
                    const { data: responseData } = await provisionalService.getProvisionalsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "fmr") {

                    const { data: responseData } = await finalService.getFinalsByMobileNo(formData);
                    result = responseData;

                } else if (reqType === "aqr") {

                    const { data: responseData } = await additionalService.getAddlQualifByMobileNo(formData);
                    result = responseData;

                } else if (reqType === "frr") {
                    const { data: responseData } = await renewalService.getRenewalsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "noc") {
                    const { data: responseData } = await nocService.getNocsByMobileNo(formData);
                    result = responseData;

                } else if (reqType === "gs") {
                    const { data: responseData } = await goodstandingService.getGoodStandingByMobileNo(formData);
                    result = responseData;

                }
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if (result !== undefined && result.length>0) {
                        setFinals(result.slice(startRow, endRow))
                        setPageCount(Math.ceil(result.length / pageSize));
                        setLoading(false);
                    } else {
                        setFinals([]);
                        setLoading(false);
                        Swal.fire({
                            text: "No data found for the given criteria",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                    }
                }
            } else {
                Swal.fire({
                    text: "Please  enter 10 digit  Mobile No ",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            }


        } catch (err) {
            console.log('error getDoctorDetailsByMobile', err);
        }
    };

    const getDoctorDetailsBydocName = async () => {
        try {

            const fetchId = ++fetchIdRef.current
            const pageSize = 10;
            const pageIndex = 0
            let result = [];
            if (reqType === "select") {
                Swal.fire({
                    text: "Please select Registration  Type",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return false;
            } 
            if (docName.length > 3) {
                const formData = new FormData();
                formData.append("mobileNo", "");
                formData.append("docName", docName);
                 if (reqType === "pmr") {
                    const { data: responseData } = await provisionalService.getProvisionalsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "fmr") {
                    const { data: responseData } = await finalService.getFinalsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "aqr") {
                    const { data: responseData } = await additionalService.getAddlQualifByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "frr") {
                    const { data: responseData } = await renewalService.getRenewalsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "noc") {
                    const { data: responseData } = await nocService.getNocsByMobileNo(formData);
                    result = responseData;
                } else if (reqType === "gs") {
                    const { data: responseData } = await goodstandingService.getGoodStandingByMobileNo(formData);
                   result = responseData;
                }
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if (result !== undefined && result.length>0) {
                        setFinals(result.slice(startRow, endRow))
                        setPageCount(Math.ceil(result.length / pageSize));
                        setLoading(false);
                    } else {
                        setFinals([]);
                        setLoading(false);
                        Swal.fire({
                            text: "No data found for the given criteria",
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                    }
                }
            } else {
                Swal.fire({
                    text: "Please enter at least 4 characters of  doctor Name",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            console.log('error getDoctorDetailsByMobile ', err);
        }
    };

    const columns = [
        {
            Header: "Doctor Id",
            accessor: "doctor_id"
        },
        {
            Header: "Doctor Name",
            accessor: "fullname"
        },
        {
            Header: "Mobile No",
            accessor: "mobileno"
        },
        {
            Header: "Country",
            accessor: "countryName"
        },
        {
            Header: "PMR Reg No.",
            accessor: "pmr_no",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        <span>TSMC/PMR/</span>{value}
                    </>
                );
            }
        },
        {
            Header: "FMR Reg No.",
            accessor: "fmr_no",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        <span>TSMC/FMR/</span>{value}
                    </>
                );
            }
        },
        {
            Header: "RequstType",
            accessor: "extra_col1",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        {value !== 'tat' ? "Normal" : "Tatkal"}
                    </>
                );
            }
        },
        {
            Header: "Reg Date",
            accessor: "regDate",
            Cell: ({ cell: { value } }: any) => {
                var temp = moment(value).format('DD-MM-YYYY');
                return (
                    <>
                        <span>{temp}</span>
                    </>
                );
            }
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        {value === 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                        {value === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                        {value === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                        {value === 'rej' && <span className="alert alert-danger rounded-pill py-0 px-2 fs-12">Rejected</span>}
                    </>
                );
            }
        },

        {
            Header: "Assigned ",
            Cell: (cell: any) => (
                <>
                    {cell.data[Number(cell.row.id)].assignedUserName === null && cell.data[Number(cell.row.id)].status === 'pen' ?
                        "Not yet Assigned" : cell.data[Number(cell.row.id)].assignedUserName}
                </>
            )
        }
    ];

    const fetchData = useCallback(async ({ pageSize, pageIndex }: any) => { }, []);

    return (
        <>
            <div className="tsmc-filter-box d-flex align-items-center">
                <div className="row">
                    <div className="col-12">
                        <div className="input-group-text p-0">
                            <label>Registration Type<small className="text-danger">*</small> </label>
                            <select
                                value={reqType}
                                onChange={(ev) => {
                                    setReqType(ev.target.value);
                                }}
                                className="form-select"
                                required={true}
                            >
                                <option value="select">Select</option>
                                <option value="pmr">PMR</option>
                                <option value="fmr">FMR</option>
                                <option value="aqr">Additional</option>
                                <option value="frr">Renewal</option>
                                <option value="noc">Noc</option>
                                <option value="gs">Good Standing</option>

                            </select>

                            <div className="input-group-text p-0">
                                <label htmlFor="" className='mb-2'>Mobile No : </label>
                                <input type="text" className='fs-14' id="mobileNo" onBlur={(e) => setMobileNo(e.target.value)} placeholder='Enter Mobile No' />
                                <button type="submit"
                                    onClick={
                                        getDoctorDetailsByMobile
                                    } className='btn bi-search btn-outline-success'> </button>

                                <label htmlFor="" className='mb-2'>Doctor Name  : </label>
                                <input type="text" className='fs-14' id="name" onBlur={(e) => setdocName(e.target.value)} placeholder='Enter Name' />
                                <button type="submit"
                                    onClick={
                                        getDoctorDetailsBydocName
                                    } className='btn bi-search btn-outline-success'> </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <Table
                            columns={columns}
                            data={finals}
                            loading={loading}
                            pageCount={pageCount}
                            fetchData={fetchData}
                        />
                    </div>
                </div>
            </div>







        </>
    )
}

export default ChairmanSearch;
