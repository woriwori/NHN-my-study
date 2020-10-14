// 222p
function createPerson(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        alert(this.name);
    }
    return o;
}
var person1 = createPerson('Nicholas', 29, 'Software Engineer');

// 223p
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    }
}
var person1 = new Person('Nicholas', 29, 'Software Engineer');

// 225
// 생성자로 사용
var person = new Person('Nicholas', 29, 'Software Engineer');
person.sayName(); 

// 함수로 호출
Person('Greg', 27, 'Doctor');
window.sayName(); // Person내에서 가리키는 this가 window가 되는거 같음.. (??)

// 다른 객체의 스코프에서 호출
var o = new Object();
Person.call(o, 'Kristen', 24, 'Nurse');
o.sayName();

//226p 1
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = new Function('alert(this.name)');
}
//226p 2
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
function sayName(){
    alert(this.name);
}

// 227
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
person1.sayName();   //"Nicholas"

var person2 = new Person();
person2.sayName();   //"Nicholas"

alert(person1.sayName == person2.sayName);  //true

// 229 1
alert(Person.prototype.isPrototypeOf(person1));  //true
// person1.__proto__ === Person.prototype (true)
alert(Person.prototype.isPrototypeOf(person2));  //true

// 229 2
//only works if Object.getPrototypeOf() is available
if (Object.getPrototypeOf){
    alert(Object.getPrototypeOf(person1) == Person.prototype);  //true
    alert(Object.getPrototypeOf(person1).name);  //"Nicholas"
}

// 232
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
var person2 = new Person();

alert(person1.hasOwnProperty("name"));  //false
alert("name" in person1);  //true

person1.name = "Greg";
alert(person1.name);   //"Greg" � from instance
alert(person1.hasOwnProperty("name"));  //true
alert("name" in person1);  //true

alert(person2.name);   //"Nicholas" � from prototype
alert(person2.hasOwnProperty("name"));  //false
alert("name" in person2);  //true

delete person1.name;
alert(person1.name);   //"Nicholas" - from the prototype
alert(person1.hasOwnProperty("name"));  //false
alert("name" in person1);  //tr

// 236 1
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var keys = Object.keys(Person.prototype);
console.log(keys);   //["name","age","job","sayName"]
// 236 2
var keys = Object.getOwnPropertyNames(Person.prototype);
console.log(keys);   //["constructor","name","age","job","sayName"]

// 237
function Person(){
}
Person.prototype = {
    name : "Nicholas",
    age : 29,
    job: "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};

// 239
var friend = new Person();
        
Person.prototype.sayHi = function(){
    alert("hi");
};

friend.sayHi();   //"hi" � works!

// 239-240
Person.prototype = {
    constructor: Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};

friend.sayName();   //error

// 242 
function Person(){
}

Person.prototype = {
    constructor: Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    friends : ["Shelby", "Court"],
    sayName : function () {
        alert(this.name);
    }
};

var person1 = new Person();
var person2 = new Person();

person1.friends.push("Van");

alert(person1.friends);    //"Shelby,Court,Van"
alert(person2.friends);    //"Shelby,Court,Van"
alert(person1.friends === person2.friends);  //true

// 243
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}

Person.prototype = {
    constructor: Person,
    sayName : function () {
        alert(this.name);
    }
};

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");

alert(person1.friends);    //"Shelby,Court,Van"
alert(person2.friends);    //"Shelby,Court"
alert(person1.friends === person2.friends);  //false
alert(person1.sayName === person2.sayName);  //true

// 244
          
function Person(name, age, job){
        
    //properties
    this.name = name;
    this.age = age;
    this.job = job;
    
    //methods
    if (typeof this.sayName != "function"){
    
        Person.prototype.sayName = function(){
            alert(this.name);
        };
        
    }
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();

// 249

function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
};

function SubType(){
    this.subproperty = false;
}

//inherit from SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function (){
    return this.subproperty;
};

var instance = new SubType();
alert(instance.getSuperValue());   //true

alert(instance instanceof Object);      //true
alert(instance instanceof SuperType);   //true
alert(instance instanceof SubType);     //true

alert(Object.prototype.isPrototypeOf(instance));    //true
alert(SuperType.prototype.isPrototypeOf(instance)); //true
alert(SubType.prototype.isPrototypeOf(instance));   //true

// 254
function SuperType(){
    this.colors = ["red", "blue", "green"];
}

function SubType(){            
}

//inherit from SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);    //"red,blue,green,black"

var instance2 = new SubType();
alert(instance2.colors);    //"red,blue,green,black"

// 255
function SuperType(){
    this.colors = ["red", "blue", "green"];
}

function SubType(){  
    //inherit from SuperType
    SuperType.call(this);
}

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);    //"red,blue,green,black"

var instance2 = new SubType();
alert(instance2.colors);    //"red,blue,green"

// 256
            
function SuperType(name){
    this.name = name;
}

function SubType(){  
    //inherit from SuperType passing in an argument
    SuperType.call(this, "Nicholas");
    
    //instance property
    this.age = 29;
}

var instance = new SubType();
alert(instance.name);    //"Nicholas";
alert(instance.age);     //29
alert(instance instanceof SuperType); // false
alert(instance instanceof SubType); // true

// 257
            
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    alert(this.name);
};

function SubType(name, age){  
    SuperType.call(this, name);
    
    this.age = age;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors);  //"red,blue,green,black"
instance1.sayName();      //"Nicholas";
instance1.sayAge();       //29


var instance2 = new SubType("Greg", 27);
alert(instance2.colors);  //"red,blue,green"
instance2.sayName();      //"Greg";
instance2.sayAge();       //27

// 258 1
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}

// 258 2
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"