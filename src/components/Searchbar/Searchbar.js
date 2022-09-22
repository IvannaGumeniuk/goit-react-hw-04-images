import { useState } from "react";
import PropTypes from 'prop-types';
import { AiOutlineSearch } from "react-icons/ai";
import styles from "./Searchbar.module.css";

export default function Searchbar({onSubmit}) {
    const [searchKey, setSearchKey] = useState('');
    
    const handleSubmit = event => {
        event.preventDefault();
        onSubmit(searchKey);
    };

    const onChangeInput = event => {
        setSearchKey(event.target.value)
    };
    
        return (
            <header className={styles.searchbar}>
            <form className={styles.form} onSubmit={handleSubmit}>
                    <button type="submit" className={styles.button}><AiOutlineSearch  /></button>
                    <input
                        className={styles.input}
                        value={searchKey}
                        onChange={onChangeInput}
                        type="text"
                        autoComplete="off"
                        autoFocus={true}
                        placeholder="Search images and photos"
                    />
            </form>
            </header>
        )
    };

Searchbar.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

