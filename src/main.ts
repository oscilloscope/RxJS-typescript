import { Observable, Observer} from 'rxjs';
/* import { Observable} from 'rxjs/Observable';
import "rxjs/add/operator/map";
import "rxjs/add/operator/filter"; */

let output = document.getElementById('output');
let button = document.getElementById('button');

let click = Observable.fromEvent(button, "click");



function load(url: string){
   return Observable.create(observer => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {    
        if(xhr.status === 200){
            let data = JSON.parse(xhr.responseText);
            observer.next(data);
            observer.complete();        
        }else{
            observer.error(xhr.statusText);
        }
    })


    xhr.open("GET", url);
    xhr.send();
   }).retryWhen(retryStrategy(3, 1000));
} 

function retryStrategy(attemps: number = 4, delay: number = 1500){
    return function(errors){
        return errors
        .scan((acc, value) => {
            console.log(acc, value);
            return acc + 1;
        }, 0)
        .takeWhile(acc => acc < attemps)
        .delay(delay);
    }
}

function renderMovies(movies){
    movies.forEach(m => {
        let div = document.createElement('div');
        div.innerText = m.title;
        output.appendChild(div);
    });
}

click.flatMap(e => load("moviess.json")).subscribe(
    renderMovies,
    e => console.log("Error occured"),
    () => console.log("Complete")
)
// Class implementations
/* class MyObserver implements Observer<number>{
    next(value){
        console.log(`value: ${value}`);
    }

    error(e){
        console.log(`error: ${e}`);
    }
    complete(){
        console.log("complete");
    }
} */


