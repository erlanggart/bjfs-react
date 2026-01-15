import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

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

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="title" content={metaTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="id_ID" />

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.category || 'Berita'} />
          {article.tags && article.tags.map((tag, index) => (
            <meta property="article:tag" content={tag} key={index} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Indonesian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data - JSON-LD */}
      {article ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: metaDescription,
            image: fullImage,
            datePublished: article.publishedTime,
            dateModified: article.modifiedTime,
            author: {
              '@type': 'Person',
              name: article.author,
            },
            publisher: {
              '@type': 'Organization',
              name: siteTitle,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullUrl,
            },
          })}
        </script>
      ) : type === 'website' ? (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: siteTitle,
            description: metaDescription,
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            sameAs: [
              'https://www.facebook.com/bogorjuniorfs',
              'https://www.instagram.com/bogorjuniorfs',
              'https://www.youtube.com/@bogorjuniorfs',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Service',
              email: 'info@bogorjuniorfs.com',
            },
          })}
        </script>
      ) : null}
    </Helmet>
  );
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
