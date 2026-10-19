let content = {};

content.html = `
<main class="welcome">
  <span class="tag">A little experiment</span>
  <h1>Hello, <em>curious</em> mind.</h1>
  <p>Change the code and watch your ideas take shape.</p>
  <button onclick="this.textContent='Nice work ✨'">Try me</button>
</main>
`

content.css = `
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f3ef;
  color: #20211f;
  font-family: system-ui, sans-serif;
}
.welcome { text-align: center; padding: 2rem; }
.tag {
  color: #647243;
  text-transform: uppercase;
  letter-spacing: .14em;
  font-size: .7rem;
  font-weight: 700;
}
h1 { font-size: clamp(2.5rem, 8vw, 5rem); letter-spacing: -.07em; margin: .8rem 0; }
h1 em { color: #839956; font-style: normal; }
p { color: #6f706a; }
button {
  margin-top: 1rem; border: 0; border-radius: 999px;
  padding: .85rem 1.3rem; background: #20211f; color: white;
  font: inherit; cursor: pointer;
}
button:hover { background: #647243; }
`

export default content