import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import Table from "../../components/Table";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { goodstandingService } from "../../lib/api/goodstanding";
import TatCheckbox from './../../components/TatCheckbox';
import GoodStandingRegView from './goodstanding-view';

const GoodStandingWorkItems = () => {
    const fetchIdRef = useRef(0);
    const [goodstandings, setGoodstandings] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    let default7Days = moment().subtract(3,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [todate, setToDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [istatkal, setIsTatkal] = useState('nor');
    const [isCheckbox, setIsCheckbox] = useState(false);
    const [showComponent, setShowComponent] = useState(false);
    const [viewagoodstandingid, setViewgoodstandingId] = useState('');
    const [viewDocid, setViewDocId] = useState('');
    const [viewAssignid, setViewAssignid] = useState('');

  const toggleComponent = useCallback(async (gsId:any,docId:any,assignId:any) => {
    try {
            let newValue = gsId  ? gsId  : viewagoodstandingid;
            setViewgoodstandingId(newValue);
            setViewDocId(docId);
            setViewAssignid(assignId);
    } catch (err) {
        console.log('error get users by role', err);
    }
}, [showComponent]);

const greet=()=> {
    setShowComponent(false);
    setViewgoodstandingId('');
    fetchData(0);
   };


    const handleChangeTatkal = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked){
            setIsTatkal('tat');
        }else{
            setIsTatkal('nor');
        }
        setIsCheckbox(e.target.checked);
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
            Header: "Reg No.",
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
            accessor: "status",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>{value == 'ver' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Verified</span>}
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
                        toggleComponent(cell.data[Number(cell.row.id)].gsPrimaryId,cell.data[Number(cell.row.id)].doctorPrimaryId, cell.data[Number(cell.row.id)].assignmentId);
                        }}>Proceed</a>
                </>
            )
        }
    ];

    useEffect(() => {
        if (viewagoodstandingid) {
            setShowComponent(true); // Show the child component when propValue is not empty
          } else {
            setShowComponent(false); // Hide the child component when propValue is empty
          }

    }, [showComponent,viewagoodstandingid]);

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
        const { data } = await goodstandingService.getGoodStandingByUserId(vfromdate,vtodate, adminPrimaryId, 'gs',istatkal);
        if (data.length > 0) {
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
                    if (data != undefined) {
                        setGoodstandings(data.slice(startRow, endRow))

                        // Your server could send back total page count.
                        // For now we'll just fake it, too
                        setPageCount(Math.ceil(data.length / pageSize));

                    } else {
                        setGoodstandings([]);
                        setLoading(false);
                    }
                }
            }, 1000)
        }
        setLoading(false);
    }, [fromdate,todate,istatkal]);

    return (
        <>
            <div className="container-fluid">
                <div className="tsmc-filter-box d-flex align-items-center">
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">Goodstanding Registrations</h2>
                    </div>
                    
                    <div className="p-2 flex-shrink-1 input-group justify-content-end">
                    <span className="input-group-text p-0">
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
                       
                        <span className="input-group-text p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setGoodstandings([]);
                                    setFromDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                        <span className="input-group-text p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setGoodstandings([]);
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
                                data={goodstandings}
                                loading={loading}
                                pageCount={pageCount}
                                fetchData={fetchData}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showComponent === true?<GoodStandingRegView state={{ gsPrimaryId:viewagoodstandingid , doctorPrimaryId: viewDocid, assignmentId:viewAssignid  }} greet={greet}></GoodStandingRegView>:""}
        </>
    )
}

export default GoodStandingWorkItems;