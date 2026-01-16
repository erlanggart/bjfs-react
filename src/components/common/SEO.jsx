// import { Helmet } from 'react-helmet-async'; // Temporarily disabled
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article = null,
  author = 'Bogor Junior Football School',
}) => {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://bogorjuniorfs.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/logo.png`;

  // Default values
  const siteTitle = 'Bogor Junior Football School';
  const defaultDescription = 'Sekolah Sepakbola Terbaik di Bogor - Bogor Junior FS. Membentuk karakter dan skill pemain sepakbola muda berbakat sejak dini.';
  const defaultKeywords = 'bogor junior, sekolah sepakbola bogor, ssb bogor, sepakbola anak, football school';

  const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;

  // Use vanilla JS for meta tags (react-helmet-async removed for React 19 compatibility)
  useEffect(() => {
    // Set page title
    document.title = metaTitle;
    
    // Helper to set meta tags by name
    const setMetaTag = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set meta tags by property (for Open Graph)
    const setPropertyTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Set basic meta tags
    setMetaTag('description', metaDescription);
    setMetaTag('keywords', metaKeywords);
    setMetaTag('author', author);

    // Set Open Graph meta tags
    setPropertyTag('og:type', type);
    setPropertyTag('og:title', metaTitle);
    setPropertyTag('og:description', metaDescription);
    setPropertyTag('og:url', fullUrl);
    setPropertyTag('og:image', fullImage);
    setPropertyTag('og:site_name', siteTitle);
    
    // Set Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', metaTitle);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', fullImage);
  }, [metaTitle, metaDescription, metaKeywords, fullUrl, fullImage, author, type]);

  // Component doesn't render anything, just manages meta tags
  return null;
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  article: PropTypes.shape({
    publishedTime: PropTypes.string,
    modifiedTime: PropTypes.string,
    author: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  author: PropTypes.string,
};

export default SEO;
