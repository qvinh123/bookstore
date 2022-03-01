import React from 'react'

import { useSelector } from "react-redux"
import { userSelector } from '../../redux/selectors/userSelector'

import Figure from '../../components/Figure/Figure'
import Button from '../../components/Button/Button'
import MetaData from '../../components/MetaData/MetaData'
import Layout from '../../components/layout/Layout'

const Profile = () => {
    const { user } = useSelector(userSelector)

    return (
        <>
            <MetaData title="Hồ sơ của bạn" />
            {
                user &&
                <Layout>
                    <div className="wrapper">
                        <div className="profile">
                            <h2>Hồ sơ</h2>
                            <div className="row justify-content-around my-4">
                                <div className="col-12 col-lg-3 col-md-4">
                                    <div className="user-img">
                                        <Figure width="16rem" height="16rem" image={user?.avatar?.url} />
                                        <div className="profile-action mt-4 text-center w-100">
                                            <Button to="/me/update" bg="#17a2b8" width="100%">
                                                Thay đổi hồ sơ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-12 col-md-5">
                                    <div className="user-info">
                                        <h4>Tên tài khoản</h4>
                                        <p>{user.name}</p>
                                        <h4>Email</h4>
                                        <p>{user.email}</p>
                                        <h4>Ngày tham gia</h4>
                                        <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="profile-action mt-4 d-flex flex-column">
                                        <Button to="/order/me" bg="#ffc107">
                                            Đơn mua
                                        </Button>

                                        <Button to="/password/update">
                                            Thay đổi mật khẩu
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            }
        </>
    )
}

export default Profile
