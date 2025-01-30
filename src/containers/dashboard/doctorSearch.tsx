import { useCallback, useEffect, useState } from "react";
import { commonService } from '../../lib/api/common';
import { DoctorFormType } from '../../types/doctor';
import moment from 'moment';
import SiteLogo from '../../assets/images/logo.png';
import colorLogo from '../../assets/images/TSMC_LOGO.jpg';
import './../../assets/styles/styles.css';
const DoctorSearchPage = () => {


    const [fmrNo, setFmrNo] = useState('');
    const [docName, setDocName] = useState('');
    const [docGender, setDocGender] = useState('select');
    const [docfatherName, setDocfatherName] = useState('');
    const [doctorList, setDoctorList] = useState<any>([]);
    const [additionalList, setAdditionalList] = useState<any>([]);
    const [doctor, setDoctor] = useState<DoctorFormType>();
    const [isLoader, setIsLoader] = useState(false);
    const [view, setView] = useState(false);
    useEffect(() => {
        setDoctor(doctor);
    }, [doctor]);


    const getDoctorDetailsByFMR = async () => {
        try {
            if (fmrNo.length > 3) {
                setDoctorList([]);
                setIsLoader(true);
                const { data } = await commonService.getDoctorInfoByNameGender(fmrNo, '', '', '');
                if (data.length > 0) {
                    setIsLoader(false);
                    setDoctorList(data);
                    setView(false);
                } else {
                    setIsLoader(false);
                    alert("Doctor information not Found  For the entered FMR No ");
                }
            } else {
                alert("Please enter FMR No ");
            }

        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };
    const getDoctorInfoByNameGender = async () => {

        try {
            if (docName.length < 3) {
                alert("Please enter Name ");
                return false;
            } else if (docGender === "select") {
                alert("Please Select Gender");
                return false;
            } else {

                setDoctorList([]);
                setIsLoader(true);
                const { data } = await commonService.getDoctorInfoByNameGender('', docName, docGender, docfatherName);
                if (data.length > 0) {
                    setIsLoader(false);
                    setDoctorList(data);
                    setView(false);
                } else {
                    setIsLoader(false);
                    alert("Doctor information not Found  For the entered Data ");
                }
            }

        } catch (err) {
            console.log('error getDoctorDetails ', err);
        }
    };
    const printwindow = useCallback(async () => {
        window.print();
    }
        , []);


    return (
        <>
            <div className="container-fluid">
                <header className='tsmc-header' id="printPageButton">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <img src={SiteLogo} width="70" alt="" />
                                <div className="ms-4">
                                    <h1 className="mb-0 fs-20 fw-700 tsmc-text-white">TELANGANA STATE MEDICAL COUNCIL</h1>
                                    <div className="row">
                                        <p className="fs-14 tsmc-text-white">
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="bg-white border border-info mt-2" id="printPageButton">
                    <div className="row p-3 " id="printPageButton">
                        <div className="col-12">
                            <span className="input-group-text bg-white p-0 " style={{ marginLeft: "30px" }}>
                                <label htmlFor="" className='mb-2' style={{ color: "#1b42af" }}>Name<small className="text-danger">*</small>  </label>
                                <input type="text" className='fs-14 w-75 form-control' id="fmrNo" onBlur={(e) => setDocName(e.target.value)} placeholder='Search by Name' />
                                <label className="mb-2" style={{ color: "#1b42af" }}> Gender <small className="text-danger">*</small></label>
                                <select
                                    value={docGender}
                                    onChange={(ev) => {
                                        setDocGender(ev.target.value);

                                    }}
                                    className="form-select"
                                    required={true}
                                >
                                    <option value="select">Select</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>

                                </select>


                                <label htmlFor="" className='mb-2' style={{ color: "#1b42af" }}>Father Name   </label>
                                <input type="text" className='fs-14 w-75 form-control' id="fmrNo" onBlur={(e) => setDocfatherName(e.target.value)} placeholder='Search by Father Name' />
                                <button type="submit"

                                    onClick={
                                        getDoctorInfoByNameGender
                                    } className='btn btn-primary'>Search by Name</button>
                            </span>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center text-danger" id="printPageButton">
                        <div className="col-7" style={{ paddingLeft: "300px" }}>
                            OR
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center" id="printPageButton">
                        <div className="col-7 pl-5">
                            <span className="input-group-text bg-white p-0 " style={{ marginLeft: "30px" }}>
                                <label htmlFor="" className='mb-2' style={{ color: "#1b42af" }}>Final Medical Registration No :   </label>
                                <input type="text" className='fs-14 w-75 form-control' id="fmrNo" onBlur={(e) => setFmrNo(e.target.value)} placeholder='Enter FMR No as per Certificate' />
                                <button type="submit"
                                    onClick={
                                        getDoctorDetailsByFMR
                                    } className='btn btn-primary'>Search by Registration No</button>

                            </span>
                        </div>
                        <div className="col-1 pt-2">
                            <a className="link-danger" onClick={() => { window.location.reload() }} href="#">Refresh</a>
                        </div>

                    </div>
                </section>

                {isLoader ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-success mt-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>) :
                    <>
                        {doctorList.length > 0 && view === false ?
                            <>
                                <table className="table table-hover fs-12 table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Details</th>
                                            <th>Registration Number</th>
                                            <th>Registration Date</th>
                                            <th>Doctor Name</th>
                                            <th>Father Name	</th>
                                            <th>Date of Birth</th>
                                            <th>Communication Address</th>
                                            <th>Qualification</th>
                                            <th>M.B.B.S University </th>
                                            <th>M.B.B.S College</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctorList.map((obj: any) => {
                                            return (<tr>
                                                <td><a href="javascript:void(0);" onClick={() => {
                                                    setView(true);
                                                    setDoctor(obj);
                                                    setAdditionalList(obj.additionalList);
                                                }}>View</a></td>
                                                <td>{obj.original_fmr_no}</td>
                                                <td>{obj.regDate}</td>
                                                <td>{obj.fullname}</td>
                                                <td>{obj.fathername}</td>
                                                <td>{moment(obj.dateofbirth).format('DD/MM/YYYY')}</td>
                                                <td>{obj.address1} {obj?.address2}</td>
                                                <td>{obj.qualification}</td>
                                                <td>{obj.university}</td>
                                                <td>{obj.college}</td>
                                            </tr>)
                                        })
                                        }
                                    </tbody>
                                </table>
                            </> : ""}


                        {view ?
                            <div className="container-fluid">
                                <div style={{ paddingLeft: "1200px", paddingTop: "30px" }}>
                                    <button type="button" id="printPageButton"
                                        onClick={() => {
                                            setView(false);
                                        }} className='btn btn-outline-primary'><i className="bi bi-arrow-left-square-fill"></i> Back</button>
                                    <button type="button" id="printPageButton"
                                        onClick={() => {
                                            printwindow();
                                        }} className='btn btn-outline-primary'><i className="bi-printer-fill"></i> Print</button>
                                </div>

                                <div className="text-center">
                                    <img id="sample" src={colorLogo} />
                                    <br />
                                    <h4>
                                        TELANGANA STATE MEDICAL COUNCIL
                                    </h4>
                                    <hr />
                                </div>

                                <table className="table table-bordered table-responsive-sm text-left">
                                    <tbody><tr>
                                        <td className="tdwid1">
                                            <b>
                                                Doctor Name
                                            </b>

                                        </td>
                                        <td className="tdwid2">
                                            <b>
                                                <span id="Label_name" style={{ color: "Black" }}>{doctor?.fullname}</span>
                                            </b>

                                        </td>
                                    </tr>
                                        <tr>
                                            <td className="tdwid1">
                                                Father/Husband Name
                                            </td>
                                            <td className="tdwid2">
                                                <span id="Label_father">{doctor?.fathername}</span>
                                            </td>
                                        </tr>
                                    </tbody></table>
                                <table className="table table-bordered table-responsive-sm">
                                    <tbody><tr>
                                        <td className="tdwid4">
                                            Date of Birth
                                        </td>
                                        <td className="tdwid4">
                                            <span id="Label_dob">{doctor?.dateofbirth}</span>
                                        </td>
                                        <td className="tdwid4">
                                            Year of Examination
                                        </td>
                                        <td className="tdwid4">
                                            <span id="Label_interda1">{doctor?.yearofExam}</span>
                                        </td>
                                    </tr>
                                        <tr>
                                            <td className="tdwid4">
                                                <b>
                                                    Registration No
                                                </b>

                                            </td>
                                            <td className="tdwid4">
                                                <b>
                                                    <span id="Label_reg">{doctor?.original_fmr_no}</span>
                                                </b>

                                            </td>
                                            <td className="tdwid4">
                                                <b>
                                                    Date of Reg
                                                </b>

                                            </td>
                                            <td className="tdwid4">
                                                <b>
                                                    <span id="Label_regdate">{doctor?.regDate}</span>
                                                </b>

                                            </td>
                                        </tr>
                                    </tbody></table>
                                <table className="table table-bordered table-responsive-sm">
                                    <tbody><tr>
                                        <td className="tdwid4">
                                            <b>
                                                Valid Upto
                                            </b>
                                        </td>
                                        <td className="tdwid4">
                                            <b>
                                                <span id="Labelvaliddate" style={{ color: "#FF6600", fontSize: "Medium", fontWeight: "bold" }}>{doctor?.validDate}</span>
                                            </b>

                                        </td>
                                        <td className="tdwid4">
                                            <b>
                                                Registration Status
                                            </b>

                                        </td>
                                        <td className="tdwid4">
                                            <b>
                                                <span id="Labelregstatus" style={{ color: "#FF3300", fontSize: "Medium", fontWeight: "bold" }}>{doctor?.regStatus}</span>
                                            </b>

                                        </td>
                                    </tr>

                                    </tbody></table>
                                <table className="table table-bordered table-responsive-sm">
                                    <tbody><tr>
                                        <td className="tdwid4">
                                            Qualification
                                        </td>
                                        <td className="tdwid4">
                                            {doctor?.qualification}
                                        </td>
                                    </tr>
                                        <tr>
                                            <td className="tdwid4">
                                                University Name
                                            </td>
                                            <td className="tdwid4">
                                                <span id="Label_uniname">{doctor?.university}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="tdwid4">
                                                College Name
                                            </td>
                                            <td className="tdwid4">
                                                <span id="Label_clgname">{doctor?.college}</span>
                                            </td>
                                        </tr>
                                    </tbody></table>
                               
                           


{additionalList && additionalList.length > 0 ?
    <section><div>   </div>
{additionalList.map((add: any, i: any) => {
     return (<div key={i}>
        <table className="table table-bordered">
            <tbody><tr >
                <td className="tdwid4" >
                    <span style={{alignContent:"center",paddingLeft:"500px",fontWeight:"bold",color:"#1FAD84"}}>Additional Qualification :- {i+1}</span>
                </td>
            </tr>
            </tbody></table>
        <table className="table table-bordered">
            <tbody><tr>
                <td className="tdwid4">
                    <b>
                        Qualification
                    </b>

                </td>
                <td className="tdwid4">
                    <b>
                        <span >{add.qualification}</span>
                    </b>

                </td>
                <td className="tdwid4">
                    <b>
                        PG Registration Date
                    </b>

                </td>
                <td className="tdwid4">
                    <b>
                        <span >{add.reg_date}</span>
                    </b>

                </td>

            </tr>
            </tbody></table>
        <table className="table table-bordered">
            <tbody><tr>
                <td className="tdwid1">
                    Qualification Year
                </td>
                <td className="tdwid2">
                    <span >{add.exam_month}-{add.exam_year}</span>
                </td>
            </tr>
                <tr>
                    <td className="tdwid1">
                        University Name
                    </td>
                    <td className="tdwid2">
                        <span >{add.university}</span>
                    </td>
                </tr>
                <tr>
                    <td className="tdwid1">

                        College Name
                    </td>
                    <td className="tdwid2">
                        <span >{add.college}</span>
                    </td>
                </tr>
            </tbody></table>
    </div>)
})}
</section>
 : ""}
                   
                   </div>

                            : ""} 
                   
                    </>

                }
            </div>
        </>
    )
}

export default DoctorSearchPage;