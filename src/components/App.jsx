import Notiflix from 'notiflix';
import  { useState, useEffect } from 'react';
import Searchbar from "./Searchbar/Searchbar";
import SearchApi from "../services/Api";
import ImageGallery from "./ImageGallery/ImageGallery"
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

export default function App() {
  const [searchKey, setSearchKey] = useState('');
  const [countPage, setCountPage] = useState(1);
  const [per_page, setPer_page] = useState(12);
  const [imagesList, setImagesList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModalItem, setOpenModalItem] = useState({ url: '', alt: '' });
  
  useEffect(() => {
    if (!searchKey) {
      return;
    }
    setShowModal(false);
    setLoading(true);
    SearchApi(searchKey, countPage, per_page)
      .then(date => {
      const filterDataHits = date.hits.map(img => {
        return Object.fromEntries(
          Object.entries(img).filter(([key]) =>
            [
              'id',
              'tags',
              'largeImageURL',
              'webformatURL',
            ].includes(key)
          )
        );
      });
  
    setImagesList(prev => [...prev, ...filterDataHits]);
    setLoading(false);

          if (date.total !== date.hits.lenght) {
            setShowLoadMore(true);
          }
          
          if (countPage === 1) {
            Notiflix.Notify.success(`WOW! We found ${date.totalHits} images`);
          }
    
          if (date.total <= countPage * per_page) {
            setShowLoadMore(false);
            Notiflix.Notify.info('We are sorry, but you reached the end of the search results');
          }
        })
        .catch(onApiError);
}, [countPage, searchKey, per_page]);

  
  const onApiError = () => {
    Notiflix.Notify.failure('MSorry, there are no images matching your search query. Please try again');
    setShowModal(false);
    setLoading(false);
  };

  const onSubmit = (key, per) => {
    if (!key) {
      Notiflix.Notify.failure('Please. Enter the key of the picture.');
        setShowLoadMore(false);
      }
    if (searchKey === key && countPage === 1 && per === per_page) {
        return;
    }
      setSearchKey(key);
      setPer_page(per);
      setCountPage(1);
      setImagesList([]);
  };

  const onloadeMore = () => {
    setCountPage(prev => prev + 1);
  };
  
  const openModal = (url, alt) => {
    setOpenModalItem({ url, alt });
      setTimeout(() => {
        setShowModal(true);
      }, 100);
  };

    return (
      <div>
        <Searchbar onSubmit={onSubmit} />
        {showModal && (
          <Modal
            url={openModalItem.url}
            alt={openModalItem.alt}
            onClose={() => setShowModal(false)}
          />
        )}
        <ImageGallery params={imagesList} openModal={openModal} />
        {loading && <Loader />}
        {showLoadMore && (
        <Button onClick={onloadeMore} title='Load more' />
        )}
    </div>
    );
}