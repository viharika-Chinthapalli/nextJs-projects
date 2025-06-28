import { Check, Clock } from 'lucide-react';

export const StatusBadge: React.FC<{ status: 'pending' | 'accepted' }> = ({ status }) => {
  const isAccepted = status === 'accepted';
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
      isAccepted 
        ? 'bg-green-50 text-green-700 border border-green-200' 
        : 'bg-orange-50 text-orange-700 border border-orange-200'
    }`}>
      {isAccepted ? (
        <Check className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {isAccepted ? 'Accepted' : 'Pending'}
    </div>
  );
};