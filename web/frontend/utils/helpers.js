const generateId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const uniqueId = `${timestamp}-${random}`;

    return uniqueId
}

export { generateId };