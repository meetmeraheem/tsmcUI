import moment from "moment";
import { getgroups } from "process";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from 'react-select';
import {
    useTable,
    useSortBy,
    useGlobalFilter,
    usePagination
} from "react-table";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import { adminService } from "../../lib/api/admin";
import { assignmentService } from "../../lib/api/assignments";
import { goodstandingmciService } from "../../lib/api/goodstandingmci";
import { provisionalService } from "../../lib/api/provisional";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { UserRole } from "../../types/common";
import { Provisional_DoctorFormType } from "../../types/provisional";

const Mci = () => {
    const fetchIdRef = useRef(0);
    const [finals, setFinals] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [assignedList, setAssignedList] = useState<any>([]);
    const [assignedGridList, setAssignedGridList] = useState<any>([]);
    const [users, setUsers] = useState<UserRole[]>([]);
    const [assignedUser, setAssignedUser] = useState(0);

    const [statusValue, setStatusValue] = useState(null);

    const [checkBoxData, setCheckBoxData] = useState([
        { id: 1, name: 'Pending', value: 'pen', isChecked: false },
        { id: 2, name: 'Completed', value: 'apr', isChecked: false },
        { id: 3, name: 'Rejected', value: 'rej', isChecked: false },
        { id: 4, name: 'Tatkal', value: 'tat', isChecked: false }
    ]);

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
            accessor: "status",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        {value == 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                        {value == 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                    </>
                );
            }
        },
        {
            Header: "Action",
            Cell: (cell: any) => (
                <>
                    <Link to={'/admin/final_reg_view'} state={{ finalPrimaryId: cell.data[0].finalPrimaryId, doctorPrimaryId: cell.data[0].doctorPrimaryId }}>Proceed</Link>
                </>
            )
        },
        {
            Header: "Assign",
            Cell: (cell: any) => (
                <>
                    <i className="bi-person" onClick={async () => {
                        const { data } = await assignmentService.getAssignMentBydoctorIdAssignType(cell.data[Number(cell.row.id)].doctor_id, 'final');
                        if (data && data.length > 0) {
                            const getUser = await adminService.getAdminById(data[0].AssignTo);
                            if (getUser.data.length > 0) {
                                Swal.fire({
                                    text: "Already Assigned to " + getUser.data[0].username,
                                    icon: "warning",
                                    confirmButtonText: "OK",
                                });
                            }
                        }
                        else {
                            const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                            if (!isDuplicate(assignedGridList, cell.data[Number(cell.row.id)])) {
                                const doctorInfo = {
                                    assignBy: adminPrimaryId,
                                    assignCreated: moment().format('YYYY-MM-DD'),
                                    assignStatus: 'pen',
                                    assignReason: '',
                                    doctor_id: cell.data[Number(cell.row.id)].doctor_id,
                                    assignRegType: 'final'
                                }
                                setAssignedList([...assignedList, doctorInfo]);
                                setAssignedGridList([...assignedGridList, cell.data[Number(cell.row.id)]]);
                            }
                            else {
                                Swal.fire({
                                    text: "Already Added",
                                    icon: "warning",
                                    confirmButtonText: "OK",
                                })
                            }
                        }

                    }}></i>
                </>
            )
        }
    ];

    const isDuplicate = (data: any, obj: any) =>
        data.some((el: any) =>
            Object.entries(obj).every(([key, value]) => value === el[key])
        );


    const getUsersByRole = useCallback(async () => {
        try {
            const { data } = await assignmentService.getUsersByRole();
            if (data.length > 0) {
                setUsers(data);
            }
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, []);

    const assign = useCallback(async () => {
        try {
            const assignToUser = assignedList.map((obj: any) => {
                return { ...obj, AssignTo: assignedUser };
            })
            const formData = new FormData();
            formData.append("AssignmentData", JSON.stringify(assignToUser[0]));
            const { success } = await assignmentService.assignToUser(formData);           
             if (success) {
                Swal.fire({
                    //title: "Error",
                    text: "Assigned",
                    icon: "success",
                    confirmButtonText: "OK",
                })
            }
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, [assignedList, assignedUser]);

    useEffect(() => {
        getUsersByRole();
    }, []);

    const fetchData = useCallback(async ({ pageSize, pageIndex }: any) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.
        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current

        // Set the loading state
        setLoading(true)

        var newdate = moment(date).format('YYYY-MM-DD');
        const { data } = await goodstandingmciService.getGoodstandingMCIByFilter(newdate, statusValue);
        // if (data.length > 0) {
        //     setProvisionals(data);
        // }
        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize
               if(data!=undefined){
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
    }, [date, statusValue]);

    const handleChecked = (e: any) => {
        setStatusValue(e.target.value);
        const res = checkBoxData.map((d) => {
            if (d.id.toString() === e.target.name) {
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
            setStatusValue(null);
        }
        setCheckBoxData(res);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="tsmc-filter-box d-flex align-items-center">
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">Good Standing MCI</h2>
                    </div>
                    <div className="p-2 flex-shrink-1 input-group justify-content-end">
                        {/* <input type="text" className="form-control form-control-lg fs-16" placeholder="Search for registrations" aria-label="Search for registrations" aria-describedby="filterbox" /> */}
                        <span className="input-group-text p-0" id="filterbox">
                            <div className="btn-group">
                                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Status <i className="bi-chevron-down"></i></button>
                                <ul className="dropdown-menu shadow-sm rounded-0">
                                    {checkBoxData.map((d: any) => (
                                        <div className="p-2">
                                            <label>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={d.isChecked}
                                                    name={d.id}
                                                    value={d.value}
                                                    onChange={handleChecked}
                                                    key={d.id}
                                                />
                                                <label className="form-check-label ms-2 fw-600">{d.name}</label>
                                            </label>
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </span>
                        <span className="input-group-text p-0">
                            <input type="date" name="" id=""
                                value={date}
                                onChange={(ev) => {
                                    setFinals([]);
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
                                data={finals}
                                loading={loading}
                                pageCount={pageCount}
                                fetchData={fetchData}
                            />

                        </div>
                    </div>
                    {assignedGridList.length > 0 &&
                        <><table className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Doctor Id</th>
                                    <th>Doctor Name</th>
                                    <th>Father Name</th>
                                    <th>Mobile No.</th>
                                    <th>PMR Reg No.</th>
                                    <th>FMR Reg No.</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedGridList?.map((obj: any) => {
                                    return (<tr>
                                        <td>{obj.doctor_id}</td>
                                        <td>{obj.fullname}</td>
                                        <td>{obj.fathername}</td>
                                        <td>{obj.mobileno}</td>
                                        <td><span>TSMC/PMR/</span>{obj.pmr_no}</td>
                                        <td><span>TSMC/FMR/</span>{obj.fmr_no}</td>
                                        <td>
                                            {obj.approval_status === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                                            {obj.approval_status === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                                        </td>
                                        {/* <td><Link to={'/admin/provisional_view'} state={{ provisionalPrimaryId: obj.provisionalPrimaryId, doctorPrimaryId: obj.doctorPrimaryId }}>View</Link></td> */}
                                    </tr>);
                                })}
                            </tbody>
                        </table>
                            <div>
                                <Select
                                    name="Users"
                                    id="Users"
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    isSearchable
                                    options={users}
                                    placeholder="Select User"
                                    onChange={(selectedOption) => {
                                        const { id } =
                                            selectedOption as UserRole;
                                        setAssignedUser(id);
                                    }}
                                    getOptionLabel={(option) => option.username}
                                    getOptionValue={(option) => option.id.toString()}
                                />
                                <button type='button' onClick={async () => {
                                    assign()
                                }} className='btn btn-primary me-3'>Assign </button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Mci;
