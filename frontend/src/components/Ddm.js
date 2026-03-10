import React, { useEffect, useState } from 'react';
import { apiUrl } from '../api';
import './Ddm.css';

function getLabelFromMedia(media) {
  if (!media || !media.name) return null;
  const name = String(media.name);
  const withoutExt = name.replace(/\.[a-zA-Z0-9]+$/, '');
  return withoutExt.length > 40 ? withoutExt.slice(0, 37) + '...' : withoutExt;
}

function getLabelFromLink(url, type) {
  if (!url) return type === 'video' ? 'Видео' : type === 'image' ? 'Зураг' : 'Линк';
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host.length > 30 ? host.slice(0, 27) + '...' : host;
  } catch {
    return type === 'video' ? 'Видео' : type === 'image' ? 'Зураг' : 'Линк';
  }
}

function normalizePortfolio(item) {
  if (!item) return null;
  const { id, documentId, link, Image, Video, Title } = item;

  const firstImage = Array.isArray(Image) && Image.length > 0 ? Image[0] : null;
  const firstVideoThumb = Array.isArray(Video) && Video.length > 0 ? Video[0] : null;

  let type = 'link';
  let mediaUrl = null;
  let videoUrl = null;

  if (firstImage || firstVideoThumb) {
    if (firstImage) {
      type = 'image';
      const media = firstImage;
      const formats = media?.formats || {};
      const mediaPath =
        formats.medium?.url ||
        formats.small?.url ||
        formats.thumbnail?.url ||
        media?.url ||
        null;
      mediaUrl = mediaPath ? apiUrl(mediaPath) : null;
    } else if (firstVideoThumb) {
      type = 'video';
      const media = firstVideoThumb;
      const mime = media?.mime || '';
      const isImageThumb = typeof mime === 'string' && mime.startsWith('image/');

      if (isImageThumb) {
        const formats = media?.formats || {};
        const mediaPath =
          formats.medium?.url ||
          formats.small?.url ||
          formats.thumbnail?.url ||
          media?.url ||
          null;
        mediaUrl = mediaPath ? apiUrl(mediaPath) : null;
      } else {
        // Uploaded video file (e.g. mp4) without image thumbnail
        // Use it only for the big video player, not as <img src>.
        const url = media?.url || null;
        videoUrl = url ? apiUrl(url) : null;
      }
    }
  } else if (link) {
    const original = String(link);
    const lower = original.toLowerCase();

    if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/.test(lower)) {
      type = 'image';
      mediaUrl = link;
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
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

  const media = firstImage || firstVideoThumb;
  const title = typeof Title === 'string' ? Title.trim() : '';
  const label = title || getLabelFromMedia(media) || getLabelFromLink(link, type);

  return {
    id,
    documentId,
    link: link || '',
    mediaUrl,
    type,
    videoUrl,
    label,
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
        const pageSize = 50;
        let page = 1;
        let allData = [];
        // Fetch all pages until we get less than pageSize
        // so we are not limited by Strapi's default 25 items.
        // /api/portfolios?pagination[page]=1&pagination[pageSize]=50&populate=*
        // See: https://admin.deltasoft.website/api/portfolios?populate=*
        // (same endpoint, but with explicit pagination params).
        // We guard with maxPages to avoid infinite loops if API misbehaves.
        const maxPages = 20;

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const url = apiUrl(
            `/api/portfolios?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
          );
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error('Портфолио жагсаалт татахад алдаа гарлаа.');
          }
          const json = await res.json();
          const raw = json.data || [];
          allData = allData.concat(raw);

          const received = Array.isArray(raw) ? raw.length : 0;
          const meta = json.meta?.pagination;
          const totalPages = meta?.pageCount || null;

          if (received < pageSize || !totalPages || page >= totalPages || page >= maxPages) {
            break;
          }
          page += 1;
        }

        const normalized = Array.isArray(allData)
          ? allData.map(normalizePortfolio).filter(Boolean)
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
                    ) : item.type === 'video' && item.videoUrl ? (
                      <div className="portfolio-video-placeholder">
                        <span className="portfolio-video-icon">▶</span>
                      </div>
                    ) : (
                      <div className={`portfolio-placeholder-block${isFacebook ? ' portfolio-placeholder-facebook' : ''}`} />
                    )}
                    <div className="portfolio-hover-layer">
                      <span className="portfolio-hover-name">{item.label}</span>
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
              {activeItem.type === 'video' ? (
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
                ) : activeItem.videoUrl ? (
                  <video
                    src={activeItem.videoUrl}
                    controls
                  />
                ) : (
                  activeItem.mediaUrl && <img src={activeItem.mediaUrl} alt="" />
                )
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


