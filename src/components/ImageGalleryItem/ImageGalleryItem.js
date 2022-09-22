import styles from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

export default function ImageGalleryItem({ webformatURL, alt, onOpen }) {
    return (
        <li className={styles.ImageGalleryItem} onClick={onOpen}>
            <img
                className={styles.ImageGalleryItemImage}
                src={webformatURL}
                alt={alt}
            />
        </li>
    );
}

ImageGalleryItem.propTypes = {
    webformatURL: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onOpen: PropTypes.func.isRequired,
};