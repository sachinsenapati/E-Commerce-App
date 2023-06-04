import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const datas = localStorage.getItem("auth");
  const parseData = JSON.parse(datas);
  const token = parseData.token;
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [seleted, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleDelete = async (_id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/category/delete-category/${_id}`,
        {
          method: "DeLETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await res.json();
      console.log(result);
      if (result.status) {
        getCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/category/update-category/${seleted._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
          }),
        }
      );
      const result = await res.json();
      console.log(result);
      if (result.status) {
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/api/category/create-category`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );
      const result = await res.json();
      console.log(result);
      if (result.status) {
        getCategory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [category, setCategory] = useState([]);
  const getCategory = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/category/getall-category"
      );
      const req = await res.json();
      console.log(req.categories);
      setCategory(req.categories);
      console.log(category);
      return req;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {category.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-3"
                          onClick={() => [
                            setVisible(true),
                            setUpdatedName(c.name),
                            setSelected(c),
                          ]}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger ms-3"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Modal
            onCancel={() => setVisible(false)}
            footer={null}
            open={visible}
          >
            <CategoryForm
              value={updatedName}
              setValue={setUpdatedName}
              handleSubmit={handleUpdate}
            />
          </Modal>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
