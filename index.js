//Dom
const autoSearch = document.querySelector('#autoSearch');
const list = document.querySelector('#list');

//api call
const callingNYTimesData = async() => {
    let url = `https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=9295035052fa4dfc85794bbc1846f9da`;
    let response = await fetch(url);
    return await response.json();
}


//API helper
const filteredAPI = async(search) => {
    return await callingNYTimesData()
        .then(data => {
            let results = data.results;
            let lists = results.lists;
            let trimedSearch = search.trim();
            let firstLetterSearch = trimedSearch.charAt(0).toUpperCase() + trimedSearch.slice(1)
            let mapedList = lists.filter(value => {
                return value.display_name.includes(firstLetterSearch)
            }).map(value => {
                return {
                    display_name: value.display_name,
                    list_image: value.list_image,
                    books: value.books
                }
            })
            return mapedList;
        })
}


//google simple request
const url = 'https://www.googleapis.com/demo/v1?key=AIzaSyBGNfXobx9kS2K3pMtACr9zdPrWErLn5Kc';
fetch(url)
    .then(data => data.json())
    .then(data => console.log(data))



//rx js
const autoSearchStream$ = Rx.Observable.fromEvent(autoSearch, 'keyup')
    .map(e => e.target.value)
    .filter(text => {
        return text.length > 3
    })
    .debounceTime(500)
    .distinctUntilChanged()

const callingNYTimesDataStream$ = Rx.Observable.fromPromise(filteredAPI())



autoSearchStream$
    .switchMap(x => {
        return Rx.Observable.fromPromise(filteredAPI(x))
    })
    .subscribe(x => {
        while (list.hasChildNodes()) {
            list.removeChild(list.lastChild);
        }
        x.forEach(value => {
            let li = `<li><p>${value.display_name}</p>
                    <img src='${value.list_image}'>
            </li>`
            list.insertAdjacentHTML('beforeend', li)
        })
    })