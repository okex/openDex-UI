const initialState = {
  liquidityInfo: [],
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return {
        ...state,
        ...action.data,
      };
  }
}
