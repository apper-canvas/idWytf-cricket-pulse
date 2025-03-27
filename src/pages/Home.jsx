import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronDown, ChevronUp, Clock, MapPin, Filter } from 'lucide-react';
import MainFeature from '../components/MainFeature';

// Mock data for live matches
const MOCK_MATCHES = [
  {
    id: "m1",
    teams: [
      { id: "ind", name: "India", shortName: "IND", logoUrl: "" },
      { id: "aus", name: "Australia", shortName: "AUS", logoUrl: "" }
    ],
    venue: "Melbourne Cricket Ground",
    startTime: new Date().toISOString(),
    status: "LIVE",
    format: "T20",
    series: "India Tour of Australia 2023",
    currentInnings: 1,
    scorecard: [
      {
        battingTeam: "ind",
        bowlingTeam: "aus",
        runs: 156,
        wickets: 4,
        overs: 16.2,
        runRate: 9.55,
      }
    ]
  },
  {
    id: "m2",
    teams: [
      { id: "eng", name: "England", shortName: "ENG", logoUrl: "" },
      { id: "nz", name: "New Zealand", shortName: "NZ", logoUrl: "" }
    ],
    venue: "Lord's Cricket Ground",
    startTime: new Date().toISOString(),
    status: "LIVE",
    format: "ODI",
    series: "New Zealand Tour of England 2023",
    currentInnings: 1,
    scorecard: [
      {
        battingTeam: "eng",
        bowlingTeam: "nz",
        runs: 210,
        wickets: 6,
        overs: 35.4,
        runRate: 5.89,
      }
    ]
  },
  {
    id: "m3",
    teams: [
      { id: "pak", name: "Pakistan", shortName: "PAK", logoUrl: "" },
      { id: "sa", name: "South Africa", shortName: "SA", logoUrl: "" }
    ],
    venue: "National Stadium, Karachi",
    startTime: new Date(Date.now() + 3600000).toISOString(),
    status: "UPCOMING",
    format: "TEST",
    series: "South Africa Tour of Pakistan 2023",
    currentInnings: 0,
    scorecard: []
  }
];

function Home() {
  const [matches, setMatches] = useState(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState(matches[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Simulate refreshing scores
  const refreshScores = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Update scores with random increments to simulate live updates
      const updatedMatches = matches.map(match => {
        if (match.status === "LIVE") {
          const scorecard = [...match.scorecard];
          if (scorecard.length > 0) {
            const currentInnings = {...scorecard[0]};
            
            // Random updates to runs and overs
            const runsIncrement = Math.floor(Math.random() * 6);
            currentInnings.runs += runsIncrement;
            
            // Occasionally increment wickets
            if (Math.random() > 0.85 && currentInnings.wickets < 10) {
              currentInnings.wickets += 1;
            }
            
            // Update overs
            const currentOverBalls = Math.round((currentInnings.overs % 1) * 10);
            if (currentOverBalls < 5) {
              currentInnings.overs = Math.floor(currentInnings.overs) + ((currentOverBalls + 1) / 10);
            } else {
              currentInnings.overs = Math.floor(currentInnings.overs) + 1;
            }
            
            // Update run rate
            currentInnings.runRate = parseFloat((currentInnings.runs / currentInnings.overs).toFixed(2));
            
            scorecard[0] = currentInnings;
          }
          return {...match, scorecard};
        }
        return match;
      });
      
      setMatches(updatedMatches);
      
      // Update selected match if it's in the list
      const updatedSelectedMatch = updatedMatches.find(m => m.id === selectedMatch.id);
      if (updatedSelectedMatch) {
        setSelectedMatch(updatedSelectedMatch);
      }
      
      setIsLoading(false);
    }, 1200);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshScores, 30000);
    return () => clearInterval(interval);
  }, [matches, selectedMatch]);

  // Filter matches
  const filteredMatches = matches.filter(match => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "LIVE") return match.status === "LIVE";
    if (activeFilter === "UPCOMING") return match.status === "UPCOMING";
    if (activeFilter === "T20") return match.format === "T20";
    if (activeFilter === "ODI") return match.format === "ODI";
    if (activeFilter === "TEST") return match.format === "TEST";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
            Live Cricket Scores
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            Real-time updates from matches around the world
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filters</span>
            {expandedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button 
            onClick={refreshScores} 
            className="btn btn-primary"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {expandedFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-4">
              <div className="flex flex-wrap gap-2">
                {["ALL", "LIVE", "UPCOMING", "T20", "ODI", "TEST"].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeFilter === filter 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
            Matches
          </h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pr-1">
            {filteredMatches.length > 0 ? (
              filteredMatches.map(match => (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedMatch(match)}
                  className={`card p-4 cursor-pointer transition-all ${
                    selectedMatch.id === match.id 
                      ? 'border-primary dark:border-primary-light border-2' 
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      match.status === 'LIVE' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {match.status === 'LIVE' ? 'LIVE' : 'UPCOMING'}
                    </span>
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                      {match.format}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold">
                          {match.teams[0].shortName.charAt(0)}
                        </div>
                        <span className="font-semibold">{match.teams[0].shortName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xs font-bold">
                          {match.teams[1].shortName.charAt(0)}
                        </div>
                        <span className="font-semibold">{match.teams[1].shortName}</span>
                      </div>
                    </div>
                    
                    {match.status === 'LIVE' && match.scorecard.length > 0 && (
                      <div className="text-right">
                        <div className="font-bold">
                          {match.scorecard[0].runs}/{match.scorecard[0].wickets}
                        </div>
                        <div className="text-sm text-surface-600 dark:text-surface-400">
                          {match.scorecard[0].overs.toFixed(1)} overs
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-surface-200 dark:border-surface-700 flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                    <MapPin size={12} />
                    <span className="truncate">{match.venue}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="card p-6 text-center">
                <p className="text-surface-500 dark:text-surface-400">No matches found with the selected filter.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <MainFeature match={selectedMatch} />
        </div>
      </div>
    </div>
  );
}

export default Home;