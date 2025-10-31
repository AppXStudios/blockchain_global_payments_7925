import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsBar = ({ 
  selectedLinks, 
  onBulkActivate, 
  onBulkDeactivate, 
  onBulkDelete, 
  onClearSelection 
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleBulkAction = (action) => {
    if (action === 'delete') {
      setConfirmAction(action);
      setShowConfirmDialog(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action) => {
    switch (action) {
      case 'activate':
        onBulkActivate(selectedLinks);
        break;
      case 'deactivate':
        onBulkDeactivate(selectedLinks);
        break;
      case 'delete':
        onBulkDelete(selectedLinks);
        break;
    }
    onClearSelection();
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Confirm Deletion
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>
        
        <p className="text-sm text-foreground mb-6">
          Are you sure you want to delete {selectedLinks?.length} payment link{selectedLinks?.length > 1 ? 's' : ''}? 
          This will permanently remove the link{selectedLinks?.length > 1 ? 's' : ''} and all associated data.
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowConfirmDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => executeAction('delete')}
          >
            Delete {selectedLinks?.length} Link{selectedLinks?.length > 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
  );

  if (selectedLinks?.length === 0) return null;

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">
                {selectedLinks?.length} link{selectedLinks?.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={onClearSelection}
                className="ml-2 text-xs text-primary hover:text-primary/80 transition-micro"
              >
                Clear selection
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('activate')}
            >
              <Icon name="Play" size={14} className="mr-1" />
              Activate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('deactivate')}
            >
              <Icon name="Pause" size={14} className="mr-1" />
              Deactivate
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction('delete')}
            >
              <Icon name="Trash2" size={14} className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
      {showConfirmDialog && <ConfirmDialog />}
    </>
  );
};

export default BulkActionsBar;