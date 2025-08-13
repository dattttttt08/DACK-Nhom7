import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState<{ name?: string; username?: string; role?: string } | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 20);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hiệu ứng opacity: Đầu trang rất trong (10%), kéo xuống tăng lên 50%
  const getNavbarOpacity = () => {
    if (scrollY <= 0) return 0.1;
    if (scrollY < 80) return 0.1 + (scrollY * 0.005); // Tăng dần lên 0.5
    return 0.5;
  };

  const getBackgroundStyle = () => {
    const opacity = getNavbarOpacity();
    return {
      background: `rgba(255,255,255,${opacity})`,
      boxShadow: isScrolled ? '0 2px 16px rgba(0,0,0,0.08)' : 'none',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'background 0.3s',
    };
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top transition-all duration-300"
      style={getBackgroundStyle()}
    >
      <div className="container-fluid px-4">
        {/* Logo và tên sát trái */}
        <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
          <NavLink className="navbar-brand d-flex align-items-center pe-2" to="/" style={{ minWidth: 0 }}>
            <img 
              src="../src/Img/sevenlogo.png" 
              alt="Logo Thư viện Sách Ánh Mai" 
              style={{ height: '40px', width: 'auto' }}
            />
            <span className="fw-bold ms-2" style={{ fontSize: '1.2rem', color: '#222' }}>
              SEVEN.Library
            </span>
          </NavLink>
        </div>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="bi bi-list fs-3" style={{ color: '#222' }}></i>
          </span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          {/* Menu chính ở giữa */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item mx-2">
              <NavLink 
                className="nav-link fw-medium"
                to="/"
                style={({ isActive }) => ({
                  color: isActive ? '#000000ff' : '#222',
                  borderBottom: isActive ? '2px solid #000000ff' : 'none',
                  paddingBottom: '0.5rem',
                  fontWeight: 500
                })}
              >
                Trang Chủ
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink 
                className="nav-link fw-medium"
                to="/ds-book-user"
                style={({ isActive }) => ({
                  color: isActive ? '#000000ff' : '#222',
                  borderBottom: isActive ? '2px solid #000000ff' : 'none',
                  paddingBottom: '0.5rem',
                  fontWeight: 500
                })}
              >
                Khám Phá Sách
              </NavLink>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item mx-2">
                <NavLink 
                  className="nav-link fw-medium"
                  to="/ds-book-admin"
                  style={({ isActive }) => ({
                    color: isActive ? '#000000ff' : '#222',
                    borderBottom: isActive ? '2px solid #000000ff' : 'none',
                    paddingBottom: '0.5rem',
                    fontWeight: 500
                  })}
                >
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Menu tài khoản sát phải */}
        <div className="d-flex align-items-center ms-auto">
          {user ? (
            <>
              <NavLink 
                className="nav-link fw-medium me-3" 
                to="/user-profile"
                style={({ isActive }) => ({
                  color: isActive ? '#000000ff' : '#222',
                  borderBottom: isActive ? '2px solid #000000ff' : 'none',
                  paddingBottom: '0.5rem',
                  fontWeight: 500
                })}
              >
                <i className="bi bi-person-circle me-1"></i>
                {user.name || user.username}
              </NavLink>
              <NavLink
                className="btn btn-outline-dark btn-sm"
                to="/home"
                onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Đăng Xuất
              </NavLink>
            </>
          ) : (
            <NavLink 
              className="btn btn-dark btn-sm"
              to="/login"
            >
              <i className="bi bi-person-plus me-1"></i>
              Đăng Nhập
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
