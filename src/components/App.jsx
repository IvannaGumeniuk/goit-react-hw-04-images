import Notiflix from 'notiflix';
import React, { Component } from 'react';
import Searchbar from "./Searchbar/Searchbar";
import SearchApi from "../services/Api";
import ImageGallery from "./ImageGallery/ImageGallery"
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';

class App extends Component {
  state = {
    searchKey: '',
    countPage: 1,
    per_page: 12,
    ImagesList: [],
    showModal: false,
    showLoadMore: false,
    loading: false,
    openModalItem: { url: '', alt: '' },
  };
  
  componentDidUpdate(prevProps, prevState) {
    const { searchKey, per_page, countPage, ImagesList } = this.state;
    if (prevState.countPage !== countPage ||
      prevState.searchKey !== searchKey) {
        this.setState({ showLoadMore: false, loading: true });
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

          this.setState(prev => ({
            ImagesList: [...prev.ImagesList, ...filterDataHits],
            totalHits: date.totalHits,
            loading: false,
          }));
          
          if (date.total !== date.hits.lenght) {
            this.setState({ showLoadMore: true });
          }
          
            if (countPage === 1) {
            Notiflix.Notify.success(`WOW! We found ${date.totalHits} images`);
          }
    
          if (date.total <= ImagesList.length + per_page) {
            this.setState({ showLoadMore: false });
            Notiflix.Notify.info('We are sorry, but you reached the end of the search results');
          }
        })
        .catch(this.onApiError);
      }
  }
  
  onApiError = () => {
    Notiflix.Notify.failure('MSorry, there are no images matching your search query. Please try again');
    this.setState({ showLoadMore: false, loading: false });
  };

  onSubmit = name => {
    this.setState(prev =>
      prev.searchKey === name && prev.countPage === 1
        ? { countPage: 1 }
        :{
          searchKey: name,
          countPage: 1,
          ImagesList: [],
        });
  };
  
  onloadeMore = () => {
        this.setState(prev => ({
          countPage: prev.countPage + 1,
        }));
    };
  

  openModal = (url, alt) => {
      const openModalItem = { url, alt };
      this.setState({
        showModal: true,
        openModalItem,
      });
  };

  closeModal = () => {
      this.setState({ showModal: false });
  };

render() {
  const { ImagesList, showModal, openModalItem, showLoadMore, loading } = this.state;
    return (
      <div>
        <Searchbar onSubmit={this.onSubmit} />
        {showModal && (
          <Modal
            url={openModalItem.url}
            alt={openModalItem.alt}
            onClose={this.closeModal}
          />
        )}
        <ImageGallery params={ImagesList} openModal={ this.openModal} />
        {loading && <Loader />}
        {showLoadMore && (
        <Button onClick={this.onloadeMore} title='Load more' />
        )}
    </div>
    );
  };
}

export default App;