  // ...existing code...
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  summary: string;
  status: string;
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([]);
  // Chọn 6 quyển sách hay nhất (cứng)
  const topBooks = [
    books.find(b => b.title.toLowerCase().includes('1984')),
    books.find(b => b.title.toLowerCase().includes('sapiens')),
    books.find(b => b.title.toLowerCase().includes('dune')),
    books.find(b => b.title.toLowerCase().includes('pride')),
    books.find(b => b.title.toLowerCase().includes('educated')),
    books.find(b => b.title.toLowerCase().includes('vũ trụ') || b.title.toLowerCase().includes('cosmos'))
  ].filter(Boolean);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', image: '', summary: '', status: 'Đang Thảo Luận' });
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Trang Chủ - Seven.Library";
    // Lấy danh sách sách từ API
    axios.get('http://localhost:3001/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));

    // Load danh sách sách yêu thích từ localStorage khi component mount
    const savedFavorites = localStorage.getItem('favoriteBooks');
    if (savedFavorites) {
      setFavoriteBooks(JSON.parse(savedFavorites));
    }
  }, []);

  const handleShowBookDetail = (book: Book) => {
    setSelectedBook(book);
    const viewModal = document.getElementById('viewBookModal');
    if (viewModal) {
      const modal = new (window as any).bootstrap.Modal(viewModal);
      modal.show();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const bookToAdd = { ...newBook, id: Date.now() };
    axios.post('http://localhost:3001/books', bookToAdd)
      .then(response => {
        setBooks([...books, response.data]);
        setNewBook({ title: '', author: '', category: '', image: '', summary: '', status: 'Đang Thảo Luận' });
        const addModal = document.getElementById('addBookModal');
        if (addModal) {
          const modal = new (window as any).bootstrap.Modal(addModal);
          modal.hide();
        }
      })
      .catch(error => console.error('Lỗi khi thêm sách:', error));
  };

  const handleToggleFavorite = async (bookId: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Vui lòng đăng nhập để thêm sách yêu thích!");
      return;
    }

    const updatedFavorites = favoriteBooks.includes(bookId)
      ? favoriteBooks.filter(id => id !== bookId)
      : [...favoriteBooks, bookId];

    try {
      await axios.patch(`http://localhost:3001/users/${user.id}`, { favorites: updatedFavorites });
      setFavoriteBooks(updatedFavorites);
      localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error('Lỗi khi cập nhật yêu thích:', err);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
      {/* Hero Banner Carousel */}
  <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000" style={{ marginTop: '56px' }}>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        
        <div className="carousel-inner">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <img src="../src/Img/3843.png" className="d-block w-100" alt="Sách hay" style={{ height: '520px', width: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Slide 2 */}
          <div className="carousel-item">
            <img src="../src/Img/4174.png" className="d-block w-100" alt="Sách khoa học viễn tưởng" style={{ height: '520px', width: '100%', objectFit: 'cover' }} />

          </div>
          
          {/* Slide 3 */}
          <div className="carousel-item">
            <img src="../src/Img/4054.png" className="d-block w-100" alt="Sách học thuật" style={{ height: '520px', width: '100%', objectFit: 'cover' }} />
          </div>
          

        </div>
        
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Main Content */}


  {/* Bảng xếp hạng */}
  <h3 className="my-4 text-warning fw-bold" style={{ textAlign: 'left', marginRight: '100px', paddingLeft: '40px' }}>Bảng xếp hạng</h3>
  <div className="d-flex align-items-stretch pb-3" style={{ gap: '24px', paddingLeft: '40px', paddingRight: '16px', overflowX: 'auto' }}>
    {topBooks.map((book, idx) => book && (
      <div key={book.id} style={{ minWidth: 220, maxWidth: 220, flex: '0 0 220px' }}>
        <div
          className="position-relative rounded-4 shadow-sm h-100 d-flex flex-column"
          style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'rgba(148, 148, 148, 0.14)' }}
          onClick={() => handleShowBookDetail(book)}
          onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
          data-bs-toggle="modal"
          data-bs-target="#viewBookModal"
        >
          <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2" style={{ zIndex: 2, fontSize: '1rem' }}>#{idx + 1}</span>
          <img src={book.image} alt={book.title} className="w-100 rounded-4" style={{ height: 330, objectFit: 'cover', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
          <div className="text-white text-left fw-semibold mt-2 mb-2" style={{ fontSize: '1.05rem', minHeight: 48, whiteSpace: 'normal' }}>{book.title}</div>
        </div>
      </div>
    ))}
  </div>

  {/* Mới nhất */}
  <h3 className="my-4 text-white fw-bold" style={{ textAlign: 'left', marginRight: '100px', paddingLeft: '40px' }}>Mới nhất</h3>
  {/* Carousel sách */}
  <div id="bookCarousel" className="carousel slide" data-bs-ride="false" style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', padding: 0, overflow: 'visible' }}>
    <div className="carousel-inner" style={{ overflow: 'visible' }}>
      {Array.from({ length: Math.ceil(books.length / 6) }).map((_, slideIdx) => (
        <div className={`carousel-item${slideIdx === 0 ? ' active' : ''}`} key={slideIdx}>
          <div className="d-flex align-items-stretch justify-content-start" style={{ gap: '24px', padding: '0 60px', overflow: 'visible' }}>
            {books.slice(slideIdx * 6, slideIdx * 6 + 6).map((book) => (
              <div key={book.id} style={{ minWidth: 220, maxWidth: 220, flex: '0 0 220px' }}>
                <div
                  className="position-relative rounded-4 shadow-sm h-100 d-flex flex-column"
                  style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'transparent', border: 'none' }}
                  onClick={() => handleShowBookDetail(book)}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                  data-bs-toggle="modal"
                  data-bs-target="#viewBookModal"
                >
                  {/* Badge giá/miễn phí/hội viên */}
                  {book.status === 'Thảo luận' && (
                    <span className="badge bg-success position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>MIỄN PHÍ</span>
                  )}
                  {book.status === 'Hội viên' && (
                    <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>HỘI VIÊN <i className="bi bi-award-fill"></i></span>
                  )}
                  {book.status && !['Miễn phí', 'Hội viên'].includes(book.status) && (
                    <span className="badge bg-pink position-absolute top-0 end-0 m-2" style={{ background: '#e83e8c', zIndex: 2 }}>{book.status}</span>
                  )}
                  {/* Ảnh sách */}
                  <img src={book.image} alt={book.title} className="w-100 rounded-4" style={{ height: 330, objectFit: 'cover', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
                  {/* Tên sách phía dưới */}
                  <div className="text-white text-left fw-semibold mt-2 mb-2" style={{ fontSize: '1.05rem', minHeight: 48, whiteSpace: 'normal' }}>{book.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    {/* Gradient overlay for navigation buttons */}
    <button className="carousel-control-prev" type="button" data-bs-target="#bookCarousel" data-bs-slide="prev" style={{ width: 60, left: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0))', border: 'none', borderRadius: '0 24px 24px 0', height: 340, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#bookCarousel" data-bs-slide="next" style={{ width: 60, right: 0, background: 'linear-gradient(270deg, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0))', border: 'none', borderRadius: '24px 0 0 24px', height: 340, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
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
              {selectedBook ? (
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
                    <p><strong>Tác Giả:</strong> {selectedBook.author}</p>
                    <p><strong>Thể Loại:</strong> {selectedBook.category}</p>
                    <p><strong>Trạng Thái:</strong> {selectedBook.status}</p>
                    <hr />
                    <p>{selectedBook.summary}</p>
                    <button
                      className={`btn btn-sm ${favoriteBooks.includes(selectedBook.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={(e) => { e.stopPropagation(); handleToggleFavorite(selectedBook.id); }}
                    >
                      <i className="bi bi-heart"></i> {favoriteBooks.includes(selectedBook.id) ? 'Đã yêu thích' : 'Yêu thích'}
                    </button>
                    <button className="btn btn-primary mt-3" onClick={() => alert(`Đang mở sách ${selectedBook.title} để đọc!`)}>
                      <i className="bi bi-book"></i> Đọc Ngay
                    </button>
                  </div>
                </div>
              ) : (
                <p>Đang tải...</p>
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
  );
};

export default Home;