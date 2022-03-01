import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = ({ isSideBar }) => {
  return (
    isSideBar ?
      (
        <div className="sidebar shadow-lg">
          <ul>
            <li>
              <NavLink to="/admin/dashboard" activeClassName="selected-sidebar">
                <span>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/products" activeClassName="selected-sidebar">
                <span>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </span>
                <span>Product</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/orders" activeClassName="selected-sidebar">
                <span>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </span>
                <span>Order</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/users" activeClassName="selected-sidebar">
                <i className="fa fa-users"></i>
                <span>Users</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/authors" activeClassName="selected-sidebar">
                <i className="fas fa-user-tie"></i>
                <span>Authors</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/categories" activeClassName="selected-sidebar">
                <i className="fa fa-list-alt"></i>
                <span>Categories</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/seriesbooks" activeClassName="selected-sidebar">
                <i className="fas fa-book"></i>
                <span>Collection Books</span>
              </NavLink>
            </li>

          </ul>
        </div>
      ) : ""
  )
}

export default AdminSidebar;
