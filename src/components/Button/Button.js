import styles from "./Button.module.css";
import PropTypes from 'prop-types';

export default function Button({ onClick, title }) {
    return (
        <button className={styles.moreBtn} type="button" onClick={onClick}>{title}</button>
    )
};

Button.proTotype = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
}