from .string import lower_rest


def filter_state(state):
    state = lower_rest(state)

    if state == 'Elections':
        state = 'Election'

    return state
