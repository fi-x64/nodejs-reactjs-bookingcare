import axios from '../axios'
import authHeader from './auth-header';
const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword })
}

const handleGoogleLoginApi = (googleResponse) => {
    return axios.post('/api/google-login', { googleResponse })
}

const handleRegisterApi = (data) => {
    return axios.post('/api/register', data)
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: { id: userId },
    });
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const updateUserInfo = (inputData) => {
    return axios.post('/api/update-user-info', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
}

const saveDetailDoctorService = (data) => {
    return axios.post('/api/save-infor-doctors', data);
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data);
}

const getScheduleDoctorByDate = (inputId, date) => {
    return axios.get(`/api/get-schedule-by-date?doctorId=${inputId}&date=${date}`);
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data);
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data);
}

const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data);
}

const getAllSpecialty = (data) => {
    return axios.get(`/api/get-all-specialty`);
}

const getSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data);
}

const getAllClinic = (data) => {
    return axios.get(`/api/get-all-clinic`);
}

const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}

const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data);
}

const searchData = (searchData) => {
    return axios.get(`/api/search?search_query=${searchData}`);
}

const getAllGender = () => {
    return axios.get(`/api/get-all-gender`);
}

const checkEmail = (data) => {
    return axios.post(`/api/check-email`, data);
}

const postVerifyRecoverPassword = (data) => {
    return axios.post(`/verify-password-recover`, data);
}

const handleChangePassword = (data) => {
    return axios.post(`/api/change-password-recover`, data);
}

const getCommentDoctor = (doctorId) => {
    return axios.get(`/api/get-comment-doctor?doctorId=${doctorId}`);
}

const checkUserComment = (doctorId, patientId) => {
    return axios.get(`/api/check-user-comment?doctorId=${doctorId}&patientId=${patientId}`);
}

const handleComment = (data) => {
    return axios.post(`/api/handle-comment`, data);
}

const handleDeleteComment = (comentId) => {
    return axios.get(`/api/delete-comment?commentId=${comentId}`);
}

const getDoctorPayment = (doctorId) => {
    console.log("Check doctorId: ", doctorId);
    return axios.get(`/api/get-doctor-payment?doctorId=${doctorId}`);
}

const processPayment = (data) => {
    return axios.post(`/api/process-payment`, data);
}

const handleStatisticBookingWeek = () => {
    return axios.get(`/api/statistic-booking-week`);
}

const handleStatisticPatientAddress = () => {
    return axios.get(`/api/statistic-patient-address`);
}

export {
    handleLoginApi, handleRegisterApi,
    getAllUsers,
    createNewUserService, editUserService,
    deleteUserService, getAllCodeService,
    getTopDoctorHomeService, getAllDoctorsService,
    saveDetailDoctorService, getDetailInforDoctor,
    saveBulkScheduleDoctor, getScheduleDoctorByDate,
    getExtraInforDoctorById, getProfileDoctorById,
    postPatientBookAppointment, postVerifyBookAppointment,
    createNewSpecialty, getAllSpecialty,
    getSpecialtyById, createNewClinic,
    getAllClinic, getDetailClinicById,
    getAllPatientForDoctor, postSendRemedy,
    handleGoogleLoginApi, searchData,
    getAllGender, updateUserInfo,
    checkEmail, postVerifyRecoverPassword,
    handleChangePassword, getCommentDoctor,
    checkUserComment, handleComment,
    handleDeleteComment, getDoctorPayment,
    processPayment, handleStatisticBookingWeek,
    handleStatisticPatientAddress
};