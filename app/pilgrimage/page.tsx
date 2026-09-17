"use client"

import { useSelector } from 'react-redux';
import FormCreatePilgrimage from './components/FormCreatePilgrimage';
import { RootState } from './../libs/interface';
import PilgrimageCalendar from './components/PilgrimageCalendar';

const Pilgrimage = () => {
    const user = useSelector((state: RootState) => state.auth);


    return (
        <>
        <div className='container'>
        {user && user.user?.role === 'admin' && (
            <FormCreatePilgrimage/>
         )} 
        <PilgrimageCalendar />
        </div>
        </>
    )
}

export default Pilgrimage;