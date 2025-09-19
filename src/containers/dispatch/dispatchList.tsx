import './../../assets/styles/styles.css';

import { useCallback, useEffect, useState, useRef } from 'react';
import moment from "moment";
import Table from "../../components/Table";
import dispatchservice from "../../lib/api/dispatch";

const DispatchList = () => {
    const fetchIdRef = useRef(0);
    const [finals, setFinals] = useState([]);
    const [loading, setLoading] = useState(false)
    
    const [pageCount, setPageCount] = useState(0);
    
    let defaultDate = moment().format('YYYY-MM-DD');
    let default7Days = moment().subtract(3,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [todate, setToDate] = useState(defaultDate);
    const [mobileNo, setMobileNo] = useState('');
    const [FMRNo, setFMRNo] = useState('');
    
    const [disablebtn, setDisablebtn] = useState(false);
    useEffect(() => {
    }, []);


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
            Header: "FMR No",
            accessor: "fmrno"
        },
        {
            Header: "Email id",
            accessor: "emailid"
        },
        {
            Header: "Courier Date",
            accessor: "courierDate",
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
            Header: "Courier No",
            accessor: "courierNo"
        },
        {
            Header: "Dispatch Date",
            accessor: "dispatchDate",
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
            Header: "Dispatch No",
            accessor: "dispatchNo"
        },
        {
            Header: "Request Type",
            accessor: "request_Type",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        {value === 'fmr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">FMR</span>}
                        {value === 'pmr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">PMR</span>}
                        {value === 'aqr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Additional</span>}
                        {value === 'frr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Renewal</span>}
                        {value === 'noc' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">NOC</span>}
                        {value === 'gs' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Good Standing</span>}
                    </>
                );
            }
        },

       
    ];

    const fetchData = useCallback(async ({ pageSize, pageIndex }: any) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.
        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current

        // Set the loading state
        setLoading(true)

        let vfromdate = moment(fromdate).format('YYYY-MM-DD');


        let vtodate = moment(todate).format('YYYY-MM-DD');

        const { data } = await dispatchservice.getDispachByFilter(vfromdate,vtodate );
        // if (data.length > 0) {
        //     setProvisionals(data);
        // }
        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
         if(pageSize===undefined){
                pageSize=10;
         }
         if(pageIndex===undefined){
             pageIndex=0
         }
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize
               if(data !== undefined){
                setFinals(data.slice(startRow, endRow))

                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(data.length / pageSize));
                setLoading(false);
               }else{
                   setFinals([]);
                   setLoading(false);
                }

                setLoading(false)
            }
        }, 1000)
    }, [fromdate,todate]);

    const getDispatchByMobile = async () => {
            try {
                    const fetchId = ++fetchIdRef.current
                    const pageSize=10;
                    const pageIndex=0
                if (mobileNo.length === 10) {
                    setLoading(true);
                    const formData = new FormData();
                    formData.append("mobileNo", mobileNo);
                    formData.append("FMRNo", "");
                   const { data } = await dispatchservice.getDispatchByMobile(formData);
                   if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                   if(data!=undefined){
                    setMobileNo('');
                    setFinals(data.slice(startRow, endRow))
                    setPageCount(Math.ceil(data.length / pageSize));
                    setLoading(false);
                   }else{
                    setFinals([]);
                       setLoading(false);
                    }
                }
                    }else{
                        alert("Please  enter 10 digit  Mobile No ");    
                    }
                
    
            } catch (err) {
                console.log('error getDoctorDetails ', err);
            }
        
    };
  const getgetDispatchByFMRNo = async () => {
            try {
                const fetchId = ++fetchIdRef.current
                const pageSize = 10;
                const pageIndex = 0
                if (FMRNo.length > 3) {
                    setLoading(true);
                    const formData = new FormData();
                    formData.append("mobileNo", "");
                    formData.append("FMRNo", FMRNo);
                    const { data } = await dispatchservice.getDispatchByMobile(formData);
                    if (fetchId === fetchIdRef.current) {
                        const startRow = pageSize * pageIndex
                        const endRow = startRow + pageSize
                        if (data != undefined) {
                            setFMRNo('');
                            setFinals(data.slice(startRow, endRow))
                            setPageCount(Math.ceil(data.length / pageSize));
                            setLoading(false);
                        } else {
                            setFinals([]);
                            setLoading(false);
                        }
                    }
                } else {
                    alert("Please enter at least 4 characters of  FMRNo");
                }
            } catch (err) {
                console.log('error getDoctorDetails ', err);
            }
    };
    return (
        <>
            <div className="tsmc-filter-box d-flex align-items-center">
                <div className="row">
                <div className="tsmc-filter-box d-flex align-items-center">
                    <div className="input-group-text p-0">
                        <label htmlFor="" className='mb-2'>Mobile No : </label>
                        <input type="text" className='fs-14 w-100' id="mobileNo" onBlur={(e) => setMobileNo(e.target.value)} placeholder='Enter Mobile No' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDispatchByMobile
                            } className='btn bi-search '> </button>
                        
                            <label htmlFor="" className='mb-2'>FMR No  : </label>
                        <input type="text" className='fs-14 w-100' id="name" onBlur={(e) => setFMRNo(e.target.value)} placeholder='Enter FMRNo' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getgetDispatchByFMRNo
                            } className='btn bi-search '> </button>
                    </div>
                    
                
                    
                <span className="input-group-text p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setFinals([]);
                                    setFromDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                        
                        
                        <span className="input-group-text p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setFinals([]);
                                    setToDate(ev.target.value)
                                }} className="form-control" />
                        </span>
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

export default DispatchList;
