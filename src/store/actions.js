import * as types from './mutation_types'

export const addToCart = ({ commit }, product) => {
  if (product.inventory > 0) {
    commit(types.SET_DIGIT, {
      id: product.id
    })
  }
}
