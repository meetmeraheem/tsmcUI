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

const ProvisionalRegistrations = () => {
    const fetchIdRef = useRef(0);
    const [provisionals, setProvisionals] = useState([]);
    const [assignedList, setAssignedList] = useState<any>([]);
    const [assignedGridList, setAssignedGridList] = useState<any>([]);
    const [users, setUsers] = useState<UserRole[]>([]);
    const [assignedUser, setAssignedUser] = useState(0);
    let defaultDate = moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [statusValue, setStatusValue] = useState(null);

    const [checkBoxData, setCheckBoxData] = useState([
        { id: 1, name: 'Pending', value: 'pen', isChecked: false },
        { id: 2, name: 'Completed', value: 'apr', isChecked: false },
        { id: 3, name: 'Rejected', value: 'rej', isChecked: false },
        { id: 4, name: 'Tatkal', value: 'tat', isChecked: false }
    ]);

    const columns = [
        {
            Header: "Doctor Name",
            accessor: "fullname"
        },
        {
            Header: "Doctor Id",
            accessor: "doctor_id"
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
            Header: "Father Name",
            accessor: "fathername"
        },
        {
            Header: "Mother Name",
            accessor: "mothername"
        },
        {
            Header: "Mobile No",
            accessor: "mobileno"
        },
        {
            Header: "Aadhar No",
            accessor: "aadharcard"
        },
        {
            Header: "Status",
            accessor: "approval_status",
            Cell: ({ cell: { value } }: any) => {
                return (
                    <>
                        {value === 'apr' && <span className="alert alert-success rounded-pill py-0 px-2 fs-12">Approved</span>}
                        {value === 'pen' && <span className="alert alert-warning rounded-pill py-0 px-2 fs-12">Pending</span>}
                    </>
                );
            }
        },
        {
            Header: "Action",
            Cell: (cell: any) => (
                <>
                    <Link to={'/admin/provisional_view'} state={{ provisionalPrimaryId: cell.data[Number(cell.row.id)].provisionalPrimaryId, doctorPrimaryId: cell.data[Number(cell.row.id)].doctorPrimaryId }}>Proceed</Link>
                </>
            )
        },
        {
            Header: "Assign",
            Cell: (cell: any) => (
                <>
                    <i className="bi-person" onClick={() => {
                        const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                        if (!isDuplicate(assignedGridList, cell.data[Number(cell.row.id)])) {
                            const doctorInfo = {
                                assignBy: adminPrimaryId,
                                //AssignTo: assignedUser,
                                assignCreated: moment().format('YYYY-MM-DD'),
                                assignStatus: 0,
                                assignReason: '',
                                doctor_id: cell.data[Number(cell.row.id)].doctor_id
                            }
                            setAssignedList([...assignedList, doctorInfo]);
                            setAssignedGridList([...assignedGridList, cell.data[Number(cell.row.id)]]);
                        }
                        else {
                            alert('Duplicate');
                        }
                    }}></i>
                </>
            )
        }
    ];

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

    const isDuplicate = (data: any, obj: any) =>
        data.some((el: any) =>
            Object.entries(obj).every(([key, value]) => value === el[key])
        );

    const getProvisionalList = useCallback(async () => {
        try {
            var newdate = moment(date).format('YYYY-MM-DD');
            const { data } = await provisionalService.getProvisionalsByFilter(newdate, statusValue);
            if (data.length > 0) {
                setProvisionals(data);
            }
        } catch (err) {
            console.log('error getProvisionalDetails', err);
        }
    }, [date,statusValue]);

    const fetchData = useCallback(async ({ pageSize, pageIndex }: any) => {
        // This will get called when the table needs new data
        // You could fetch your data from literally anywhere,
        // even a server. But for this example, we'll just fake it.
        // Give this fetch an ID
        const fetchId = ++fetchIdRef.current

        // Set the loading state
        setLoading(true)

        var newdate = moment(date).format('YYYY-MM-DD');
        const { data } = await provisionalService.getProvisionalsByFilter(newdate, statusValue);
        // if (data.length > 0) {
        //     setProvisionals(data);
        // }
        // We'll even set a delay to simulate a server here
        setTimeout(() => {
            // Only update the data if this is the latest fetch
            console.log("data"+data);
            if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize
                if(data!=undefined){
                setProvisionals(data.slice(startRow, endRow));
                setPageCount(Math.ceil(data.length / pageSize));
                setLoading(false);
                }else{
                    setProvisionals([]);
                    setLoading(false);
                }

                // Your server could send back total page count.
                // For now we'll just fake it, too
               

               
            }
        }, 1000)
    }, [date, statusValue]);

    const assign = useCallback(async () => {
        try {
            const assignToUser = assignedList.map((obj: any) => {
                return { ...obj, assignTo: assignedUser };
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

    // const handleChange = (e: any) => {
    //     setStatusValue(e.target.value);
    // };

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

        const eamtyArray =  res.filter((d) => {
            return d.isChecked === true
        });
        if(eamtyArray.length === 0){
            setStatusValue(null);
        }
        setCheckBoxData(res);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="tsmc-filter-box d-flex align-items-center">
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">Provisional Registrations</h2>
                    </div>
                    <div className="p-2 flex-shrink-1 input-group justify-content-end">
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
                                    setProvisionals([]);
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
                                data={provisionals}
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
                                    <th>Doctor Name</th>
                                    <th>Doctor Id</th>
                                    <th>Reg No.</th>
                                    <th>Father Name</th>
                                    <th>Mother Name</th>
                                    <th>Mobile No.</th>
                                    <th>Aadhar No</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignedGridList?.map((obj: any) => {
                                    return (<tr>
                                        <td>{obj.fullname}</td>
                                        <td>{obj.doctor_id}</td>
                                        <td><span>TSMC/PMR/</span>{obj.pmr_no}</td>
                                        <td>{obj.fathername}</td>
                                        <td>{obj.mothername}</td>
                                        <td>{obj.mobileno}</td>
                                        <td>{obj.aadharcard}</td>
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
                                    // value={users.find(
                                    //     (item) => item.id === field.value
                                    // )}
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

export default ProvisionalRegistrations;




{/* <li className="p-2">
<input type='radio' id="Pending" onChange={handleChange} className="form-check-input" name="status" value="pen" />
<label htmlFor="Pending" className="form-check-label ms-2 fw-400">Pending</label>
</li>
<li className="p-2">
    <input type='radio' id="Completed" onChange={handleChange} className="form-check-input" name="status" value="apr" />
    <label htmlFor="Completed" className="form-check-label ms-2 fw-400">Completed</label>
</li>
<li className="p-2">
    <input type='radio' id="Completed" onChange={handleChange} className="form-check-input" name="status" value="rej" />
    <label htmlFor="Completed" className="form-check-label ms-2 fw-400">Rejected</label>
</li>
<li className="p-2">
    <input type='radio' id="Tatkal" onChange={handleChange} className="form-check-input" name="status" value="tat" />
    <label htmlFor="Tatkal" className="form-check-label ms-2 fw-400">Tatkal</label>
</li> 
*/}