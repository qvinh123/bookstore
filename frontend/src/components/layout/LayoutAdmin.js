import React, { useState } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

const LayoutAdmin = ({ children }) => {
    const [isSideBar, setIsSideBar] = useState(true)

    const handleClickSideBar = () => {
        setIsSideBar(!isSideBar)
    }
    return (
        <>
            <AdminNavbar handleClickSideBar={handleClickSideBar} />
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className={`${isSideBar ? 'col-2' : ''} px-0`}>
                            <AdminSidebar isSideBar={isSideBar} />
                        </div>
                        <div className={`${isSideBar ? 'col-10' : 'col-12'}`}>
                            <div className="wrapper">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default LayoutAdmin;
