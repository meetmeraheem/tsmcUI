import React from 'react'
import  './../../assets/styles/styles.css';

const ChairmanWidget = (props:any) => {
  

  return (
    <>
      
  
  <div className="card tsmccard 1">
  <div className="card-body text-center" style={{paddingTop: "85px"}} >
  <div className="card_title" style={{fontSize:"16px", color:"#131314"}}>  
    <p>{props.title}</p>
  </div>
  <div className="card_image" style={{paddingTop: "5px"}} > 
  <img id="sample" src={props.image} />
  </div>
  
 
  <div className="row p-0">
              <div className="col">
                <div className="text-uppercase  small text-primary fw-bold">Pending</div>
                <div className="fs-5 fw-semibold">{props.Pending}</div>
                
              </div>
              <div className="col">
              <div className="vr" style={{height: "50px"}}></div>
              </div>
              <div className="col">
              <div className="text-uppercase  small text-warning fw-bold">Verified</div>
                <div className="fs-5 fw-semibold">{props.Verified}</div>
              
              </div>
              </div>  
              <hr></hr>
              <div className="row p-0">
              <div className="col p-0">
              <div className="text-uppercase small text-success fw-bold pt-4">Approved</div>
                <div className="fs-5 fw-semibold">{props.Approved}</div>
                
              </div>
              <div className="col" >
              <div className="vr" style={{height: "60px"}}></div>
              </div>
              <div className="col p-0">
              <div className="text-uppercase small text-danger fw-bold">Not Approved</div>
                <div className="fs-5 fw-semibold">{props.Rejected}</div>
              </div>
              </div>
              </div>
          </div>  
    </>
  )
}

export default ChairmanWidget;
