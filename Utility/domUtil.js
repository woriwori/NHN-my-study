/*
domutil.on('.class', 'click', function() {});
domutil.on(element, 'click', function() {});
domutil.off('.class', 'click', function() {});
domutil.off(element, 'click', function() {});

[ 주 기능 ]
1. 이벤트 추가
2. 이벤트 삭제
3. 이벤트 여러개 추가
- on,off 란 이름만 봤을 땐 한개씩만 등록될거 같음.. 

[ ie 예전 버전 ]
- 캡처링 지원 안됨
- .onevent 만 지원해서 여러개의 이벤트 할당이 안됨

[ 파라미터 validation check ]
요소 검사 // The element is undefined
문자열 받으면 쿼리셀렉터로 가져오기
-> 요소가 여러개 검색되면..??? 어떤걸로..??
-> 처음꺼가져옴. 요소라는거 자체가 검색이 그렇게 되는거 같음.. add event랑은 관련 없음..
이벤트 타입 검사?
함수 검사

t instanceof Node
true
t instanceof Element
true
t instanceof HTMLElement

Node <- Element <- HTMLElement,SVGElement 인데
Node는 별 인터페이스가 다 상속하기 때문에.. Element로 타입체크하는게 좋을 듯.
https://developer.mozilla.org/ko/docs/Web/API/Element

var a = 1;
domUtil.on('a', 'click', () => console.log('hihi'))
domUtil.on('', 'click', () => console.log('hihi'))
domUtil.on(a, 'click', () => console.log('hihi'))
*/
const domUtil = (function () {
  const o = {
    element: null,
    type: '',
    handler: null,
  };
  function _on(e, t, h) {
    try {
      _validation(e, t, h); // error throw 되면 아랫줄 실행 안됨
      _addHandler();
    } catch (e) {
      return console.error(e);
    }
  }
  function _validation(element, type, handler) {
    // element
    if (!(element instanceof Element)) {
      if (typeof element !== 'string' || !element) {
        throw new Error('element 가 이상합니다.');
      } else {
        const _e = document.querySelector(element);
        if (!_e) throw new Error('is not a valid selector.');
        else element = _e;
      }
    }

    console.log('o');

    o.element = element;
    o.type = type;
    o.handler = handler;
  }
  function _addHandler() {
    console.log('_addHandler');
    o.element.addEventListener(o.type, o.handler, false);
  }
  return {
    on: function (element, type, handler) {
      _on(element, type, handler);
    },
    off: function (element, type, handler) {},
  };
})();
