import  './../../assets/styles/styles.css';
import TSMC from '../../assets/images/TSMC_LOGO.jpg';
import Select from 'react-select';
import { useCallback, useEffect,  useState } from 'react';
import ChairmanWidget from "./ChairmanWidget";
import { commonService } from '../../lib/api/common';
import { UserRole } from "../../types/common";
import { assignmentService } from "../../lib/api/assignments";
import moment from "moment";
import TatCheckbox from './../../components/TatCheckbox';

const ChairmanDashboard = () => {

  const [dataList, setdataList] = useState<any>();
    let defaultDate = moment().subtract(120,'d').format('YYYY-MM-DD');
    let default7Days = moment().add(1,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(defaultDate);
    const [todate, setToDate] = useState(default7Days);
    const [users, setUsers] = useState<UserRole[]>([]);
    const [assignedUser, setAssignedUser] = useState(0);
    const [istatkal, setIsTatkal] = useState('nor');
    const [isCheckbox, setIsCheckbox] = useState(false);
    const [isLoader, setIsLoader] = useState(false);

  const getDashboardDetails = useCallback(async (fromdate:any,todate:any,assignedUser:any,istatkal:any) => {
    try {
        setIsLoader(true);
      const { data } = await commonService.getDashboardData(fromdate,todate,assignedUser,istatkal);
            if (data) {
                setIsLoader(false);
              setdataList(data);
            }
    }
   catch (err) {
    setIsLoader(false);
    console.log('error getDashboardDetails', err);
  }}, []);

  const handleChangeTatkal = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setIsTatkal('tat');
    } else {
        setIsTatkal('nor');
    }
    setIsCheckbox(e.target.checked);
};
  const getUsersByRole = useCallback(async () => {
    try {
        const { data } = await assignmentService.getUsersByRole();
        if (data.length > 0) {
          data.push(
            {id:0, username:"All", role_name:"All",user_type:"All",status:""},
           );
            setUsers(data);
        }
    } catch (err) {
        console.log('error get users by role', err);
    }
}, []);
  useEffect(() => {
    getUsersByRole();
    
    getDashboardDetails(fromdate,todate,assignedUser,istatkal);
}, [fromdate,todate,assignedUser,istatkal]);
    return (
    <>
   
    <div >
    <div className="row">
    <div className="col">
              <span className="p-0">
                        <label>From Date </label>
                            <input type="date" name="" id=""
                                value={fromdate}
                                onChange={(ev) => {
                                    setFromDate(ev.target.value);
                                }} className="form-control" />
                        </span>
                 </div>  
                 <div className="col">
                        <span className="col  p-0">
                        <label>To Date </label>
                            <input type="date" name="" id=""
                                value={todate}
                                onChange={(ev) => {
                                    setToDate(ev.target.value);
                                }} className="form-control" />
                        </span>
                    </div>           
                    <div className="col pt-3">
                        <span className="input-group-text ">
                        <div className="btn-group text-center" >
                            <label className="m-1">Tatkal</label>
                            
                                <TatCheckbox
                                    handleChange={handleChangeTatkal}
                                    isChecked={isCheckbox}
                                    label=""

                                />
                            
                        </div>
                    </span>
                    </div>
                        <div className="col">
                        <label>Users </label>
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
                                
                            </div>
                        </div>   
                        {isLoader ? (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border text-success mt-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>) :
                    <>
                        {dataList&& <div className="cards-list">
  <ChairmanWidget image={TSMC}title={"Provisionals(PMR)"}Pending={dataList.provisionalPenCnt} Verified={dataList.provisionalVerCnt} Approved={dataList.provisionalAprCnt} Rejected={dataList.provisionalRejCnt} />
  <ChairmanWidget image={TSMC}title={"Final(FMR)"}Pending={dataList.finalPenCnt} Verified={dataList.finalVerCnt} Approved={dataList.finalAprCnt} Rejected={dataList.finalRejCnt} />
  <ChairmanWidget image={TSMC}title={"Additional Qual"}Pending={dataList.additionalPenCnt} Verified={dataList.additionalVerCnt} Approved={dataList.additionalAprCnt} Rejected={dataList.additionalRejCnt} />
  <ChairmanWidget image={TSMC}title={"Renewals"}Pending={dataList.renewalPenCnt} Verified={dataList.renewalVerCnt} Approved={dataList.renewalAprCnt} Rejected={dataList.renewalRejCnt} />
  <ChairmanWidget image={TSMC}title={"Noc"}Pending={dataList.nocPenCnt} Verified={dataList.nocVerCnt} Approved={dataList.nocAprCnt} Rejected={dataList.nocRejCnt} />
  <ChairmanWidget image={TSMC}title={"Good Standing"}Pending={dataList.gsPenCnt} Verified={dataList.gsVerCnt} Approved={dataList.gsAprCnt} Rejected={dataList.gsRejCnt} />
  </div>            }  

  </>               }
  </div>
  



    </>
  )
}

export default ChairmanDashboard;
