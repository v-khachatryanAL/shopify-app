import { useCallback, useState } from "react";

export const useValidation = ({ initialState }) => {
    const [errors, setErrors] = useState({
        ...initialState
    });

    const setInputErrors =
        useCallback(
            (field, conditions = []) => {

                const isValid = conditions.every(cond => {
                    if (cond.condition) {
                        setErrors(prev => ({
                            ...prev,
                            [field]: cond.message
                        }));
                    }
                    return !cond.condition;
                });

                if (isValid) {
                    setErrors(prev => ({
                        ...prev,
                        [field]: ""
                    }));
                }

                return isValid;
            }, [errors]
        );

    const checkValidation = (validations) => {
        return validations.every(validation => validation);
    }

    return { setInputErrors, errors, checkValidation };

};