import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../../src/Style/dss.css";
import Header from '../Component/Header';

function DSBookUser() {
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

  interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    status: string;
    image: string;
    summary: string;
  }

  useEffect(() => {
    document.title = "Danh Sách Sách - Seven.Library";
    axios.get('http://localhost:3001/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  const handleShowBookDetail = (book: Book) => {
    setSelectedBook(book);
  };

  const filteredBooks = books.filter(book =>
    (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.author?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!categoryFilter || book.category === categoryFilter) &&
    (!statusFilter || book.status === statusFilter)
  );

  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: '70px' }}>
        <h2 className="my-4">Danh Sách Sách</h2>
        {/* Không có nút Đề Xuất Sách Mới, Sửa, Xóa */}
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
        <div className="grid-container" id="bookGrid">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              style={{ backgroundImage: `url(${book.image})`, cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
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

        {/* PHẦN ĐÁNH GIÁ ĐƯỢC ĐẶT Ở CUỐI TRANG */}
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
        {/* Kết thúc phần đánh giá */}
        
        {/* Modal xem chi tiết sách giữ nguyên, KHÔNG chứa phần review nữa */}
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
      </div>
    </>
  );
}

export default DSBookUser;