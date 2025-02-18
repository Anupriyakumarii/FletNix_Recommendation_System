import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="container navbar-content">
            <h1 className="logo">FletNix</h1>
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="btn btn-primary"
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ShowsList user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <AuthForm
                  setIsAuthenticated={setIsAuthenticated}
                  setUser={setUser}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* <Route path="/show/:id" element={<ShowDetail />} /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const AuthForm = ({ setIsAuthenticated, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication logic here
  };

  return (
    <div className="container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        {!isLogin && (
          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
};

const ShowsList = ({ user }) => {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    fetchShows();
  }, [page, search, type]);

  const fetchShows = async () => {
    const response = await fetch(
      `/api/shows?page=${page}&search=${search}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    setShows(data.shows);
    setTotalPages(data.totalPages);
  };

  return (
    <div className="container">
      <div className="search-filters">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search titles or cast..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-input type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
      </div>

      <div className="shows-grid">
        {shows.map((show) => (
          <div key={show.show_id} className="show-card">
            <h3 className="show-title">{show.title}</h3>
            <p className="show-meta">
              {show.type} • {show.release_year}
            </p>
            <p className="show-description">{show.description}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`page-button ${page === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;
