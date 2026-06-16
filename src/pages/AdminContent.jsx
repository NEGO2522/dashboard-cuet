import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './AdminContent.css';

const CustomDropdown = ({ id, label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group custom-dropdown" ref={dropdownRef}>
      <label htmlFor={id}>{label}</label>
      <div 
        className={`dropdown-selected ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      <div className={`dropdown-options-container ${isOpen ? 'open' : ''}`}>
        <ul className="dropdown-options">
          {options.map(opt => (
            <li 
              key={opt} 
              className={opt === value ? 'selected' : ''}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export function AdminContent() {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [source, setSource] = useState('DU Official');
  const [category, setCategory] = useState('Admission');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentPosts();
    }
  }, [isAuthenticated]);

  const fetchRecentPosts = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('news_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this update?")) return;
    
    try {
      const { error } = await supabase
        .from('news_updates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Post deleted successfully.' });
      fetchRecentPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      setStatus({ type: 'error', message: 'Failed to delete post.' });
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length <= 50) {
      setDescription(text);
    } else {
      // Truncate to 50 words if pasted
      setDescription(words.slice(0, 50).join(" "));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const { error } = await supabase
        .from('news_updates')
        .insert([
          {
            title,
            link,
            source,
            category,
            description: description || null,
            is_important: isImportant
          }
        ]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'News update published successfully!' });
      
      // Reset form
      setTitle('');
      setLink('');
      setDescription('');
      setIsImportant(false);
      
      // Refresh list
      fetchRecentPosts();
    } catch (error) {
      console.error('Error inserting data:', error);
      setStatus({ type: 'error', message: 'Failed to publish post. Check connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'Cuetpro@Tushar') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Access denied.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1>Admin Access</h1>
          <p>Please enter the administrator password to continue.</p>
          <form onSubmit={handleLogin} className="admin-login-form">
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
            {authError && <div className="auth-error">{authError}</div>}
            <button type="submit" className="login-btn">Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Content Manager</h1>
        <p>Publish news, updates, and notices directly to the live dashboard.</p>
      </div>

      <div className="admin-card">
        {status.message && (
          <div className={`admin-alert admin-alert-${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label htmlFor="title">Headline / Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Round 1 Seat Allocation Released"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="link">Target URL *</label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://admission.uod.ac.in"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Short Description (Max 50 Words)</label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Provide a brief summary..."
              rows="3"
              className="admin-textarea"
            />
            <div className="word-count">
              {description.trim() === '' ? 0 : description.trim().split(/\s+/).length}/50 words
            </div>
          </div>

          <CustomDropdown
            id="category"
            label="Category *"
            value={category}
            options={["Admission", "Cutoffs", "Notice", "Feature"]}
            onChange={setCategory}
          />

          <CustomDropdown
            id="source"
            label="Source Label"
            value={source}
            options={["DU Official", "Admin", "NTA"]}
            onChange={setSource}
          />

          <div className="form-group full-width checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
              <span className="checkbox-text">Mark as Priority / Important</span>
            </label>
            <p className="help-text">Priority items will show a glowing red badge.</p>
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Update'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-recent-posts">
        <div className="recent-posts-header">
          <h2>Recent Updates</h2>
          {isFetching && <span className="fetching-indicator">Loading...</span>}
        </div>
        
        {recentPosts.length === 0 && !isFetching ? (
          <p className="no-posts-msg">No updates found. Your posts will appear here.</p>
        ) : (
          <ul className="recent-posts-list">
            {recentPosts.map((post) => (
              <li key={post.id} className="recent-post-item">
                <div className="recent-post-info">
                  <div className="recent-post-meta">
                    <span className="recent-category">{post.category}</span>
                    <span className="recent-date">
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {post.is_important && <span className="recent-priority">Priority</span>}
                  </div>
                  <h4 className="recent-title">{post.title}</h4>
                  <a href={post.link} target="_blank" rel="noreferrer" className="recent-link">{post.link}</a>
                </div>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="delete-post-btn"
                  title="Delete Update"
                >
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
