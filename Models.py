import random

class GameInstance:
    def __init__(self, emoji_board, messenger_id, scrambler_id):
        self.messenger_id = messenger_id
        self.scrambler_id = scrambler_id
        self.emoji_board = emoji_board
        self.goal_index = random.randint(0, len(emoji_board) - 1)
        # Creates an anti_goal that excludes the regular goal
        anti_goal_range = [n for n in range(len(emoji_board)) if n != self.goal_index]
        self.anti_goal = random.choice(anti_goal_range)
        self.message = ''
        self.scrambled_message = ''
        self.votes = {}

    def to_dict(self):
        return {
            k: v
            for k, v in self.__dict__.items()
        }


class Player:
    def __init__(self, client, username, score=0):
        self.client = client
        self.username = username
        self.score = score

    def to_dict(self):
        return {
            k: v
            for k, v in self.__dict__.items()
            if k != 'client'
        }
