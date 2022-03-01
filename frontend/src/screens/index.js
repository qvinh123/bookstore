import React from 'react'
import { Route, Switch } from 'react-router-dom'
import {
    Home, SeriesBook, ProductDetails, LastViews, Cart, ListSearch, Wishlist, Shipping, CofimOrder, OrderSuccess, ListOrders, OrderDetails, ProductsAuthor, Collections
} from "./Shop"

import { Login, SignUp, Profile, UpdateProfile, UpdatePassword, ForgetPassword, NewPassword } from "./user"

import { DashboardAdmin, ProductsAdmin, EditProductAdmin, NewProductAdmin, OrdersAdmin, OrderAdminDetails, UsersAdmin, ProductReviews, AuthorsList, CategoriesList, CollectionBook } from "./Admin"

import PageNotFound from './Shop/pageNotFound/PageNotFound'

import ProtectRoutes from "../routes/ProtectRoutes";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" component={Home} exact />

            <Route path="/account/register" component={SignUp} exact />
            <Route path="/account/login" component={Login} exact />

            <Route path="/search/:keyword" component={ListSearch} />

            <Route path="/authors/:slug" component={ProductsAuthor} />
            <Route path="/categories/:slug" component={Collections} />
            <Route path="/seriesbook/:slug" component={SeriesBook} />
            <Route path="/tat-ca-san-pham" component={Collections} />

            <Route path="/products/:slugName" component={ProductDetails} />

            <Route path="/pages/san-pham-da-xem" component={LastViews} />

            <Route path="/password/reset/:token" component={NewPassword} />

            <Route path="/password/forget" component={ForgetPassword} exact />

            <ProtectRoutes path="/profile" component={Profile} />

            <ProtectRoutes path="/me/update" component={UpdateProfile} />

            <ProtectRoutes path="/password/update" component={UpdatePassword} exact />
            <ProtectRoutes path="/order/me" component={ListOrders} />
            <ProtectRoutes path="/orders/:id" component={OrderDetails} />

            <ProtectRoutes path="/cart" component={Cart} />

            <ProtectRoutes path="/wishlist" component={Wishlist} />

            <ProtectRoutes path="/shipping" component={Shipping} />
            <ProtectRoutes path="/cofirmOrder" component={CofimOrder} />
            <ProtectRoutes path="/orderSuccess" component={OrderSuccess} />

            <ProtectRoutes path="/admin/dashboard" component={DashboardAdmin} isAdmin={true} />

            <ProtectRoutes path="/admin/products" component={ProductsAdmin} exact isAdmin={true} />
            <ProtectRoutes path="/admin/product/new" component={NewProductAdmin} isAdmin={true} />
            <ProtectRoutes path="/admin/products/:id" component={EditProductAdmin} isAdmin={true} />
            <ProtectRoutes path="/admin/product/reviews/:id" component={ProductReviews} isAdmin={true} />
            <ProtectRoutes path="/admin/orders" component={OrdersAdmin} isAdmin={true} exact />
            <ProtectRoutes path="/admin/orders/:id" component={OrderAdminDetails} isAdmin={true} />
            <ProtectRoutes path="/admin/users" component={UsersAdmin} isAdmin={true} />
            <ProtectRoutes path="/admin/authors" component={AuthorsList} isAdmin={true} />
            <ProtectRoutes path="/admin/categories" component={CategoriesList} isAdmin={true} exact={true} />
            <ProtectRoutes path="/admin/seriesbooks" component={CollectionBook} isAdmin={true} exact={true} />

            <Route path="*" component={PageNotFound} />


        </Switch>
    )
}

export default Routes
