import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-amber-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-surface-800 dark:text-surface-100 mb-4">
        Page Not Found
      </h1>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back to the cricket action.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="btn btn-primary px-6 py-3"
      >
        <Home size={18} className="mr-2" />
        Back to Home
      </motion.button>
      
      <div className="mt-12 w-full max-w-sm">
        <div className="card-neu p-4 text-sm text-surface-600 dark:text-surface-400">
          <p>Looking for live cricket scores? Head back to the homepage to catch all the action!</p>
        </div>
      </div>
    </motion.div>
  );
}

export default NotFound;