import actionTypes from '../actions/actionTypes';
import { getAllCodeService } from '../../services/userService';

const initialState = {
    isLoadingGender: false,
    gender: [],
    roles: [],
    positions: []
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyState = { ...state };
            copyState.isLoadingGender = true;
            console.log('Fire fetch gender start: ', action);

            return {
                ...copyState,
            }

        case actionTypes.FETCH_GENDER_SUCCESS:
            state.genders = action.data;
            state.isLoadingGender = false;

            return {
                ...state,
            }

        case actionTypes.FETCH_GENDER_FAILED:
            console.log('Fire fetch gender failed: ', action);
            state.isLoadingGender = false;
            state.genders = []

            return {
                ...state,
            }

            case actionTypes.FETCH_POSITION_START:
                state.isLoadingGender = true;
                console.log('Fire fetch position start: ', action);
    
                return {
                    ...state,
                }

        case actionTypes.FETCH_POSITION_SUCCESS:
            state.positions = action.data;

            return {
                ...state,
            }

        case actionTypes.FETCH_POSITION_FAILED:
            state.positions = []

            return {
                ...state,
            }

            case actionTypes.FETCH_ROLE_START:
                state.isLoadingGender = true;
                console.log('Fire fetch role start: ', action);
    
                return {
                    ...state,
            }

        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;

            return {
                ...state,
            }

        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = []

            return {
                ...state,
            }
        default:
            return state;
    }
}

export default adminReducer;