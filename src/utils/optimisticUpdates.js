import { useSelector, useDispatch } from 'react-redux';
import { addOptimisticUpdate, removeOptimisticUpdate } from '../store/slices/caseSlice';
import { addOptimisticUpdate as addStepOptimisticUpdate, removeOptimisticUpdate as removeStepOptimisticUpdate } from '../store/slices/stepSlice';

// Helper for case optimistic updates
export const useCaseOptimisticUpdates = () => {
  const dispatch = useDispatch();
  const optimisticUpdates = useSelector(state => state.case.optimisticUpdates);

  const addUpdate = (caseId, update) => {
    const updateKey = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch(addOptimisticUpdate({ 
      caseId, 
      update: { [updateKey]: update } 
    }));
    return updateKey;
  };

  const removeUpdate = (caseId, updateKey) => {
    dispatch(removeOptimisticUpdate({ caseId, key: updateKey }));
  };

  const getOptimisticCase = (caseId, originalCase) => {
    const updates = optimisticUpdates[caseId];
    if (!updates) return originalCase;

    return Object.values(updates).reduce((acc, update) => {
      return { ...acc, ...update };
    }, originalCase);
  };

  return {
    addUpdate,
    removeUpdate,
    getOptimisticCase,
    optimisticUpdates,
  };
};

// Helper for step optimistic updates
export const useStepOptimisticUpdates = () => {
  const dispatch = useDispatch();
  const optimisticUpdates = useSelector(state => state.step.optimisticUpdates);

  const addUpdate = (stepId, update) => {
    const updateKey = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch(addStepOptimisticUpdate({ 
      stepId, 
      update: { [updateKey]: update } 
    }));
    return updateKey;
  };

  const removeUpdate = (stepId, updateKey) => {
    dispatch(removeStepOptimisticUpdate({ stepId, key: updateKey }));
  };

  const getOptimisticStep = (stepId, originalStep) => {
    const updates = optimisticUpdates[stepId];
    if (!updates) return originalStep;

    return Object.values(updates).reduce((acc, update) => {
      return { ...acc, ...update };
    }, originalStep);
  };

  return {
    addUpdate,
    removeUpdate,
    getOptimisticStep,
    optimisticUpdates,
  };
};

// Combined optimistic updates helper
export const useOptimisticUpdates = () => {
  const caseHelpers = useCaseOptimisticUpdates();
  const stepHelpers = useStepOptimisticUpdates();

  return {
    case: caseHelpers,
    step: stepHelpers,
  };
};
