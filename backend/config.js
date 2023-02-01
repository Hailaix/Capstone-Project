const SECRET_KEY = process.env.SECRET_KEY || 'secret key';


const getDatabaseUri = () => {
    return (process.env.NODE_ENV === 'test') ? 'bookly_test' : 'bookly';
}

//reduce workfactor during testing to speed up tests
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV = 'test' ? 1 : 12;

module.exports = {
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
};