# 13장 이벤트

## DOM (Document Object Model)
동적으로 문서의 내용, 구조, 스타일에 접근하고 변경하는 수단
> DOM Level
> Level 0 : js에서 접근할 수 있는 dom이 제한적 
> Level 1 : 

## 1. 이벤트 흐름
이벤트가 전달되는 순서

### 1.1 이벤트 버블링
이벤트가 처음 발생하는 요소에서 document 또는 window 객체까지 각 노드마다 이벤트 발생

`div` -> `body` -> `html` -> `document`
```javascript 
<!DOCTYPE html>
<html>
    <head>
        <title>Event Bubbling Example</title>
    </head>
    <body>
        <div id="myDiv">Click Me</div>
    </body>
</html>
```

### 1.2 이벤트 캡처링
최상위 노드에서 이벤트가 처음 발생하는 요소까지 이벤트 발생

`div` -> `body` -> `html` -> `document`
```javascript 
<!DOCTYPE html>
<html>
    <head>
        <title>Event Bubbling Example</title>
    </head>
    <body>
        <div id="myDiv">Click Me</div>
    </body>
</html>
```

### 1.3 이벤트 흐름
- 캡처링 단계
- 타겟 단계
- 버블링 단계
  