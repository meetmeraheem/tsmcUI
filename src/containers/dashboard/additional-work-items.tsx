import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import Swal from "sweetalert2";
import Table from "../../components/Table";
import { assignmentService } from "../../lib/api/assignments";
import { provisionalService } from "../../lib/api/provisional";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { UserRole } from "../../types/common";
import { additionalService } from "../../lib/api/additional";

const AdditionalWorkItems = () => {
    const fetchIdRef = useRef(0);
    const [additionals, setAdditional] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);

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
                    <Link to={'/admin/additional_reg_view'} state={{ additionalPrimaryId: cell.data[Number(cell.row.id)].additionalPrimaryId, doctorPrimaryId: cell.data[Number(cell.row.id)].doctorPrimaryId ,assignmentId:cell.data[0].assignmentId}}>Proceed</Link>
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

        var newdate = moment(date).format('YYYY-MM-DD');
        const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
        const { data } = await additionalService.getQualificationsByUserId(newdate, adminPrimaryId,'additional');
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
    }, [date]);

    return (
        <>
            <div className="container-fluid">
                <div className="tsmc-filter-box d-flex align-items-center">
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">Additional Registrations</h2>
                    </div>
                    <div className="p-2 flex-shrink-1 input-group justify-content-end">
                        <span className="input-group-text p-0" id="filterbox">
                                        {/*  <div className="btn-group">
                                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Status <i className="bi-chevron-down"></i></button>
                                <ul className="dropdown-menu shadow-sm rounded-0">
                                    <li className="p-2">
                                        <input type='checkbox' id="Pending" className="form-check-input" name="status" value="pen" />
                                        <label htmlFor="Pending" className="form-check-label ms-2 fw-400">Pending</label>
                                    </li>
                                    <li className="p-2">
                                        <input type='checkbox' id="Completed" className="form-check-input" name="status" value="apr" />
                                        <label htmlFor="Completed" className="form-check-label ms-2 fw-400">Completed</label>
                                    </li>
                                    <li className="p-2">
                                        <input type='checkbox' id="Completed" className="form-check-input" name="status" value="rej" />
                                        <label htmlFor="Completed" className="form-check-label ms-2 fw-400">Rejected</label>
                                    </li>
                                    <li className="p-2">
                                        <input type='checkbox' id="Tatkal" className="form-check-input" name="status" value="tat" />
                                        <label htmlFor="Tatkal" className="form-check-label ms-2 fw-400">Tatkal</label>
                                    </li>
                                </ul>
    </div>*/}
                        </span>
                        <span className="input-group-text p-0">
                            <input type="date" name="" id=""
                                value={date}
                                onChange={(ev) => {
                                    setAdditional([]);
                                    setDate(ev.target.value)
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