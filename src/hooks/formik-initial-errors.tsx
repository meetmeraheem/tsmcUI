import { useState, useEffect } from 'react';
import { validateYupSchema, yupToFormErrors } from 'formik';

export default function useInitialErrors<T>(initialValues: T, validationSchema: any) {
    const [initialErrors, setInitialErrors] = useState({});

    useEffect(() => {
        async function checkInitialValues() {
            try {
                //await validateYupSchema(initialValues, validationSchema);
                setInitialErrors({});
            } catch (err) {
                setInitialErrors(yupToFormErrors(err));
            }
        }
        checkInitialValues();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues]);

    return initialErrors;
}
