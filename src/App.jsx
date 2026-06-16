import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  Home, 
  CollegeExplorer, 
  CollegeDetail, 
  Cutoffs,
  Eligibility,
  CutoffAndSeats,
  PreferenceSheet, 
  Map 
} from './pages';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colleges" element={<CollegeExplorer />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/cutoffs" element={<CutoffAndSeats />} />
          <Route path="/preference-sheet" element={<PreferenceSheet />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
