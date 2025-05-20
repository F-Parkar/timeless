import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Timless',
  description: 'We timeless, timeless, timeless - weeknd',
  keywords: 'watches, potatoes, cleanWatches',
};

export default Meta;