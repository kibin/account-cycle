import R from 'ramda'

export const firstKey = R.compose(R.head, R.keys)
export const firstVal = R.compose(R.head, R.values)
export const capitalize = R.compose(R.join(``), R.adjust(R.toUpper, 0))

