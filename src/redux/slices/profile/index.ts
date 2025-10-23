import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import type{Profile} from "@/types/user";


type ProfileState = {user: Profile | null};
const initialState: ProfileState = {user: null};



const slice = createSlice({
    name: "profile",
    initialState,
    reducers:{
        setProfile(state, actions: PayloadAction<Profile | null> ){
            state.user = actions.payload;
        },
        clearProfile(state){
            state.user = null;
        },
    },
});

export const {setProfile , clearProfile} = slice.actions;
export default slice.reducer;