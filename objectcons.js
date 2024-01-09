// object consttructor in js
function books(title,author,pages){     // its like a class of which we can make objects out of it
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.sayname = function sayname(){
        console.log(author);
    }
}
books.prototype.sayhello = function(){  // adds it up to the prototype i.e. can be used by any of the 
    console.log("say hello");
}
Object.getPrototypeOf(player) === book.prototype;
Object.getPrototypeOf(book) === Object.prototype;
const book1 = new books('harry','jenny',89);
const book2 = new books('haris','janam',81);
// book1.valueOf is a result of inheritence from object prototype hence its very valuable
console.log(book1.valueOf()=== book2.valueOf());
