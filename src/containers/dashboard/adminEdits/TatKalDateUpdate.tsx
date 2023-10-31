import { useCallback, useEffect, useState } from 'react';
import { commonService } from '../../../lib/api/common';
import Swal from 'sweetalert2';
import moment from "moment";
const TatKalDateUpdate = () =>{
    
    const [formFields, setFormFields] = useState<any>([
    { date: moment().format('YYYY-MM-DD'), count: '' },
  ])

  const [TatkaldataList, setTatkaldataList] = useState<any>([]);
    let defaultDate = moment().subtract(3,'d').format('YYYY-MM-DD');
    let default7Days = moment().add(3,'d').format('YYYY-MM-DD');
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
       
    } else {
        
    }

  }

  const addFields = () => {
    let data = [...formFields];
    if(data.length !== undefined){
      let  cnt=data.length-1;
        if(data.length !==0 && data[cnt].count!== "") {
            console.log("test "+data[cnt].count);
            let object = {
                date: moment().add(data.length,'day').format('YYYY-MM-DD'),
                count: ''
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
    data.splice(index, 1)
    setFormFields(data)
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
                                                                <th>Tatkal Day Limit</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {TatkaldataList?.map((obj: any) => {
                                                                return (<tr>
                                                                    <td>{obj.date}</td>
                                                                    <td>{obj.count}
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
                   <div className="col">
                            <input type="date" name="date" id="date"
                                value={form.date}
                                onChange={event => handleFormChange(event, index)}
                                 className="form-control" />
                </div>          
                <div className="col">       
              <input
                name='count'
                placeholder='Count'
                onChange={event => handleFormChange(event, index)}
                value={form.count}
              />
              </div>
            <div className="col">       
              <button onClick={() => removeFields(index)}>Remove</button>
              </div>
            </div>
          )
        })}
      </form>
      <button onClick={()=>addFields()}>Add More..</button>
      <br />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default TatKalDateUpdate;