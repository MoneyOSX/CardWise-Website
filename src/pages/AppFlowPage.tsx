import { Routes, Route } from 'react-router-dom';
import WizardLayout from '../components/wizard/WizardLayout';
import ResultsPage from '../components/results/ResultsPage';

export default function AppFlowPage() {
    return (
        <Routes>
            <Route path="/" element={<WizardLayout />} />
            <Route path="/results" element={<ResultsPage />} />
        </Routes>
    );
}
