import './../../assets/styles/styles.css';

import { useCallback, useEffect, useState } from 'react';
import moment from "moment";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import dispatchservice from "../../lib/api/dispatch";
import DispatchDoctorInfoCard from './dispatch-doctor-info';

const DispatchSearch = () => {
    const [final, setFinal] =  useState([] as any[]);
    const [loading, setLoading] = useState(false)
    const [reqType, setReqType] = useState('select');
    const [fmrNo, setFmrNo] = useState('');
    const [searchType, setsearchType] = useState('fmrno');
    const [pageCount, setPageCount] = useState(0);
    const [showComponent, setShowComponent] = useState(false);
    const [doctorPrimaryId,setDoctorPrimaryId]=useState('');
    const [requestPrimaryId,setRequestPrimaryId]=useState('');
    const [doctorId, setDoctorId] = useState('');
    let default7Days = moment().format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    useEffect(() => {
    }, []);

    const greet=()=> {
        setShowComponent(false);
        fetchData(0);
        setReqType('select');
        setFmrNo('');
        setFromDate(default7Days);
       }
    const toggleComponent = useCallback(async (Id:any,docId:any,docPrimeId:any) => {
        try {
                setDoctorPrimaryId(docPrimeId);
                setDoctorId(docId);
                setRequestPrimaryId(Id);
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, [showComponent]);
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
                        <span>{value}</span>
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
            Header: "Action",
            Cell: (cell: any) => (
                <>
                    <a href="javascript:void(0);" onClick={() => {
                        setShowComponent(true);
                        if(reqType==="fmr"){
                            toggleComponent(cell.data[Number(cell.row.id)].finalPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId,);
                        }else if(reqType==="pmr") 
                        {
                            toggleComponent(cell.data[Number(cell.row.id)].provisionalPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId,);
                         }else if(reqType==="aqr")
                        {
                            toggleComponent(cell.data[Number(cell.row.id)].additionalPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId,);
                        }else if(reqType==="frr")
                            {
                                toggleComponent(cell.data[Number(cell.row.id)].renewalPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId,);
                            }
                            else if(reqType==="noc")
                                {
                                    toggleComponent(cell.data[Number(cell.row.id)].nocPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId,);
                                }
                        else if(reqType==="gs")
                                {
                                    toggleComponent(cell.data[Number(cell.row.id)].gsPrimaryId,cell.data[Number(cell.row.id)].doctor_id,cell.data[Number(cell.row.id)].doctorPrimaryId);
                                }
                    }}>Proceed</a>
                </>
            )
        }


    ];

    const search = useCallback(async () => {
        try {
            setFinal([]);
            if(reqType==='select'){
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "Please Select Request Type",
                    confirmButtonText: "OK",
                });
                return false;
            }
            if(searchType==='select'){
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "Please Select Search Type",
                    confirmButtonText: "OK",
                });
                return false;
            }
            if(fmrNo===''){
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "Please Enter FMR/PMR No",
                    confirmButtonText: "OK",
                });
                return false;
            }
            setLoading(true);
                const { data} = await dispatchservice.getDoctorByFMR(reqType, searchType, fmrNo, fromdate);
                if (data.length > 0) {
                    setFinal(data);
                    setLoading(false);
                }else {
                    setLoading(false);
                Swal.fire({
                    icon:"warning",
                    title: "",
                    text: "No data found for the given criteria",
                    confirmButtonText: "OK",
                });
            }
            
        } catch (err) {
            setLoading(false);
            console.log('error get users by role', err);
        }
    }, [reqType, searchType, fmrNo, fromdate]);



    const fetchData = useCallback(async ({ pageSize, pageIndex }: any) => { }, []);
    return (
        <>
            <div className="m-3">
                <div className="row">
                    <div className="col">
                        <span className="input-group">
                            <label>Registration Type<small className="text-danger">*</small> </label>
                            <select
                                value={reqType}
                                onChange={(ev) => {
                                    setReqType(ev.target.value);
                                }}
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
                        </span>
                    </div>
                    <div className="col">

                        <span className="input-group">
                            <label>Search Type<small className="text-danger">*</small> </label>
                            <select
                                value={searchType}
                                onChange={(ev) => {
                                    setsearchType(ev.target.value);
                                }}

                                required={true}
                            > <option value="select">Select</option>
                                <option value="fmrno">FMRNo </option>
                                <option value="pmrno">PMRNo</option>

                            </select>
                            <input type="text" className='fs-14' id="fmrNo" onChange={(e) => setFmrNo(e.target.value)} 
                            value={fmrNo}

                            placeholder='Enter FMR/PMR No ' />
                        </span>
                    </div>
                    <div className="col">
                        <span className="input-group">
                            <label>Reg Date <small className="text-danger">*</small> </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setFinal([]);
                                    setFromDate(ev.target.value)
                                }} />
                        </span>
                    </div>
                    <div className="col">
                        <button type='button' onClick={async () => {
                            search()
                        }} className='btn btn-primary'>Search </button>
                    </div>
                </div>

            </div>
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <Table
                            columns={columns}
                            data={final}
                            loading={loading}
                            pageCount={pageCount}
                            fetchData={fetchData}
                        />
                    </div>
                </div>
            </div>

            {showComponent === true ?
                <div>
                    <div className="card container">
                        <div className="card-body">
                            <div className="row mb-3">
                                <DispatchDoctorInfoCard doctorId={doctorId} doctorPrimaryId ={doctorPrimaryId} reqType={reqType} requestPrimaryId={requestPrimaryId} greet={greet}></DispatchDoctorInfoCard>
                            </div>
                        </div>
                    </div>
                </div>
                : ""}

        </>
    )
}

export default DispatchSearch;
