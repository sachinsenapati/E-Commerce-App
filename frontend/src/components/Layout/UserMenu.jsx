import React from 'react'
import { Link } from 'react-router-dom';
const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        <ul className="list-group">
          <h4>Dashboard</h4>
          <Link
            to="/dashboard/user/profile"
            className="list-group-item"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/user/order"
            className="list-group-item"
          >
            Your Orders
          </Link>
        </ul>
      </div>
    </>
  );
}

export default UserMenu
