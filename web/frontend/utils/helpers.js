import { EMAIL_REGEX } from "./regex";

const generateId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const uniqueId = `${timestamp}-${random}`;

    return uniqueId
}

const convertTaxesFrom = (item, total, discount) => {
    const itemTotal = item.fulfillable_quantity * item.price;
    const taxesOf = itemTotal - (itemTotal / total) * discount;
    return (item.tax_lines[0].rate / taxesOf) * 100;
}

const validateEmail = (value, setInputErrors, field = "email") => {
    return setInputErrors(field, [
        {
            condition: !value,
            message: "Required!",
        },
        {
            condition: !EMAIL_REGEX.test(value),
            message: "Email is not valid!",
        },
    ]);
};

export { generateId, convertTaxesFrom, validateEmail };