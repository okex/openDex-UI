const initialState = {
  watchlist:[]
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return {
        ...state,
        ...action.data
      };
  }
}
