import './App.css';
import Personal from './pages/personal/Personal';
import Network from './pages/network/Network';

function App() {
  const personal = true;
  const network = false;

  return (
    <div className="App">
      <header>
        <nav>
          <ul className="nav-right">
            <li className="a">Add</li>
            <li className="a">Quiz</li>
            <li className="a">Learn</li>
          </ul>
        </nav>
      </header>

      <main>
        { personal && <Personal /> }
        { network && <Network /> }
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;
