import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "./Input";
import Table from "../../components/Table";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { nocService } from "../../lib/api/noc";
import TatCheckbox from './../../components/TatCheckbox';
import NocRegView from './noc-view';

const MyWorkItems = () => {
    const fetchIdRef = useRef(0);
    const [nocs, setNocs] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    let default7Days = moment().subtract(3,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [todate, setToDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [istatkal, setIsTatkal] = useState('nor');
    const [isCheckbox, setIsCheckbox] = useState(false);
    const [statusName, setStatusName] = useState('Pending');
    const [statusValue, setStatusValue] = useState('pen');
    const [checkBoxData, setCheckBoxData] = useState([
        { id: 1, name: 'Pending', value: 'pen', isChecked: false },
        { id: 2, name: 'Completed', value: 'apr', isChecked: false },
        { id: 3, name: 'Rejected', value: 'rej', isChecked: false },
        { id: 5, name: 'Verified', value: 'ver', isChecked: false }
    ]);
    const [disablebtn, setDisablebtn] = useState(false);
    const [mobileNo, setMobileNo] = useState('');
    const [docName, setdocName] = useState('');


    const [showComponent, setShowComponent] = useState(false);
    const [viewNocid, setViewNocId] = useState('');
    const [viewDocid, setViewDocId] = useState('');
    const [viewAssignid, setViewAssignid] = useState('');

  const toggleComponent = useCallback(async (nocId:any,docId:any,assignId:any) => {
    try {
            let newValue = nocId  ? nocId  : viewNocid;
            setViewNocId(newValue);
            setViewDocId(docId);
            setViewAssignid(assignId);
    } catch (err) {
        console.log('error get users by role', err);
    }
}, [showComponent]);

    const greet=()=> {
        setShowComponent(false);
        setViewNocId('');
        fetchData(0);
   }


    const handleChangeTatkal = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked){
            setIsTatkal('tat');
        }else{
            setIsTatkal('nor');
        }
        setIsCheckbox(e.target.checked);
      };

      const handleChecked = (e: any) => {
        setStatusValue(e.target.value);
        setStatusName(e.target.name);
        const res = checkBoxData.map((d) => {
            if (d.id.toString() === e.target.id) {
                return { ...d, isChecked: !d.isChecked };
            }
            else {
                return { ...d, isChecked: false };
            }
        });
        const eamtyArray = res.filter((d) => {
            return d.isChecked === true
        });
        if (eamtyArray.length === 0) {
            setStatusValue('pen');
            setStatusName('Pending');
        }
        setCheckBoxData(res);
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
            Header: "Status",
            accessor: "approval_status",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                       {value == 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
                        {value == 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                        {value == 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                        {value == 'rej' && <span className="alert alert-danger rounded-pill py-0 px-2 fs-12">Rejected</span>}
                    </>
                );
            }
        },
        {
            Header: "Action",
            Cell: (cell: any) => (
                <>
                   <a href="javascript:void(0);" onClick={() =>
                        {
                        setShowComponent(false);  
                        toggleComponent(cell.data[Number(cell.row.id)].nocPrimaryId,cell.data[Number(cell.row.id)].doctorPrimaryId, cell.data[Number(cell.row.id)].assignmentId);
                        }}>Proceed</a>
                </>
            )
        }
    ];

    useEffect(() => {
        if (viewNocid) {
            setShowComponent(true); // Show the child component when propValue is not empty
          } else {
            setShowComponent(false); // Hide the child component when propValue is empty
          }

    }, [showComponent,viewNocid]);
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
        const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
        const { data } = await nocService.getNocByUserId(vfromdate,vtodate, adminPrimaryId,'noc',statusValue,istatkal);
     //   if (data.length > 0) {
            // We'll even set a delay to simulate a server here
            setTimeout(() => {
                if(pageSize===undefined){
                    pageSize=10;
                    }
                    if(pageIndex===undefined){
                        pageIndex=0
                    }
                // Only update the data if this is the latest fetch
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if(data!=undefined){
                        setNocs(data.slice(startRow, endRow))

                    // Your server could send back total page count.
                    // For now we'll just fake it, too
                    setPageCount(Math.ceil(data.length / pageSize));

                }else{
                    setNocs([]);
                    setLoading(false);
                                        }
                }
            }, 1000)
       // }
        setLoading(false);
    }, [fromdate,todate,statusValue,istatkal]);

    const getDoctorDetailsByMobile = async () => {
        try {
            const fetchId = ++fetchIdRef.current
            const pageSize = 10;
            const pageIndex = 0
            if (mobileNo.length === 10) {
                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                const formData:any = new FormData();
                formData.append("mobileNo", mobileNo);
                formData.append("docName", "");
                formData.append("userId",adminPrimaryId);
                const { data } = await nocService.getNocsByMobileNoByUserId(formData);
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if (data != undefined) {
                        setMobileNo('');
                        setNocs(data.slice(startRow, endRow))
                        setPageCount(Math.ceil(data.length / pageSize));
                        setLoading(false);
                    } else {
                        setNocs([]);
                        setLoading(false);
                    }

                    
                }
            } else {
                alert("Please  enter 10 digit  Mobile No ");
            }


        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };

 

    const getDoctorDetailsBydocName = async () => {
        try {
            const fetchId = ++fetchIdRef.current
            const pageSize = 10;
            const pageIndex = 0
            if (docName.length > 3) {
                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                const formData:any = new FormData();
                formData.append("mobileNo", "");
                formData.append("docName",docName);
                formData.append("userId",adminPrimaryId);
                const { data } = await nocService.getNocsByMobileNoByUserId(formData);
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if (data != undefined) {
                        setdocName('');
                        setNocs(data.slice(startRow, endRow))
                        setPageCount(Math.ceil(data.length / pageSize));
                        setLoading(false);
                    } else {
                        setNocs([]);
                        setLoading(false);
                    }
                }
               
            } else {
                alert("Please enter at least 4 characters of  doctor Name");
            }


        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };
    const resetInput = () => {
        setMobileNo("");
        setdocName("");
      };

    return (
        <>
            <div className="container-fluid">
                <div >
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">NOC Registrations</h2>
                    </div>
                    
                    <div className="tsmc-filter-box d-flex align-items-center">  
                  <div className="input-group-text p-0">
                        <label htmlFor="" className='mb-2'>Mobile No : </label>
                        <Input
                        onChange={(e:any) => setMobileNo(e.target.value)}
                            value={mobileNo || ""}
                            resetinput={resetInput}
                            className='fs-14' 
                            placeholder='Enter Mobile No' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsByMobile
                            } className='btn bi-search btn-outline-success'> </button>
                        <label htmlFor="" className='mb-2'>Doctor Name  : </label>
                        <Input
                        onChange={(e:any) => setdocName(e.target.value)}
                            value={docName || ""}
                            resetinput={resetInput}
                            className='fs-14' 
                            placeholder='Enter Name' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsBydocName
                            } className='btn bi-search btn-outline-success'> </button>
                    </div>    
                    <span className="input-group-text p-0" style={{ marginLeft: "30px" }}>
                    <div className="btn-group">
                        <label className="m-1">Tatkal</label>
                        <span className="tsmc-filter-box  form-control">
                                         <TatCheckbox
                                                handleChange={handleChangeTatkal}
                                                isChecked={isCheckbox}
                                                label=""
                                                
                                                />
                                            </span>
                                            </div>
                                            </span>
                        <span className="input-group-text p-0" id="filterbox">
                        <button className="btn p-0" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                            <div className="input-group-text p-0">
                                <label className="m-1">Status</label>
                                <span className="form-control">
                                    {statusName} <i className="bi-chevron-down"></i>
                                </span>
                            </div>
                        </button>
                        <ul className="dropdown-menu shadow-sm rounded-0">
                            {checkBoxData.map((d: any) => (
                                <div className="p-2">
                                    <label>
                                        <input
                                            className="form-check-input"
                                            id={d.id}
                                            type="checkbox"
                                            checked={d.isChecked}
                                            name={d.name}
                                            value={d.value}
                                            onChange={handleChecked}
                                            key={d.id}
                                        />
                                        <label className="form-check-label ms-2 fw-600">{d.name}</label>
                                    </label>
                                </div>
                            ))}
                        </ul>

                    </span>                    
                        <span className="input-group-text p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setNocs([]);
                                    setFromDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                        <span className="input-group-text p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setNocs([]);
                                    setToDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            <Table
                                columns={columns}
                                data={nocs}
                                loading={loading}
                                pageCount={pageCount}
                                fetchData={fetchData}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showComponent === true?<NocRegView state={{ nocPrimaryId:viewNocid , doctorPrimaryId: viewDocid, assignmentId:viewAssignid  }} greet={greet}></NocRegView>:""}
        </>
    )
}

export default MyWorkItems;