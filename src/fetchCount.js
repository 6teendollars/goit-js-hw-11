import Notiflix from 'notiflix';

export function fetchCont() {
    return fetch(apiUrl)
    .then(response => {
        if(!response.ok){
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
        return response.json()
    }).catch(error => console.log(error))
    }