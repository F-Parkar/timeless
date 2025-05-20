import '../components/css/WatchSpinner.css'; // custom CSS
import watchDial from '../components/css/watch-dial.png'; // use your own image

const Loader = () => {
  return (
    <div className="spinner-container">
      <div className="watch-spinner">
        <div className="spinner-ring"></div>
        <img src={watchDial} alt="Watch Dial" className="watch-dial" />
      </div>
    </div>
  );
};

export default Loader;