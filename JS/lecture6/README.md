# 6장 객체 지향 프로그래밍

## Contents

1. 객체에 대한 이해
    - 프로퍼티 타입
    - 다중 프로퍼티 정의
    - 프로퍼티 속성 읽기
2. 객체 생성
    - 팩토리 패턴
    - 생성자 패턴
    - 프로토타입 패턴
    - 생성자 패턴과 프로토타입 패턴의 조합
    - 동적 프로토타입 패턴
    - 기생 생성자 패턴
    - 방탄 생성자 패턴
3. 상속
    - 프로토타입 체인
    - 생성자 훔치기
    - 조합 상속
    - 프로토타입 상속
    - 기생 상속
    - 기생 조합 상속
 
---

### 객체 
> ECMA-262에서 객체는 원시값이나 객체, 함수를 포함하는 프로퍼티들의 순서 없는 컬렉션
### 프로토타입 기반 언어 
> 어떤 객체를 원형으로 삼고 이를 복제(참조)함으로써 상속과 비슷한 효과를 얻을 수 있는 언어

---

## 1. 객체에 대한 이해

### 1.1. 프로퍼티의 타입

    1. 데이터 프로퍼티
      -  Configurable(default: true) : 해당 프로퍼티가 delete를 통해 삭제하거나 접근자 프로퍼티로 변환할 수 있음을 나타냄
      -  Enumerable(default: true) : for-in 루프에서 해당 프로퍼티를 반홚함을 나타냄
      -  Writable(default: true) : 프로퍼티의 값을 바꿀 수 있음을 나타냄
      -  Value(default: undefined) : 프로퍼티의 실제 데이터 값을 포함함
      
    2. 접근자 프로퍼티
      - 명시적으로 정할 수 없으며 Object 메서드를 사용해서 만들 수 있음
      - Configurable(default: true) : 해당 프로퍼티가 delete를 통해 삭제하거나 접근자 프로퍼티로 변환할 수 있음을 나타냄
      -  Enumerable(default: true) : for-in 루프에서 해당 프로퍼티를 반홚함을 나타냄
      -  Get(default: undefined) : 프로퍼티 읽을 떄 호출할 함수
      -  Set(default: undefined) : 프로퍼티 바꿀 떄 호출할 함수
      
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
  --> 프로퍼티의 값을 바꿧을 때 해당 프로퍼티 뿐만이 아니라 다른 프로퍼티에도 부수적인 절차가 필요한 경우에 사용
  
### 1.3. 프로퍼티 속성 읽기
> [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
  ``` javascript
var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
alert(descriptor.value);          //2004
alert(descriptor.configurable);   //false
alert(typeof descriptor.get);     //"undefined"
  ```
  
  ## 2. 객체의 생성
  
  ### 2.1. 팩토리 패턴
  - 객체를 만드는 데 필요한 정보를 매개변수로 받아 객체를 생성하여 return
  - 생성한 객체가 어떤 타입인지 알 수 없다는 단점이 존재
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
 - `instanceof 연산자`와 `constructor 프로퍼티`를 활용하여 객체의 타입을 확인할 수 있다
#### new 연산자의 동작
> new Foo(...)이 실행되는 경우
> 1. [Foo.prototype](#prototype-프로퍼티)을 상속하는 새로운 객체 생성
> 2. 생성자 함수에 전달한 인자와 새로운 객체에 바인드된 this와 함께 생성자 함수 Foo이 호출
> 3. 생성한 객체를 리턴
> 생성된 객체는 Foo.prototype을 가리키는 **\__proto__** 을 가진다. 
> (예전엔 \__proto__ 가 [[Prototype]]이었음)
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
window.sayName(); // Person내에서 가리키는 this가 window가 되는거 같음.. (??)

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
- 모든 함수는 prototype 프로퍼티를 가지며, prototype 프로퍼티는 함수를 생성자로 호출할 때 생성되는 인스턴스가 가져야 할 프로퍼티와 메서드를 가지고 있다.
- prototype 프로퍼티의 프로퍼티와 메서드는 생성자 함수를 통해 생성된 모든 인스턴스가 공유한다.
- [new 연산자의 동작 참고](#new-연산자의-동작)
#### prototype 프로퍼티
> 함수가 생성될 때 같이 생성된다.  
> 자동으로 constructor 프로퍼티를 가지며 소속된 함수를 값으로 가리킨다.
> ![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/prototype1.JPG?raw=true)
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

(2) 새로운 객체로 덮어씌움으로써 constructor 프로퍼티가 없어짐

(3) friend.constructor는 **`friend` -> `Person.prototype` -> `Object.prototype`** 순서로 찾음
- friend.(\__proto__).constructor === friend.(\__proto__).(\__proto__).constructor
![Alt text](https://github.com/woriwori/study-toast/blob/main/JS/lecture6/prototype1.JPG?raw=true)

(4) false가 아닌 true려면 아래와 같이 직접 삽입

```javascript
Person.prototype.constructor = Person;
```
단, 자동 생성되는 constructor는 프로퍼티 속성 중 **Configurable, Enumerable** 속성이 `false`이므로
Object.defineProperty로 속성을 직접 수정해야한다.
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
 ```
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




