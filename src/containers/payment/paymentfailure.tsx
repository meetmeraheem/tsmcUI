import { useEffect, useState } from "react";

const PaymentFailure = () => {
    const [value, setValue] = useState(16003);

    useEffect(() => {
        const conditions = [4000, 8000, 12000, Infinity];
        let test = 0;
        let chrgeAmount = 4000;
        if(value < chrgeAmount)
        {

        }
        else{
            setValue(Math.floor(value/chrgeAmount));
        }
        // for (const condition of conditions) {
        //   if (value > condition) {
        //     if (condition === Infinity) {
        //       setValue((prevValue) => prevValue + Infinity);
        //     } else {
        //         test = test + 100
        //       setValue((prevValue) => prevValue + test);
        //     }
        //   }
        // }
      }, []);
      
    return (
        <>
            <div>{value}</div>
            <section className='gray-banner'>
                <div className="container mt-4">
                    <div className="card shadow border-0">
                        <div className="card-body">
                            <div className="w-100">
                                <h1 className='fs-22 fw-700'>Payment Failure</h1>
                                <hr />
                            </div>
                            <div className="px-3">

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
};
export default PaymentFailure;