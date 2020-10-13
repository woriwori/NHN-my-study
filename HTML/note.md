# HTML

- Hyper Markup Text Language
  - 프로그래밍 언어는 아니고, 우리가 보는 웹페이지가 어떻게 구조화되어 있는지 브라우저로 하여금 알 수 있도록 하는 마크업 언어
- Element
  ![image](https://mdn.mozillademos.org/files/9347/grumpy-cat-small.png)
- 블럭 레벨 요소 vs 인라인 요소(Block versus inline elements)
  - 블록 레벨 요소
    - 이전과 이후 요소사이의 줄을 바꾼다.
  - 인라인 요소
    - 항상 블록 레벨 요소내에 포함되어 있다. 
    - 인라인 요소는 문서의 한 단락같은 큰 범위에는 적용될 수 없고 문장, 단어 같은 작은 부분에 대해서만 적용될 수 있다.

---

### head 태그

- head의 내용은 화면에 표시되지 않으며, 페이지에 대한 메타데이터를 포함하는데 의미가 있다.
- meta
  - 데이터를 설명하는 데이터 (?)
  - 구성
    - name : 어떤 정보의 형태를 갖고 있는지
    - content : 실제 컨텐츠
  - Open Graph Data
    - Facebook이 웹 사이트에 더 풍부한 메타 데이터를 제공하기 위해 발명한 메타 데이터 프로토콜
    - 아래 코드처럼 추가하면, 링크에 image, title, description이 모두 표시된다.
  
  ``` html
  <meta property="og:image" content="https://developer.cdn.mozilla.net/static/img/opengraph-logo.dc4e08e2f6af.png">
  <meta property="og:description" content="The Mozilla Developer Network (MDN) ...">
  <meta property="og:title" content="Mozilla Developer Network">
  ```

### Semantic
- 텍스트 구조에 맞는 태그를 쓰자..
- ol > li 로 하면 1. 2. 3. ... 으로 순서가 생김

### Link
- 같은 웹사이트 내에서는 가능하면 상대 링크를 사용하자
  - 절대링크를 사용하면, DNS 조회부터 해서 상대 링크보다 비효율적임
- 다운로드용 링크에는 download 속성을 사용해서 다운로드될 파일의 이름을 설정할 수 있음. 
`
### Text formatting
- [링크](https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/Advanced_text_formatting)
- cite, abbr, address, time, 코드관련 태그들은 처음 봄

### HTML 디버깅
- HTML validation check를 해주는 사이트가 있다는걸 처음 알았다
