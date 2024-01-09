import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from 'react-select';
import Swal from "sweetalert2";
import Table from "../../components/Table";
import { adminService } from "../../lib/api/admin";
import { assignmentService } from "../../lib/api/assignments";
import { goodstandingService } from "../../lib/api/goodstanding";
import { LocalStorageManager } from "../../lib/localStorage-manager";
import { UserRole } from "../../types/common";
import { routes } from '../routes/routes-names';
import {useNavigate } from 'react-router-dom';
import TatCheckbox from './../../components/TatCheckbox';
import GoodStandingRegView from './goodstanding-view';

const GoodStanding = () => {
    const fetchIdRef = useRef(0);
    const navigate = useNavigate();
    const [goodstanding, setGoodstanding] = useState([]);
    let defaultDate = moment().format('YYYY-MM-DD');
    let default7Days = moment().subtract(3,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(default7Days);
    const [todate, setToDate] = useState(defaultDate);
    const [loading, setLoading] = useState(false)
    const [pageCount, setPageCount] = useState(0);
    const [assignedList, setAssignedList] = useState<any>([]);
    const [assignedGridList, setAssignedGridList] = useState<any>([]);
    const [users, setUsers] = useState<UserRole[]>([]);
    const [assignedUser, setAssignedUser] = useState(0);
    const [disablebtn, setDisablebtn] = useState(false);
    const [statusValue, setStatusValue] = useState('pen');
    const [statusName, setStatusName] = useState('Pending');
    const [istatkal, setIsTatkal] = useState('nor');
    const [isCheckbox, setIsCheckbox] = useState(false);
    const [selected, setSelected] = useState<any>({});
    const [mobileNo, setMobileNo] = useState('');
    const [docName, setdocName] = useState('');
    const [checkBoxData, setCheckBoxData] = useState([
        { id: 1, name: 'Pending', value: 'pen', isChecked: false },
        { id: 2, name: 'Completed', value: 'apr', isChecked: false },
        { id: 3, name: 'Rejected', value: 'rej', isChecked: false },
        { id: 5, name: 'Verified', value: 'ver', isChecked: false }
    ]);
    const [reassignedList, setReassignedList] = useState<any>([]);
    const [reassignedGridList, setReassignedGridList] = useState<any>([]);
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

    const toggleSelected = (id:any,e:any) => {
        setSelected((selected:any) => ({
            ...selected,
            [id]: !selected[id]
        }));
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
                        {value!=='tat'?"Normal":"Tatkal"}
                    </>
                );
            }
        },
        {
            Header: "Reg Date",
            accessor: "regDate",
            Cell: ({ cell: { value } }: any) => {
              var temp=  moment(value).format('DD-MM-YYYY');
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
        },
        {
            Header: "Assign",
            Cell: (cell: any) => (
                <>
                    {cell.data[Number(cell.row.id)].assignedUserName ===null && cell.data[Number(cell.row.id)].status ==='pen' ? 
                    <input  type="checkbox" id={cell.row.id} checked={selected[cell.row.id]} onClick={async (e:any) => {
                        toggleSelected(cell.row.id,e);
                        const { data } = await assignmentService.getAssignMentBydoctorIdAssignType(cell.data[Number(cell.row.id)].doctor_id, 'gs',cell.data[Number(cell.row.id)].gsPrimaryId,);
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
                           // if (!isDuplicate(assignedGridList, cell.data[Number(cell.row.id)])) {
                                const doctorInfo = {
                                    assignBy: adminPrimaryId,
                                    assignCreated: moment().format('YYYY-MM-DD'),
                                    assignStatus: 'pen',
                                    assignReason: '',
                                    doctor_id: cell.data[Number(cell.row.id)].doctor_id,
                                    assignRegType: 'gs',
                                    regTypeId:cell.data[Number(cell.row.id)].gsPrimaryId
                                }
                                if(e.target.checked){
                                    setAssignedList([...assignedList, doctorInfo]);
                                    setAssignedGridList([...assignedGridList, cell.data[Number(cell.row.id)]]);
                                    }else{
                                           const id = e.target.getAttribute("id")
                                           setAssignedList(assignedList.filter((item:any) => item.doctor_id !== cell.data[Number(cell.row.id)].doctor_id));
                                           setAssignedGridList(assignedGridList.filter((item:any) => item.doctor_id !== cell.data[Number(cell.row.id)].doctor_id));
    
                                    }
                        }

                    }} />:cell.data[Number(cell.row.id)].assignedUserName}
                </>
            )
        },{
            Header: "ReAssign",
            id: "reassign",
            Cell: (cell: any) => (
                <>
                    {cell.data[Number(cell.row.id)].assignedUserName !== null && cell.data[Number(cell.row.id)].status === 'pen' ?
                        <input type="checkbox" id={cell.row.id} checked={selected[cell.row.id]} onChange={async (e: any) => {
                            toggleSelected(cell.row.id, e);
                                const adminPrimaryId = Number(LocalStorageManager.getAdminPrimaryId());
                                const doctorInfo = {
                                    assignBy: adminPrimaryId,
                                    assignId: cell.data[Number(cell.row.id)].assignmentId,
                                    doctor_id: cell.data[Number(cell.row.id)].doctor_id,
                                    assignRegType: 'gs',
                                    regTypeId: cell.data[Number(cell.row.id)].gsPrimaryId
                                }
                                if (e.target.checked) {
                                    setReassignedList([...reassignedList, doctorInfo]);
                                    setReassignedGridList([...reassignedGridList, cell.data[Number(cell.row.id)]]);
                                } else {
                                    setReassignedList(reassignedList.filter((item: any) => item.doctor_id !== cell.data[Number(cell.row.id)].doctor_id));
                                    setReassignedGridList(reassignedGridList.filter((item: any) => item.doctor_id !== cell.data[Number(cell.row.id)].doctor_id));

                                }
                        }} /> : cell.data[Number(cell.row.id)].assignedUserName}
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
            setDisablebtn(true);
            const assignToUser = assignedList.map((obj: any) => {
                return { ...obj, assignTo: assignedUser };
            })
            const formData = new FormData();
            formData.append("assignmentData", JSON.stringify(assignToUser));
            const { success } = await assignmentService.assignToUser(formData);           
             if (success) {
                Swal.fire({
                    //title: "Error",
                    text: "Assigned",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        setAssignedList([]);
                        setAssignedGridList([]);
                        fetchData(10);
                        setDisablebtn(false);
                        navigate(routes.admin_dashboard);
                    }
                });
            }
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, [assignedList, assignedUser]);
    const ReAssign = useCallback(async () => {
        try {
            if (assignedUser != 0) {

                setDisablebtn(true);
                const assignToUser = reassignedList.map((obj: any) => {
                    return { ...obj, assignTo: assignedUser };
                })
                const formData = new FormData();
                formData.append("assignmentData", JSON.stringify(assignToUser));
                const { success } = await assignmentService.reAssign(formData);
                if (success) {
                    Swal.fire({
                        //title: "Error",
                        text: "ReAssigned",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            setReassignedList([]);
                            setReassignedGridList([]);
                            fetchData(0);
                            setDisablebtn(false);
                            setAssignedUser(0);
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Please select a User to Assign",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            console.log('error get users by role', err);
        }
    }, [reassignedList, assignedUser]);

    useEffect(() => {
            getUsersByRole();
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
        const { data } = await goodstandingService.getGoodstandingByFilter(vfromdate,vtodate,statusValue,istatkal);
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
               if(data!=undefined){
                setGoodstanding(data.slice(startRow, endRow))

                // Your server could send back total page count.
                // For now we'll just fake it, too
                setPageCount(Math.ceil(data.length / pageSize));
                setLoading(false);
               }else{
                   setGoodstanding([]);
                   setLoading(false);
                }

                setLoading(false)
            }
        }, 1000)
    }, [fromdate,todate, statusValue,istatkal]);

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

    const getDoctorDetailsByMobile = async () => {
        try {
                const fetchId = ++fetchIdRef.current
                const pageSize=10;
                const pageIndex=0
            if (mobileNo.length === 10) {
                const formData = new FormData();
                formData.append("mobileNo", mobileNo);
                formData.append("docName", "");
               const { data } = await goodstandingService.getGoodStandingByMobileNo(formData);
               if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize
               if(data!=undefined){
                setGoodstanding(data.slice(startRow, endRow))
                setPageCount(Math.ceil(data.length / pageSize));
                setLoading(false);
               }else{
                setGoodstanding([]);
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

    const getDoctorDetailsBydocName = async () => {
        try {
                const fetchId = ++fetchIdRef.current
                const pageSize=10;
                const pageIndex=0
            if (docName.length > 3) {
                const formData = new FormData();
                formData.append("mobileNo", "");
                formData.append("docName",docName) ;
               const { data } = await goodstandingService.getGoodStandingByMobileNo(formData);
               if (fetchId === fetchIdRef.current) {
                const startRow = pageSize * pageIndex
                const endRow = startRow + pageSize
               if(data!=undefined){
                setGoodstanding(data.slice(startRow, endRow))
                setPageCount(Math.ceil(data.length / pageSize));
                setLoading(false);
               }else{
                  setGoodstanding([]);
                   setLoading(false);
                }
            }
                }else{
                    alert("Please enter at least 4 characters of  doctor Name");    
                }
            

        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div >
                    <div className="p-2 w-100">
                        <h2 className="fs-22 fw-700 mb-0">Good Standing</h2>
                    </div>
                    </div>

            <div className="tsmc-filter-box d-flex align-items-center">                    
                <div className="input-group-text p-0">
                    <label htmlFor="" className='mb-2'>Mobile No : </label>
                    <input type="text" className='fs-14' id="mobileNo" onBlur={(e) => setMobileNo(e.target.value)} placeholder='Enter Mobile No' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsByMobile
                            } className='btn bi-search btn-outline-success'> </button>
                    <label htmlFor="" className='mb-2'>Doctor Name  : </label>
                    <input type="text" className='fs-14' id="name" onBlur={(e) => setdocName(e.target.value)} placeholder='Enter Name' />
                        <button type="submit"
                            disabled={disablebtn}
                            onClick={
                                getDoctorDetailsBydocName
                            } className='btn bi-search btn-outline-success'> </button>
                    </div>        
                    <span className="input-group-text p-0" style={{marginLeft:"30px"}}>
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
                        <div className="btn-group">
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
                            </div>
                        </span>
                        <span className="input-group-text p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setGoodstanding([]);
                                    setFromDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                        <span className="input-group-text p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setGoodstanding([]);
                                    setToDate(ev.target.value)
                                }} className="form-control" />
                        </span>
                    
                </div>
                <div className="mt-3">
                    <div className="card">
                        <div className="card-body">
                            <Table
                                columns={columns}
                                data={goodstanding}
                                loading={loading}
                                pageCount={pageCount}
                                fetchData={fetchData}
                            />

                        </div>
                    </div>
                    {assignedGridList.length > 0 &&
                        <><table className="table table-hover table-striped">
                            <thead>
                            <tr><th style={{color:'brown'}}>Assigned List </th></tr>
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
                                <button type='button' disabled={disablebtn} onClick={async () => {
                                    assign()
                                }} className='btn btn-primary me-3'>Assign </button>
                            </div>
                        </>
                    }
                </div>
                {reassignedGridList.length > 0 &&
                        <><table className="table table-hover table-striped">
                            <thead>
                                <tr><th style={{color:'blue'}}>Re Assigned List </th></tr>
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
                                {reassignedGridList?.map((obj: any) => {
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
                                <button type='button' disabled={disablebtn} onClick={async () => {
                                    ReAssign()
                                }} className='btn btn-primary me-3'>ReAssign </button>
                            </div>
                        </>
                    }
                </div>
            
            {showComponent === true?<GoodStandingRegView state={{ gsPrimaryId:viewagoodstandingid , doctorPrimaryId: viewDocid, assignmentId:viewAssignid  }} greet={greet}></GoodStandingRegView>:""}
        </>
    )
}

export default GoodStanding;
