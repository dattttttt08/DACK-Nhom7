import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Kiểm tra email đã tồn tại chưa
      const checkRes = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(formData.email)}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        setError("Email đã được đăng ký!");
        return;
      }

      // Tạo ID mới
      const allUsersRes = await fetch("http://localhost:3001/users");
      const allUsers = await allUsersRes.json();
      const newId = allUsers.length > 0 ? (parseInt(allUsers[allUsers.length - 1].id) + 1).toString() : "1";

      // Thêm user mới vào db.json
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          name: formData.username, // Lưu username làm name
          email: formData.email,
          password: formData.password,
          favorites: [],
          readBooks: []
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("storage")); // Cập nhật Header
        navigate("/");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server. Vui lòng thử lại sau!");
    }
  };

  return (
    document.title = "Đăng ký - Seven.Library",
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

        {/* Form đăng ký */}
        <div className="col-12 col-md-6">
          <h1 className="text-center mb-4 text-primary">Chào mừng đến Seven.Library</h1>
          <h5 className="text-center mb-4 text-primary">Thế giới đang nằm trong tầm mắt của bạn</h5>
          <h3 className="text-center mb-4">Đăng Ký</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div className="mb-3">
              <label className="form-label">Tên người dùng</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên người dùng"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Đăng ký
            </button>

            <p className="mt-3 text-center">
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
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

export default Register;