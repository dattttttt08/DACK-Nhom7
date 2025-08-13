import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string;
  summary: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  favorites?: number[];
  readBooks?: number[];
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Đảm bảo id là string và không undefined
      if (parsedUser.id && typeof parsedUser.id === 'string') {
        setUser({ id: parsedUser.id, name: parsedUser.name || '', email: parsedUser.email, password: parsedUser.password, favorites: parsedUser.favorites || [], readBooks: parsedUser.readBooks || [] });
        setNewName(parsedUser.name || '');
        // Lấy favorites và readBooks từ API
        axios.get(`http://localhost:3001/users/${parsedUser.id}`)
          .then(response => {
            const userData = response.data;
            setFavorites(getBooksByIds(userData.favorites || []));
            setReadBooks(getBooksByIds(userData.readBooks || []));
          })
          .catch(error => console.error('Lỗi khi lấy thông tin người dùng:', error));
      }
    }
  }, []);

  const getBooksByIds = (ids: number[]) => {
    // Placeholder: Lấy sách từ state books theo ID
    return books.filter(book => ids.includes(book.id));
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      setError('Vui lòng nhập tên mới!');
      return;
    }

    if (!user?.id) {
      setError('Không tìm thấy thông tin người dùng!');
      return;
    }

    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, { name: newName });
      const updatedUser = { ...user, name: newName };
      localStorage.setItem("newName", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSuccess('Tên đã được cập nhật thành công!');
      setError('');
    } catch (err) {
      setError('Lỗi khi cập nhật tên!');
    }
  };

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    document.title = "Thông Tin Tài Khoản - Seven.Library",
    <>
      <div className="container" style={{ paddingTop: '70px' }}>
        <h2 className="my-4">Thông Tin Tài Khoản</h2>

        {/* Phần đổi tên */}
        <form onSubmit={handleChangeName} className="mb-4">
          <div className="mb-3">
            <label htmlFor="newName" className="form-label">Tên Người Dùng</label>
            <input
              type="text"
              className="form-control"
              id="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên mới"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary">Đổi Tên</button>
        </form>

        {/* Sách yêu thích */}
        <h3 className="my-4">Sách Yêu Thích</h3>
        <div className="row">
          {favorites.map((book) => (
            <div key={book.id} className="col-md-3 mb-3">
              <div className="card">
                <img src={book.image} className="card-img-top" alt={book.title} />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.summary.slice(0, 100)}...</p>
                  <Link to="/read-book" className="btn btn-primary">Đọc Ngay</Link>
                </div>
              </div>
            </div>
          ))}
          {favorites.length === 0 && <p>Chưa có sách yêu thích nào.</p>}
        </div>

        {/* Sách đã đọc */}
        <h3 className="my-4">Sách Đã Đọc</h3>
        <div className="row">
          {readBooks.map((book) => (
            <div key={book.id} className="col-md-3 mb-3">
              <div className="card">
                <img src={book.image} className="card-img-top" alt={book.title} />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.summary.slice(0, 100)}...</p>
                  <Link to="/read-book" className="btn btn-primary">Đọc Lại</Link>
                </div>
              </div>
            </div>
          ))}
          {readBooks.length === 0 && <p>Chưa có sách đã đọc nào.</p>}
        </div>
      </div>
    </>
  );
};

export default UserProfile;