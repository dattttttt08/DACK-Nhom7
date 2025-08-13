import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3001/users?email=${formData.email}&password=${formData.password}`
      );
      const data = await res.json();

      if (data.length > 0) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        navigate("/");
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      setError("Lỗi kết nối tới server!");
    }
  };

  return (
    document.title = "Đăng nhập - Seven.Library",
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Posters bên trái */}
        <div className="col-12 col-md-3 text-center">
          <div className="d-flex flex-column gap-3">
            <img
              src="../../src/Img/Poster1.webp"
              alt="Poster Thư viện 1"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "300px", height: "800px", objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="col-12 col-md-3 text-center">
          <div className="d-flex flex-column gap-3">
            <img
              src="../../src/Img/Poster2.webp"
              alt="Poster Thư viện 2"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "300px", height: "800px", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Form đăng nhập */}
        <div className="col-12 col-md-6">
          <h1 className="text-center mb-4 text-primary">
            Chào mừng đến Seven.Library
          </h1>
          <h5 className="text-center mb-4 text-primary">Thế giới đang nằm trong tầm mắt của bạn</h5>
          <h3 className="text-center mb-4">Đăng nhập</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="border p-4 rounded shadow" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Đăng nhập
            </button>

            <p className="text-center mt-3">
              Chưa có tài khoản? <Link to="/dangky">Đăng ký ngay</Link>
            </p>
            <p className="text-center mt-3">
              Hoặc <Link to="/">quay lại trang chủ</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;