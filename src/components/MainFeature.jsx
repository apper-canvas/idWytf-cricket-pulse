import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  BarChart3, 
  Users, 
  MessageCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Trophy,
  Activity
} from 'lucide-react';

// Mock data for commentary
const MOCK_COMMENTARY = [
  { id: 1, over: "16.2", description: "FOUR! Sharma drives through the covers for a boundary", type: "BOUNDARY" },
  { id: 2, over: "16.1", description: "Full toss outside off, defended back to the bowler", type: "NORMAL" },
  { id: 3, over: "15.6", description: "End of the over. 7 runs from it.", type: "OVERCHANGE" },
  { id: 4, over: "15.5", description: "WICKET! Kohli caught at mid-off. He departs for 45.", type: "WICKET" },
  { id: 5, over: "15.4", description: "SIX! Massive hit over long-on!", type: "BOUNDARY" },
  { id: 6, over: "15.3", description: "Short ball, pulled away for a single", type: "NORMAL" },
  { id: 7, over: "15.2", description: "Defended on the front foot", type: "NORMAL" },
  { id: 8, over: "15.1", description: "Good length delivery, pushed to mid-off for no run", type: "NORMAL" },
];

// Mock data for player stats
const MOCK_BATSMEN = [
  { id: "p1", name: "Rohit Sharma", runs: 62, balls: 48, fours: 6, sixes: 3, strikeRate: 129.17, isPlaying: true },
  { id: "p2", name: "KL Rahul", runs: 35, balls: 30, fours: 3, sixes: 1, strikeRate: 116.67, isPlaying: true },
  { id: "p3", name: "Virat Kohli", runs: 45, balls: 32, fours: 4, sixes: 2, strikeRate: 140.63, isPlaying: false },
];

const MOCK_BOWLERS = [
  { id: "b1", name: "Pat Cummins", overs: 4, maidens: 0, runs: 32, wickets: 1, economy: 8.00 },
  { id: "b2", name: "Mitchell Starc", overs: 3.2, maidens: 0, runs: 28, wickets: 2, economy: 8.40 },
  { id: "b3", name: "Josh Hazlewood", overs: 4, maidens: 0, runs: 24, wickets: 1, economy: 6.00 },
];

function MainFeature({ match }) {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [commentary, setCommentary] = useState(MOCK_COMMENTARY);
  const [batsmen, setBatsmen] = useState(MOCK_BATSMEN);
  const [bowlers, setBowlers] = useState(MOCK_BOWLERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFullCommentary, setShowFullCommentary] = useState(false);
  const [predictionExpanded, setPredictionExpanded] = useState(false);
  
  // Simulate refreshing commentary
  const refreshCommentary = () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Add a new commentary entry
      const newEntry = {
        id: commentary.length + 1,
        over: (parseFloat(commentary[0].over) + 0.1).toFixed(1),
        description: Math.random() > 0.8 
          ? "FOUR! Beautiful shot through the covers!" 
          : "Defended on the front foot, no run",
        type: Math.random() > 0.8 ? "BOUNDARY" : "NORMAL"
      };
      
      setCommentary([newEntry, ...commentary]);
      setIsRefreshing(false);
    }, 800);
  };
  
  // Update batsmen stats when match changes
  useEffect(() => {
    if (match && match.status === "LIVE") {
      // Simulate updating batsmen stats based on match
      const updatedBatsmen = batsmen.map(batsman => {
        // Random updates to simulate live changes
        if (batsman.isPlaying) {
          const runsIncrement = Math.floor(Math.random() * 2);
          const ballsIncrement = runsIncrement > 0 ? 1 : Math.random() > 0.5 ? 1 : 0;
          const foursIncrement = runsIncrement === 4 ? 1 : 0;
          const sixesIncrement = runsIncrement === 6 ? 1 : 0;
          
          const newRuns = batsman.runs + runsIncrement;
          const newBalls = batsman.balls + ballsIncrement;
          
          return {
            ...batsman,
            runs: newRuns,
            balls: newBalls,
            fours: batsman.fours + foursIncrement,
            sixes: batsman.sixes + sixesIncrement,
            strikeRate: parseFloat(((newRuns / newBalls) * 100).toFixed(2))
          };
        }
        return batsman;
      });
      
      setBatsmen(updatedBatsmen);
    }
  }, [match]);

  // If no match is selected
  if (!match) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-surface-400" />
        <h3 className="text-xl font-semibold mb-2">No Match Selected</h3>
        <p className="text-surface-500 dark:text-surface-400">
          Please select a match from the list to view detailed information.
        </p>
      </div>
    );
  }

  // For upcoming matches
  if (match.status === "UPCOMING") {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{match.series}</h2>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-sm font-medium">
              Upcoming
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xl font-bold">
                {match.teams[0].shortName}
              </div>
              <h3 className="mt-2 font-semibold text-lg">{match.teams[0].name}</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-surface-400 mb-2">VS</div>
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                <Clock size={14} />
                <span>Starts in 1 hour</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-xl font-bold">
                {match.teams[1].shortName}
              </div>
              <h3 className="mt-2 font-semibold text-lg">{match.teams[1].name}</h3>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 card-neu p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-surface-500" />
                <h4 className="font-medium">Venue</h4>
              </div>
              <p className="text-surface-700 dark:text-surface-300">{match.venue}</p>
            </div>
            
            <div className="flex-1 card-neu p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-surface-500" />
                <h4 className="font-medium">Format</h4>
              </div>
              <p className="text-surface-700 dark:text-surface-300">{match.format}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              className="w-full btn btn-primary py-3"
              onClick={() => alert("Notification set for match start!")}
            >
              Set Reminder for Match Start
            </button>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity size={18} />
            Match Prediction
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-center">
                <div className="text-lg font-bold">{match.teams[0].shortName}</div>
                <div className="text-sm text-surface-500">45%</div>
              </div>
              
              <div className="flex-1 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '45%' }}></div>
              </div>
              
              <div className="w-24 text-center">
                <div className="text-lg font-bold">{match.teams[1].shortName}</div>
                <div className="text-sm text-surface-500">55%</div>
              </div>
            </div>
            
            <button
              onClick={() => setPredictionExpanded(!predictionExpanded)}
              className="w-full text-center text-sm text-primary dark:text-primary-light flex items-center justify-center gap-1 mt-2"
            >
              {predictionExpanded ? "Show Less" : "View Detailed Prediction"}
              {predictionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            <AnimatePresence>
              {predictionExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="card-neu p-3">
                        <h4 className="text-sm font-medium mb-2">Head to Head</h4>
                        <div className="flex justify-between text-sm">
                          <span>{match.teams[0].shortName}: 12 wins</span>
                          <span>{match.teams[1].shortName}: 15 wins</span>
                        </div>
                      </div>
                      
                      <div className="card-neu p-3">
                        <h4 className="text-sm font-medium mb-2">Recent Form</h4>
                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{match.teams[0].shortName}:</span>
                            <div className="flex gap-1 mt-1">
                              {['W', 'L', 'W', 'W', 'L'].map((result, i) => (
                                <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                  result === 'W' 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {result}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">{match.teams[1].shortName}:</span>
                            <div className="flex gap-1 mt-1">
                              {['W', 'W', 'W', 'L', 'W'].map((result, i) => (
                                <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                                  result === 'W' 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                  {result}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card overflow-visible">
        <div className="bg-gradient-to-r from-primary to-primary-dark dark:from-primary-dark dark:to-primary p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white text-xl font-bold">{match.series}</h2>
              <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                <MapPin size={14} />
                <span>{match.venue}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-white font-medium text-sm">LIVE</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary font-bold">
                {match.teams[0].shortName}
              </div>
              <div>
                <h3 className="text-white font-semibold">{match.teams[0].name}</h3>
                {match.scorecard.length > 0 && match.scorecard[0].battingTeam === match.teams[0].id && (
                  <div className="text-white font-bold text-xl animate-score-change">
                    {match.scorecard[0].runs}/{match.scorecard[0].wickets}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-white/80 text-sm">
              {match.format} Match
            </div>
            
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-white font-semibold text-right">{match.teams[1].name}</h3>
                {match.scorecard.length > 0 && match.scorecard[0].battingTeam === match.teams[1].id && (
                  <div className="text-white font-bold text-xl text-right animate-score-change">
                    {match.scorecard[0].runs}/{match.scorecard[0].wickets}
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary font-bold">
                {match.teams[1].shortName}
              </div>
            </div>
          </div>
          
          {match.scorecard.length > 0 && (
            <div className="mt-4 bg-white/10 rounded-lg p-3 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Current Run Rate:</span>
                  <span className="ml-2">{match.scorecard[0].runRate.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium">Overs:</span>
                  <span className="ml-2">{match.scorecard[0].overs.toFixed(1)}/20.0</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-1 bg-surface-100 dark:bg-surface-800">
          <div className="flex">
            {['scorecard', 'commentary', 'stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-center font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-surface-700 rounded-t-lg shadow-sm' 
                    : 'text-surface-600 dark:text-surface-400 hover:bg-white/50 dark:hover:bg-surface-700/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'scorecard' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Batting</h3>
                  <div className="text-xs text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">
                    {match.teams[0].shortName} - 1st Innings
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        <th className="text-left py-2 font-medium text-surface-600 dark:text-surface-400">Batsman</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">R</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">B</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">4s</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">6s</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batsmen.map((batsman) => (
                        <tr key={batsman.id} className="border-b border-surface-200 dark:border-surface-700">
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="font-medium">{batsman.name}</span>
                              {batsman.isPlaying && (
                                <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-3 font-semibold">{batsman.runs}</td>
                          <td className="text-center py-3">{batsman.balls}</td>
                          <td className="text-center py-3">{batsman.fours}</td>
                          <td className="text-center py-3">{batsman.sixes}</td>
                          <td className="text-center py-3">{batsman.strikeRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-4">Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700">
                        <th className="text-left py-2 font-medium text-surface-600 dark:text-surface-400">Bowler</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">O</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">M</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">R</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">W</th>
                        <th className="text-center py-2 font-medium text-surface-600 dark:text-surface-400">ECON</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bowlers.map((bowler) => (
                        <tr key={bowler.id} className="border-b border-surface-200 dark:border-surface-700">
                          <td className="py-3">
                            <span className="font-medium">{bowler.name}</span>
                          </td>
                          <td className="text-center py-3">{bowler.overs.toFixed(1)}</td>
                          <td className="text-center py-3">{bowler.maidens}</td>
                          <td className="text-center py-3">{bowler.runs}</td>
                          <td className="text-center py-3 font-semibold">{bowler.wickets}</td>
                          <td className="text-center py-3">{bowler.economy.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'commentary' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Live Commentary</h3>
                <button 
                  onClick={refreshCommentary}
                  className="btn btn-outline"
                  disabled={isRefreshing}
                >
                  <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {commentary.slice(0, showFullCommentary ? commentary.length : 5).map((entry) => (
                  <div 
                    key={entry.id}
                    className={`p-3 rounded-lg ${
                      entry.type === 'BOUNDARY' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                        : entry.type === 'WICKET'
                          ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
                          : 'bg-surface-100 dark:bg-surface-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm px-2 py-0.5 bg-surface-200 dark:bg-surface-700 rounded">
                        {entry.over}
                      </span>
                      {entry.type === 'BOUNDARY' && (
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          BOUNDARY
                        </span>
                      )}
                      {entry.type === 'WICKET' && (
                        <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                          WICKET
                        </span>
                      )}
                    </div>
                    <p className="text-surface-700 dark:text-surface-300">{entry.description}</p>
                  </div>
                ))}
              </div>
              
              {commentary.length > 5 && (
                <button
                  onClick={() => setShowFullCommentary(!showFullCommentary)}
                  className="mt-4 w-full py-2 text-center text-primary dark:text-primary-light border border-primary/30 dark:border-primary-light/30 rounded-lg"
                >
                  {showFullCommentary ? "Show Less" : `Show All (${commentary.length}) Entries`}
                </button>
              )}
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-neu p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 size={16} />
                    Partnership Progress
                  </h3>
                  <div className="h-48 flex items-end gap-1">
                    {[10, 15, 8, 22, 18, 12, 25, 30, 16].map((value, index) => (
                      <div 
                        key={index} 
                        className="flex-1 bg-gradient-to-t from-primary to-primary-light dark:from-primary-dark dark:to-primary rounded-t-md"
                        style={{ height: `${value * 2}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-surface-500 dark:text-surface-400 text-center">
                    Wickets
                  </div>
                </div>
                
                <div className="card-neu p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users size={16} />
                    Top Performers
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                        Top Scorer
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Rohit Sharma</span>
                        <span className="font-bold">62 (48)</span>
                      </div>
                      <div className="mt-1 w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                        Top Wicket Taker
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Mitchell Starc</span>
                        <span className="font-bold">2/28 (3.2)</span>
                      </div>
                      <div className="mt-1 w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div className="bg-secondary h-1.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">
                        Best Economy
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Josh Hazlewood</span>
                        <span className="font-bold">6.00</span>
                      </div>
                      <div className="mt-1 w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-neu p-4">
                <h3 className="font-semibold mb-3">Match Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{match.scorecard[0].runs}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Total Runs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{match.scorecard[0].wickets}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Wickets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-500">9</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Boundaries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">6</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">Sixes</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainFeature;