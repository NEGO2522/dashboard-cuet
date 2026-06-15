import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TopNav } from './components/TopNav';
import { 
  Home, 
  CollegeExplorer, 
  CollegeDetail, 
  Cutoffs, 
  Eligibility, 
  Predictor, 
  PreferenceSheet, 
  Map 
} from './pages';

function App() {
  return (
    <Router>
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colleges" element={<CollegeExplorer />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/cutoffs" element={<Cutoffs />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/preference-sheet" element={<PreferenceSheet />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
