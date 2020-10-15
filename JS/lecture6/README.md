# 6장 객체 지향 프로그래밍

## Contents

1. [객체에 대한 이해](#1-객체에-대한-이해)
    - 프로퍼티 타입
    - 다중 프로퍼티 정의
    - 프로퍼티 속성 읽기
2. [객체 생성](#2-객체-생성)
    - 팩토리 패턴
    - 생성자 패턴
    - 프로토타입 패턴
    - 생성자 패턴과 프로토타입 패턴의 조합
    - 동적 프로토타입 패턴
    - 기생 생성자 패턴
    - 방탄 생성자 패턴
3. [상속](#3-상속)
    - 프로토타입 체인
    - 생성자 훔치기
    - 조합 상속
    - 프로토타입 상속
    - 기생 상속
    - 기생 조합 상속

---

## 1. 객체에 대한 이해

#### 객체 
> ECMA-262에서 객체는 원시값이나 객체, 함수를 포함하는 프로퍼티들의 순서 없는 컬렉션

### 1.1. 프로퍼티의 타입

    1. 데이터 프로퍼티
      - Configurable(default: true) : 해당 프로퍼티가 delete를 통해 삭제하거나 접근자 프로퍼티로 변환할 수 있음을 나타냄
      - Enumerable(default: true) : for-in 루프에서 해당 프로퍼티를 반환함을 나타냄
      - Writable(default: true) : 프로퍼티의 값을 바꿀 수 있음을 나타냄
      - Value(default: undefined) : 프로퍼티의 실제 데이터 값을 포함함
      
    2. 접근자 프로퍼티
      - 명시적으로 정할 수 없으며 Object 메서드를 사용해서 만들 수 있음
      - Configurable(default: true) : 해당 프로퍼티가 delete를 통해 삭제하거나 접근자 프로퍼티로 변환할 수 있음을 나타냄
      - Enumerable(default: true) : for-in 루프에서 해당 프로퍼티를 반환함을 나타냄
      - Get(default: undefined) : 프로퍼티 읽을 때 호출할 함수
      - Set(default: undefined) : 프로퍼티 바꿀 때 호출할 함수
      
### 1.2. 프로퍼티 정의
> [Object.defineProperty](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
  ``` javascript
 /* 데이터 프로퍼티 */
var person = {};
Object.defineProperty(person, "name", {
    configurable: false,
    value: "Nicholas"
});

alert(person.name); // Nicholas
delete person.name; // strict mode에서는 에러 발생
alert(person.name); // Nicholas
```
> [Object.defineProperties](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)
>
> get,set을 설정하면 writable, value 속성이 없어지며, 반대로 writable, value 속성을 설정하면 get, set 속성이 없어진다.
``` javascript
/* 접근자 프로퍼티 */
var book = {};

Object.defineProperties(book, {
    _year: {
        value: 2004
    },
    
    edition: {
        value: 1
    },
    
    year: {            
        get: function(){
            return this._year;
        },
        
        set: function(newValue){
            if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
            }                  
        }            
    }        
});
   
book.year = 2005;
alert(book.edition);   //2
  ```
  
### 1.3. 프로퍼티 속성 읽기
> [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
  ``` javascript
var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
alert(descriptor.value);          //2004
alert(descriptor.configurable);   //false
alert(typeof descriptor.get);     //"undefined"
  ```
  
  ## 2. 객체 생성
  같은 인터페이스를 가진 객체를 여러 개 만들기 위해 여러가지 패턴을 사용
  ### 2.1. 팩토리 패턴
  - 객체를 만드는 데 필요한 정보를 매개변수로 받아 객체를 생성하여 return
  - 생성한 객체가 어떤 타입인지 알 수 없다는 단점이 존재
  > 어떤 타입인지 알기 위해 생성된 객체의 `constructor 속성` 또는 `instanceof 연산자`를 사용할 수 있다.
  ``` javascript
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
  ```
  
 ### 2.2. 생성자 패턴
 - 팩토리 패턴과 다르게 명시적으로 객체를 생성하지 않으며 프로퍼티와 메서드는 this 객체에 직접적으로 할당
#### new 연산자의 동작
> new Foo(...)가 실행되는 경우
> 1. [Foo.prototype](#prototype-프로퍼티)을 상속하는 새로운 객체 생성
> 2. 생성자 함수에 전달한 인자와 새로운 객체에 바인드된 this와 함께 생성자 함수 Foo 호출
> 3. 생성한 객체를 리턴
#### new 연산자로 생성된 객체
> 생성된 객체는 [Foo.prototype](#prototype-프로퍼티)을 가리키는 **\__proto__** 을 가진다. <br>
> (예전엔 \__proto__ 가 [[Prototype]]이었음 - [참고](https://2ality.com/2015/09/proto-es6.html))
>
> **\__proto__** 는 생략할 수 있다. <br>
> instance.propertyA === instance.\__proto__.propertyA === Foo.prototype.propertyA
  ``` javascript
function Person(name, age, job){ // 생성자 패턴에서 함수명은 대문자로 시작
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    }
}
// 1. 생성자로 사용
var person = new Person('Nicholas', 29, 'Software Engineer');
person.sayName(); 

// 2. 함수로 호출
// Person.prototype을 상속 받지 않는다.
Person('Greg', 27, 'Doctor');
window.sayName(); 

// 3. 다른 객체의 스코프에서 호출
// Person.prototype을 상속 받지 않는다.
var o = new Object();
Person.call(o, 'Kristen', 24, 'Nurse');
o.sayName();
  ```
단, 인스턴스를 생성할 때마다 함수 인스턴스가 생성된다는 단점이 존재
``` javascript
this.sayName = function(){
    alert(this.name);
}
// 위의 코드는 아래와 동일
this.sayName = new Function('alert(this.name)'); 
```

위 단점은 아래와 같이 함수를 분리하는 방식으로 해결할 수 있다.
``` javascript 
function Person(name, age, job){
    ...
    this.sayName = sayName;
    ...
}
function sayName(){
    alert(this.name);
}
```
### 2.3. 프로토타입 패턴
- 모든 함수는 prototype 프로퍼티를 가진다.
- prototype 프로퍼티는 함수를 생성자로 호출할 때 생성되는 인스턴스가 가져야 할 프로퍼티와 메서드를 가지고 있다.
- prototype 프로퍼티의 프로퍼티와 메서드는 생성자 함수를 통해 생성된 모든 인스턴스가 공유한다.
- [new 연산자의 동작 참고](#new-연산자의-동작)
#### prototype 프로퍼티
> 함수가 생성될 때 같이 생성된다.  
> 자동으로 constructor 프로퍼티를 가지며 소속된 함수를 값으로 가리킨다.
>
> ![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/prototype1.png?raw=true)

#### 자바스크립트는 프로토타입 기반 언어 
> 자바스크립트는 어떤 객체를 원형으로 삼고 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻을 수 있는 언어다.

``` javascript 
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
```

- 또 다른 방법
```javascript
function Person(){ // (1)
}
Person.prototype = { // (2)
    name : "Nicholas",
    age : 29,
    job: "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
var friend = new Person();

alert(friend instanceof Object);  //true
alert(friend instanceof Person);  //true
alert(friend.constructor == Object);  //true (3)
alert(friend.constructor == Person);  //false (4)
```

(1) Person.prototype에는 원래 Person을 가리키는 constructor가 존재했으나 

(2) 새로운 객체로 덮어씌움으로써 constructor 프로퍼티가 없어졌고 자동의로 생성되었던 Person과 Person.prototype의 관계가 끊어짐

(3) friend.constructor는 **`friend` -> `Person.prototype` -> `Object.prototype`** 순서로 찾음
- friend.(\__proto__).constructor === friend.(\__proto__).(\__proto__).constructor
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/prototype2.png?raw=true)

(4) false가 아닌 true려면 아래와 같이 직접 삽입

```javascript
Person.prototype.constructor = Person;
```
단, 자동 생성되는 constructor는 프로퍼티 속성 중 **Configurable, Enumerable** 속성이 `false`이므로
[Object.defineProperty](#프로퍼티-정의)로 속성을 직접 수정해야한다.
```javascript
function Person(){
}
Object.getOwnPropertyDescriptor(Person, 'prototype')
// {value: {…}, writable: true, enumerable: false, configurable: false}
```
- 프로토타입의 동적 성질
  - 프로토타입이 바뀌면 모든 인스턴스에 즉시 반영된다.
 ```javascript
 var friend = new Person();
Person.prototype.sayHi = function(){
    alert("hi");
};
friend.sayHi();   //"hi"
 ```
  - 프로토타입을 다른 객체로 바꾸면 생성자와 원래 프로토타입 사이의 연결이 끊어진다.
 ```javascript
 function Person(){
 }
var friend = new Person();

var otherPrototype = {
    constructor: Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
Person.prototype = otherPrototype;

friend.sayName();   //error
 ``` 
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/prototype3.png?raw=true)

- 프로토타입의 문제점
  - 생성자 초기화 매개변수를 프로토타입에 전달할 수 없음
  - 인스턴스 값을 조작하면 다른 인스턴스에 영향을 줄 수 있음
```javascript
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
```

### 2.4. 생성자 패턴과 프로토타입 패턴의 조합
- 생성자 패턴으로 인스턴스 프로퍼티 정의
- 프로토타입 패턴으로 메서드와 공유 프로퍼티 정의
- 가장 널리 쓰이는 패턴
``` javascript
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
```

### 2.5. 동적 프로토타입 패턴
- 모든 정보를 생성자 내부에 캡슐화
- 프로토타입이 필요한 경우에도 생성자 내부에서 프로토타입을 초기화
```javascript
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
```
### 2.6. 기생(parasitic) 생성자 패턴
- 다른 객체를 생성하고 반환하는 동작을 래퍼 생성자로 감싸는 패턴
- new 연산자로 함수를 생성자로 호출한다는 점을 제외하곤 팩토리 패턴과 동일
```javascript
function SpecialArray(){       

    //create the array
    var values = new Array();
    
    //add the values
    values.push.apply(values, arguments);
    
    //assign the method
    values.toPipedString = function(){
        return this.join("|");
    };
    
    //return it
    return values;        
}

var colors = new SpecialArray("red", "blue", "green");
alert(colors.toPipedString()); //"red|blue|green"
```
### 2.7. 방탄(durable) 생성자 패턴
- 방탄 객체 : 공용 프로퍼티가 없고 메서드가 this를 참조하지 않는 객체
- new 연산자로 함수를 호출하지 않음
```javascript
function Person(name){
    var o = new Object();
    o.sayName = function(){
        alert(name);
    };
    return o;
}
var friend = Person('Nicholas');
friend.sayName(); // 'Nicholas'
```


## 3. 상속
> 객체가 A객체를 상속한다 => 객체의 \__proto__가 A 객체를 가리키게 한다.

### 상속이란??
> mdn
> JavaScript는 흔히 프로토타입 기반 언어(prototype-based language)라 불립니다. <br>
> 모든 객체들이 메소드와 속성들을 상속 받기 위한 템플릿으로써 프로토타입 객체(prototype object)를 가진다는 의미입니다. <br>
> 프로토타입 객체도 또 다시 상위 프로토타입 객체로부터 메소드와 속성을 상속 받을 수도 있고 그 상위 프로토타입 객체도 마찬가지입니다. <br>
> 이를 프로토타입 체인(prototype chain)이라 부르며 다른 객체에 정의된 메소드와 속성을 한 객체에서 사용할 수 있도록 하는 근간입니다.

정확히 말하자면 상속되는 속성과 메소드들은 각 객체가 아니라 객체의 생성자의 prototype이라는 속성에 정의되어 있습니다.
### 3.1. 프로토타입 체인
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/inheritance.png?raw=true)
```javascript
function SuperType(){
    this.superProperty = true;
}

SuperType.prototype.getSuperValue = function(){
    return this.superProperty;
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
```
> - SuperType 생성자에 매개변수를 전달할 수 없다.
> - instance로 SuperType의 superProperty를 수정하면 SubType으로 새로 생성하는 인스턴스의 superProperty값도 변경된다.

### 3.2. 생성자 훔치기 (constructor stealing)
- 위장 객체 (object masquearading) 또는 전통적 상속 (classical inheritance)
- 하위 타입 생성자 안에서 상위 타입 생성자를 호출
``` javascript
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
alert(instance instanceof SuperType); // false (1)
alert(instance instanceof SubType); // true
```
이 경우 (1)과 같이 instance는 SuperType의 prototype에 접근할 수 없다는 단점이 있음

### 3.3. 조합 상속
3.1 과 3.2를 합친 것으로 프로토타입 체인을 통해 프로퍼티와 메서드를 상속하고, 생성자 훔치기로 인스턴스 프로퍼티를 상속한다.
> 가장 많이 쓰이는 상속패턴이라고 함
``` javascript 
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
```
### 3.4. 프로토타입 상속
인자로 넘긴 객체를 prototype에 할당해 \__proto__로 접근할 수 있도록 하여 상속을 구현
``` javascript
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}

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
```

<br>

ES5에 Object.create 메서드로 추가됨
> [Object.create](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
> 
> 첫번째 인자로 넘긴 객체가 새로 생성되는 객체로 프로토타입(prototype 프로퍼티가 아니라 \__proto__가 가리키는 객체)이 된다.
```javascript
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = Object.create(person, {
    name: {
        value: "Greg"
    }
});

alert(anotherPerson.name);  //"Greg"
```
퀴즈...
```javascript
function test(){}
var o1 = Object.create(test);
var o2 = Object.create(test.prototype);
var o3 = new test();

o2.prototype === o3.prototype
o2.constructor === o3.constructor === ?? // 1)

o1.(__proto__) === test // 2) ??
o1.(__proto__).prototype === test.prototype // 3) ??
o1.(__proto__).prototype.constructor === test // 4) ??
o1.constructor ===  5) ??
o1.(__proto__).(__proto__).prototype === 6) ??
```
> 정답
>
> 1) function test(){}
> 2) ~ 4) true
> 5) <br>
> o1.constructor === Function <br>
> === o1.(__proto__).(__proto__).constructor <br>
> === test.constructor <br>
> 6) <br>
> undefined

### 3.5. 기생 상속
객체 생성의 기생 생성자나 팩토리 패턴과 비슷하다.  
상속을 담당할 함수를 만들고 어떤 식으로든 객체를 확장해서 반환한다. 
```javascript
function createAnother(original){
    var clone = object(original);
    clone.sayHi = function(){
        alert('Hi!');
    };
    return clone;
}
var person = {
    name: 'Nicholas',
    friends: ['Shelby', 'Court', 'Van']
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // Hi!
```
### 3.6. 기생 조합 상속
[조합 상속](#3.3.-조합-상속)은 상위 타입 생성자가 항상 두번 호출된다는 비효율적인 부분이 있다.  
상위 타입의 생성자를 new 연산자로 호출하는 부분을 기생 상속 방법을 사용하여 개선한다.
```javascript
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}

function inheritPrototype(subType, superType){
    var prototype = object(superType.prototype);   // (1) 
    prototype.constructor = subType;               // (2) 
    subType.prototype = prototype;                 // (3) 
}
                        
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

inheritPrototype(SubType, SuperType);

SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29); // (4)
instance1.colors.push("black");
alert(instance1.colors);  //"red,blue,green,black"
instance1.sayName();      //"Nicholas";
instance1.sayAge();       //29


var instance2 = new SubType("Greg", 27);
alert(instance2.colors);  //"red,blue,green"
instance2.sayName();      //"Greg";
instance2.sayAge();       //27
```
(1) 객체를 생성한다.
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/inheritance1.png?raw=true)
(2) 생성한 객체의 constructor 가 subtype을 가리키도록 한다.
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/inheritance2.png?raw=true)
(3) subtype의 prototype이 생성한 객체를 가리키도록 한다.
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/inheritance3.png?raw=true)
(4) subtype으로 인스턴스를 생성한다.
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/inheritance4.png?raw=true)

## 참조
- [코어 자바스크립트](https://book.naver.com/bookdb/book_detail.nhn?bid=15433261)
