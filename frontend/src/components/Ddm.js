import React, { useEffect, useState } from 'react';
import { apiUrl } from '../api';
import './Ddm.css';

function normalizePortfolio(item) {
  if (!item) return null;
  const { id, documentId, link, Image, Video } = item;

  const firstImage = Array.isArray(Image) && Image.length > 0 ? Image[0] : null;
  const firstVideoThumb = Array.isArray(Video) && Video.length > 0 ? Video[0] : null;

  let type = 'link';
  let mediaUrl = null;

  if (firstImage || firstVideoThumb) {
    if (firstImage) type = 'image';
    else if (firstVideoThumb) type = 'video';

    const media = firstImage || firstVideoThumb;
    const formats = media?.formats || {};
    const mediaPath =
      formats.medium?.url ||
      formats.small?.url ||
      formats.thumbnail?.url ||
      media?.url ||
      null;

    mediaUrl = mediaPath ? apiUrl(mediaPath) : null;
  } else if (link) {
    const original = String(link);
    const lower = original.toLowerCase();

    // If link is direct image URL, treat as image
    if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/.test(lower)) {
      type = 'image';
      mediaUrl = link;
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      // Treat YouTube links as video and use thumbnail as preview
      type = 'video';
      const idMatch =
        original.match(/[?&]v=([^&]+)/) ||
        original.match(/youtu\.be\/([^?&/]+)/);
      const videoId = idMatch && idMatch[1] ? idMatch[1] : null;
      if (videoId) {
        mediaUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
  }

  return {
    id,
    documentId,
    link: link || '',
    mediaUrl,
    type,
  };
}

const Ddm = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(apiUrl('/api/portfolios?populate=*'));
        if (!res.ok) {
          throw new Error('Портфолио жагсаалт татахад алдаа гарлаа.');
        }
        const json = await res.json();
        const raw = json.data || [];
        const normalized = Array.isArray(raw)
          ? raw.map(normalizePortfolio).filter(Boolean)
          : [];
        setItems(normalized);
      } catch (e) {
        setError(e.message || 'Алдаа гарлаа.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleOpen = (item) => {
    setActiveItem(item);
  };

  const handleClose = () => {
    setActiveItem(null);
  };

  return (
    <div className="page ddm-page" data-aos="fade-up">
      <div className="container">
        <div className="ddm-header">
          {items.length > 0 && !loading && (
            <span className="ddm-count">Нийт: {items.length}</span>
          )}
        </div>

        {error && <p className="ddm-error">{error}</p>}

        {loading ? (
          <p className="ddm-loading">Ачааллаж байна...</p>
        ) : items.length === 0 ? (
          <p className="ddm-empty">Харагдах портфолио одоогоор байхгүй байна.</p>
        ) : (
          <div className="portfolio-grid">
            {items.map((item) => {
              const key = item.documentId || item.id;
              const isFacebook = (item.link || '').toLowerCase().includes('facebook.com');

              return (
                <button
                  key={key}
                  className="portfolio-card"
                  type="button"
                  onClick={() => handleOpen(item)}
                >
                  <div className="portfolio-media">
                    {item.mediaUrl ? (
                      <img src={item.mediaUrl} alt="" />
                    ) : (
                      <div className={`portfolio-placeholder-block${isFacebook ? ' portfolio-placeholder-facebook' : ''}`} />
                    )}
                    <div className="portfolio-hover-layer">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="portfolio-hover-text"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Линкрүү үсрэх
                        </a>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {activeItem && (
        <div className="ddm-modal-backdrop" onClick={handleClose} role="button" tabIndex={-1}>
          <div
            className="ddm-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button type="button" className="ddm-modal-close" onClick={handleClose}>
              ×
            </button>
            <div className="ddm-modal-media">
              {activeItem.type === 'video' &&
              activeItem.link &&
              (activeItem.link.toLowerCase().includes('youtube.com') ||
                activeItem.link.toLowerCase().includes('youtu.be')) ? (
                <iframe
                  src={activeItem.link}
                  title="portfolio-video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                activeItem.mediaUrl && <img src={activeItem.mediaUrl} alt="" />
              )}
            </div>
            {activeItem.link && (
              <div className="ddm-modal-footer">
                <a href={activeItem.link} target="_blank" rel="noreferrer" className="ddm-modal-link">
                  Линкрүү үсрэх
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ddm;


