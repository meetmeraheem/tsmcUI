import { useCallback, useEffect, useState } from 'react';
import { commonService } from '../../../lib/api/common';
import Swal from 'sweetalert2';
import moment from "moment";
const TatKalDateUpdate = () =>{
    
    const [formFields, setFormFields] = useState<any>([
    { date: moment().format('YYYY-MM-DD'), daily_count_aqn_frn:'',daily_count_others: '' },
  ])

  
  const [TatkaldataList, setTatkaldataList] = useState<any>([]);
    let defaultDate = moment().subtract(3,'d').format('YYYY-MM-DD');
    let default7Days = moment().add(10,'d').format('YYYY-MM-DD');
    const [fromdate, setFromDate] = useState(defaultDate);
    const [todate, setToDate] = useState(default7Days);

  const handleFormChange = (event:any, index:any) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  useEffect(() => {
    getTatkalDetails();
}, []);
  const submit = async (e:any) => { 
    e.preventDefault();
    console.log(formFields)
    const formData = new FormData();
    formData.append("tatkalInfo", JSON.stringify(formFields));
    const { success } = await commonService.saveTatkalData(formData);
    if (success) {
        Swal.fire({
            title: "Success",
            text: "Saved success Fully",
            icon: "success",
            confirmButtonText: "OK",
        })
        getTatkalDetails();
    } else {
      Swal.fire({
        title: "error",
        text: "Failed to Update",
        icon: "error",
        confirmButtonText: "OK",
    })
    }

  }

  const addFields = () => {
    let data = [...formFields];
    if(data.length !== undefined){
      let  cnt=data.length-1;
      console.log("test "+cnt);
        if(data.length !==0 && data[cnt].daily_count_aqn_frn!== "" && data[cnt].daily_count_others!== "") {
            let object = {
                date: moment().add(data.length,'day').format('YYYY-MM-DD'),
                daily_count_aqn_frn:'',
                daily_count_others: ''
              }
              setFormFields([...formFields, object])
        }else{
            Swal.fire({
                title: "",
                text: "Please enter Count",
                icon: "warning",
                confirmButtonText: "OK",
            })
        }
    }
   
  }

  const getTatkalDetails = useCallback(async () => {
    try {
            const { data } = await commonService.getTatkalDailyData(fromdate,todate);
            if (data.length > 0) {
              setTatkaldataList(data);
            }
    } catch (err) {
        console.log('error getProvisionalDetails', err);
    }
}, []);

  const removeFields = (index:any) => {
    let data = [...formFields];
    if(data.length >1){
        data.splice(index, 1);
        setFormFields(data);
    }
  }

  return (
    <div className="App">


{TatkaldataList.length > 0 &&
                                            <>
                                                <div className="mb-5">
                                                    <div className="tsmc-text">
                                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                                            <h1 className='fs-18 fw-700 mb-0'>Tatkal Daily Limit Details</h1>
                                                        </div>
                                                    </div>

                                                    <table className="table table-hover fs-11 table-bordered">
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th> Additional and Final Registrations</th>
                                                                <th> Provisional, Renewal, GS and NOC </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {TatkaldataList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{obj.date}</td>
                                                                    <td>{obj.daily_count_aqn_frn}
                                                                    </td>
                                                                    <td>{obj.daily_count_others}
                                                                    </td>
                                                                </tr>);
                                                            })}
                                                        </tbody></table>
                                                </div>
                                            </>

                                        }

      <form onSubmit={submit}>
        {formFields.map((form:any, index:any) => {
          return (
                 <div className="mb-3 row" key={index}>
                   <div className="col">Date
                            <input type="date" name="date" id="date"
                                value={form.date}
                                onChange={event => handleFormChange(event, index)}
                                 className="form-control" />
                </div>          
                <div className="col"> Additional and Final Registrations      
              <input
                name='daily_count_aqn_frn'
                placeholder='Count for Additional_FMR '
                onChange={event => handleFormChange(event, index)}
                value={form.count_aqn_frn}
              />
              </div> 
                                                               
              <div className="col">    Provisional, Renewal, GS and NOC 
              <input
                name='daily_count_others'
                placeholder='Count for others '
                onChange={event => handleFormChange(event, index)}
                value={form.count_others}
              />
              </div>
            <div className="col">       
              <button onClick={() => removeFields(index)}>Remove</button>
             </div>
            </div>
          )
        })}
      </form>
      <button onClick={() =>addFields()}>Add More..</button>
     <span style={{paddingLeft:'500px'}}> <button type='submit' onClick={submit}>Submit</button></span>
    </div>
  );
}

export default TatKalDateUpdate;