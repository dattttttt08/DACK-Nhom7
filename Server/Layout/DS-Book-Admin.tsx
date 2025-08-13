import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../src/Style/dss.css";
import Header from "../Component/Header"; // Thêm dòng này


function DSBook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBook, setSelectedBook] = useState<{
    id: number;
    title: string;
    author: string;
    category: string;
    status: string;
    image: string;
    summary: string;
  } | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    status: 'Đang Thảo Luận',
    image: '',
    summary: ''
  });

  interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    status: string;
    image: string;
    summary: string;
  }

  // Hiệu ứng để cập nhật tiêu đề trang và lấy dữ liệu sách
  useEffect(() => {
    document.title = "Danh Sách Sách - Seven.Library - Admin";
    // Lấy danh sách sách từ API
    axios.get('http://localhost:3001/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  // Hiện thị chi tiết sách khi người dùng click vào một cuốn sách
  const handleShowBookDetail = (book: Book) => {
    setSelectedBook(book);
  };

  // Xử lý sự kiện khi người dùng click vào nút sửa để hiện thị thông tin sách trong modal
  // và cho phép chỉnh sửa thông tin sách
  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
  };

  // Xử lý sự kiện khi người dùng click vào nút xóa để xóa sách khỏi danh sách
  // và cập nhật danh sách sách
  const handleDeleteBook = (id: number | string) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      axios.delete(`http://localhost:3001/books/${id}`)
        .then(() => {
          setBooks(books.filter(book => Number(book.id) !== Number(id)));
          setSelectedBook(null);
        })
        .catch(error => console.error('Lỗi khi xóa:', error));
    }
  };

  // Lưu thay đổi sách khi người dùng chỉnh sửa thông tin sách trong modal
  // và cập nhật danh sách sách
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBook && selectedBook.id) {
      axios.put(`http://localhost:3001/books/${selectedBook.id}`, selectedBook)
        .then(() => {
          setBooks(books.map(book => book.id === selectedBook.id ? selectedBook : book));
          // Đóng modal sau khi lưu
        })
        .catch(error => console.error('Lỗi khi lưu:', error));
    }
  };

  // Modal thêm sách
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    // Tạo id mới là chuỗi
    const newId = books.length > 0 ? (Math.max(...books.map(b => Number(b.id))) + 1).toString() : "1";
    const bookToAdd = { ...newBook, id: newId }; // id là string
    axios.post('http://localhost:3001/books', bookToAdd)
      .then(res => {
        setBooks([...books, res.data]);
        setNewBook({
          title: '',
          author: '',
          category: '',
          status: 'Đang Thảo Luận',
          image: '',
          summary: ''
        });
        // Đóng modal như cũ
        (document.getElementById('addBookModal') as any).classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      })
      .catch(error => console.error('Lỗi khi thêm sách:', error));
  };

  // Lọc sách theo từ khóa tìm kiếm, thể loại và trạng thái
  const filteredBooks = books.filter(book =>
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!categoryFilter || book.category === categoryFilter) &&
    (!statusFilter || book.status === statusFilter)
  );

  return (
    <>
      <Header /> {/* Thêm dòng này để hiển thị header */}
      <div className="container" style={{ paddingTop: '70px' }}>
        <h2 className="my-4">Danh Sách Sách Quản Trị Viên</h2>
        <button
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#addBookModal"
        >
          <i className="bi bi-plus-lg"></i>
          Thêm Sách Mới
        </button>

        {/* Modal thêm sách */}
        <div
          className="modal fade"
          id="addBookModal"
          tabIndex={-1}
          aria-labelledby="addBookModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addBookModalLabel">
                  Thêm sách mới
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddBook}>
                  <div className="mb-3">
                    <label htmlFor="bookTitle" className="form-label">
                      Tên Sách
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bookTitle"
                      required
                      value={newBook.title}
                      onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                    />
                    <div className="invalid-feedback">
                      Vui lòng nhập tên sách
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookAuthor" className="form-label">
                      Tác Giả
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bookAuthor"
                      required
                      value={newBook.author}
                      onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                    />
                    <div className="invalid-feedback">
                      Vui lòng nhập tên tác giả
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookCategory" className="form-label">
                      Thể Loại
                    </label>
                    <select
                      className="form-select"
                      id="bookCategory"
                      required
                      value={newBook.category}
                      onChange={e => setNewBook({ ...newBook, category: e.target.value })}
                    >
                      <option value="">Chọn Thể Loại</option>
                      <option value="Tiểu Thuyết">Tiểu Thuyết</option>
                      <option value="Phi Hư Cấu">Phi Hư Cấu</option>
                      <option value="Khoa Học Viễn Tưởng">Khoa Học Viễn Tưởng</option>
                      <option value="Tiểu Sử">Tiểu Sử</option>
                      <option value="Hướng Nghiệp">Hướng Nghiệp</option>
                    </select>
                    <div className="invalid-feedback">
                      Vui lòng chọn thể loại
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookImage" className="form-label">
                      Ảnh Bìa Sách
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="bookImage"
                      placeholder="Nhập đường dẫn ảnh hoặc link"
                      value={newBook.image}
                      onChange={e => setNewBook({ ...newBook, image: e.target.value })}
                    />
                    <div className="form-text">
                      Chọn file ảnh (JPG, PNG) để tải lên ảnh bìa
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookSummary" className="form-label">
                      Tóm tắt sách
                    </label>
                    <textarea
                      className="form-control"
                      id="bookSummary"
                      rows={2}
                      value={newBook.summary}
                      onChange={e => setNewBook({ ...newBook, summary: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Gửi
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tìm kiếm và lọc */}
        <form className="mb-3">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="searchInput" className="form-label">
                Tìm kiếm sách
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="searchInput"
                  placeholder="Nhập tên sách hoặc tác giả"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {}}
                >
                  Tìm
                </button>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="categoryFilter" className="form-label">
                Thể loại
              </label>
              <select
                className="form-select"
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                <option value="Tiểu Thuyết">Tiểu Thuyết</option>
                <option value="Phi Hư Cấu">Phi Hư Cấu</option>
                <option value="Khoa Học Viễn Tưởng">Khoa Học Viễn Tưởng</option>
                <option value="Tiểu Sử">Tiểu Sử</option>
                <option value="Hướng Nghiệp">Hướng Nghiệp</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="statusFilter" className="form-label">
                Trạng thái
              </label>
              <select
                className="form-select"
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Đang Thảo Luận">Đang Thảo Luận</option>
                <option value="Đã Hoàn Thành">Đã Hoàn Thành</option>
              </select>
            </div>
          </div>
        </form>
        <div className="mb-3">Tìm thấy {filteredBooks.length} sách</div>

        {/* Danh sách sách với grid card */}
        <div className="grid-container" id="bookGrid">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              style={{ backgroundImage: `url(${book.image})`, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện lan truyền từ các phần tử con
                handleShowBookDetail(book);
              }}
              data-bs-toggle="modal"
              data-bs-target="#viewBookModal"
            >
              <div className="card-content">
                <h5>{book.title}</h5>
                <p><strong>Tác Giả:</strong> {book.author}</p>
                <p><strong>Thể Loại:</strong> {book.category}</p>
                <p><strong>Trạng Thái:</strong> {book.status}</p>
                <div className="action-buttons">
                  <button
                    className="btn btn-warning btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#editBookModal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBook(book);
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <div
              className="book-card"
              style={{ textAlign: 'center', color: '#dc3545' }}
            >
              Không tìm thấy kết quả nào
            </div>
          )}
        </div>


        {/* Phân trang */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Bảng review sách */}
        <div className="mt-5" id="reviewSection">
          <h3 className="mb-3">
            Reviews <span className="badge bg-secondary">1</span>
          </h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div style={{ width: '70%' }}>
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr>
                    <td style={{ width: '120px' }}>
                      <input type="checkbox" checked disabled /> Cực hay
                    </td>
                    <td>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: '100%' }}
                        ></div>
                      </div>
                    </td>
                    <td style={{ width: '50px' }}>100%</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" disabled /> Hay
                    </td>
                    <td>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" disabled /> Bình thường
                    </td>
                    <td>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" disabled /> Không hay
                    </td>
                    <td>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </td>
                    <td>0%</td>
                  </tr>
                  <tr>
                    <td>
                      <input type="checkbox" disabled /> Dở
                    </td>
                    <td>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className="progress-bar bg-secondary"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </td>
                    <td>0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="btn btn-warning" style={{ height: '40px' }}>
              Viết review
            </button>
          </div>

          {/* Review về cuốn Educated */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex align-items-center mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="avatar"
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                />
                <div>
                  <strong>Minh Anh</strong>
                  <br />
                  <span className="text-muted" style={{ fontSize: '13px' }}>
                    Sinh Viên
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <span
                  className="badge bg-success"
                  style={{ fontSize: '16px' }}
                >
                  <i className="bi bi-star-fill"></i> ★★★★★
                </span>
              </div>
              <h5 className="card-title mb-1">
                Educated – Hành Trình Tự Giáo Dục Đầy Cảm Hứng
              </h5>
              <div
                className="text-muted mb-2"
                style={{ fontSize: '13px' }}
              >
                2 ngày trước
              </div>
              <p className="card-text">
                Educated là một cuốn tự truyện xuất sắc của Tara Westover, kể
                về hành trình vượt qua nghịch cảnh để tìm kiếm tri thức và tự
                do. Câu chuyện của Tara truyền cảm hứng mạnh mẽ về ý chí,
                nghị lực và khát vọng học tập không ngừng. Cuốn sách không chỉ
                là lời nhắc nhở về giá trị của giáo dục mà còn là minh chứng
                cho sức mạnh của niềm tin vào bản thân. Một tác phẩm rất đáng
                đọc cho bất kỳ ai đang tìm kiếm động lực để thay đổi cuộc đời
                mình.
              </p>
              <div>
                <a href="#" className="me-3 text-decoration-none">
                  <i className="bi bi-hand-thumbs-up"></i> Like
                </a>
                <a href="#" className="me-3 text-decoration-none">
                  <i className="bi bi-share"></i> Share
                </a>
                <a href="#" className="text-decoration-none">
                  <i className="bi bi-reply"></i> Trả lời
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết sách */}
      <div
        className="modal fade"
        id="viewBookModal"
        tabIndex={-1}
        aria-labelledby="viewBookModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="viewBookModalLabel">
                Chi Tiết Sách
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBook && (
                <div className="row">
                  <div className="col-md-4 text-center mb-3">
                    <img
                      src={selectedBook.image}
                      alt="Bìa sách"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h4>{selectedBook.title}</h4>
                    <p>
                      <strong>Tác Giả:</strong> {selectedBook.author}
                    </p>
                    <p>
                      <strong>Thể Loại:</strong> {selectedBook.category}
                    </p>
                    <p>
                      <strong>Trạng Thái:</strong> {selectedBook.status}
                    </p>
                    <hr />
                    <p>{selectedBook.summary}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa sách */}
      <div
        className="modal fade"
        id="editBookModal"
        tabIndex={-1}
        aria-labelledby="editBookModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editBookModalLabel">
                Chỉnh Sửa Sách
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedBook && (
                <form onSubmit={handleSaveChanges}>
                  <div className="mb-3">
                    <label htmlFor="editBookTitle" className="form-label">
                      Tên Sách
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editBookTitle"
                      value={selectedBook.title}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editBookAuthor" className="form-label">
                      Tác Giả
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editBookAuthor"
                      value={selectedBook.author}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, author: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editBookCategory" className="form-label">
                      Thể Loại
                    </label>
                    <select
                      className="form-select"
                      id="editBookCategory"
                      value={selectedBook.category}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, category: e.target.value })
                      }
                      required
                    >
                      <option value="Tiểu Thuyết">Tiểu Thuyết</option>
                      <option value="Phi Hư Cấu">Phi Hư Cấu</option>
                      <option value="Khoa Học Viễn Tưởng">Khoa Học Viễn Tưởng</option>
                      <option value="Tiểu Sử">Tiểu Sử</option>
                      <option value="Hướng Nghiệp">Hướng Nghiệp</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editBookStatus" className="form-label">
                      Trạng Thái
                    </label>
                    <select
                      className="form-select"
                      id="editBookStatus"
                      value={selectedBook.status}
                      onChange={(e) =>
                        setSelectedBook({ ...selectedBook, status: e.target.value })
                      }
                      required
                    >
                      <option value="Đang Thảo Luận">Đang Thảo Luận</option>
                      <option value="Đã Hoàn Thành">Đã Hoàn Thành</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Lưu Thay Đổi
                  </button>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DSBook;