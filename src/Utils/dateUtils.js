const getFormattedDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
};

module.exports = {getFormattedDateTime};