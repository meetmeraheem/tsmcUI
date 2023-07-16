import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { additionalService } from "../../lib/api/additional";
import TatCheckbox from './../../components/TatCheckbox';

const AdditionalWorkItems = () => {
    const fetchIdRef = useRef(0);
    const [additionals, setAdditional] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    let default7Days = moment().subtract(3,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [todate, setToDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [istatkal, setIsTatkal] = useState('nor');
    const [isCheckbox, setIsCheckbox] = useState(false);

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
                    <Link to={'/admin/additional_reg_view'} state={{ additionalPrimaryId: cell.data[Number(cell.row.id)].additionalPrimaryId, doctorPrimaryId: cell.data[Number(cell.row.id)].doctorPrimaryId ,assignmentId:cell.data[Number(cell.row.id)].assignmentId}}>Proceed</Link>
                </>
            )
        }
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
        const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
        const { data } = await additionalService.getQualificationsByUserId(vfromdate,vtodate,adminPrimaryId,'additional',istatkal);
        if (data.length > 0) {
            // We'll even set a delay to simulate a server here
            setTimeout(() => {
                // Only update the data if this is the latest fetch
                if (fetchId === fetchIdRef.current) {
                    const startRow = pageSize * pageIndex
                    const endRow = startRow + pageSize
                    if(data!=undefined){
                        setAdditional(data.slice(startRow, endRow))

                    // Your server could send back total page count.
                    // For now we'll just fake it, too
                    setPageCount(Math.ceil(data.length / pageSize));

                }else{
                    setAdditional([]);
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
                        <h2 className="fs-22 fw-700 mb-0">Additional Registrations</h2>
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
                        <span className="input-group-text p-0" id="filterbox">
                        </span>
                        <span className="input-group-text p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setAdditional([]);
                                    setFromDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                        <span className="input-group-text p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setAdditional([]);
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
                                data={additionals}
                                loading={loading}
                                pageCount={pageCount}
                                fetchData={fetchData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdditionalWorkItems;