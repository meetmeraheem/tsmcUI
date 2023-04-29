import React from 'react'
import { Link } from 'react-router-dom'

const Refund = () => {
    return (
         <>
          <section className='gray-banner d-flex align-items-center justify-content-center'>
				<div className="card col-6 m-auto border-0 shadow-sm">
					<div className='card-body'>
						<div className="w-100 text-center border-bottom mb-3">
							<h1 className='fs-20 fw-700'>Cancellation and Refund Policy</h1>
						</div>
                        <p>Telangana State Medical Council has a limited cancellation and refund policy. A refund excluding payment gateway charges and service charges (if any) will be issued in cases where a certificate or service/s cannot be awarded or provided due to technical difficulties, procedural difficulties and any other administrative reasons.</p>
					</div>
				</div>
			</section>
         </>
    )
}

export default Refund