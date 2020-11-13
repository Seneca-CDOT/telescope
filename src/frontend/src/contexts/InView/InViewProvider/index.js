import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { InViewStateContext, InViewDispatchContext } from '../InViewContext';
import { InViewReducer, initialState } from '../InViewReducer';

const InViewProvider = (props) => {
  const [state, dispatch] = useReducer(InViewReducer, initialState);
  return (
    <InViewStateContext.Provider value={state}>
      <InViewDispatchContext.Provider value={dispatch}>
        {props.children}
      </InViewDispatchContext.Provider>
    </InViewStateContext.Provider>
  );
};

InViewProvider.propTypes = {
  children: PropTypes.array,
};

export default InViewProvider;
