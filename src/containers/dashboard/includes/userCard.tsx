import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';




const UserCard = (props:any) => {
	const [adminPrimaryId, setAdminPrimaryId] = useState(0);
	
	useEffect(() => {
        
    }, []);
    return (


<div className="container">
 <div className='row'>   
<div className="col-lg-3 col-sm-6" >
            <div className="row user-card-box bg-blue">
            <div className="col mb-8 pt-2">
                        <h5 className="card-title mb-0">Pending</h5>
                    </div>
                <div className="col">
                    <h3 className="pt-2"> {props.Pending}</h3>
                </div>
            </div>
        </div>
        <div className="col-lg-3 col-sm-6">   
            <div className="row user-card-box bg-green">
            <div className="col mb-8 pt-2">
                        <h5 className="card-title mb-0">Verified</h5>
                    </div>
                <div className='col'>
                <h3 className="pt-2"> {props.Verified} </h3>
                </div>
                <div className="icon">
                    <i className="fa fa-money" aria-hidden="true"></i>
                </div>
            </div>
        </div>
</div>
    </div>
          
    )
}

export default UserCard;