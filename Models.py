import random

class GameInstance:
    def __init__(self, emoji_board, messenger_id, scrambler_id):
        self.messenger_id = messenger_id
        self.scrambler_id = scrambler_id
        self.emoji_board = emoji_board
        self.goal_index = random.randint(0,len(emoji_board))
        # Creates an anti_goal that excludes the regular goal
        anti_goal_range = range(0,self.goal_index) + range(self.goal_index+1,10)
        self.anti_goal = random.choice(anti_goal_range)
        self.message = ''
        self.scrambled_message = ''
        self.guesses = []

class Guess:
    def __init__(self, gameInstance, guesser_id, guess_index):
        self.gameInstance = gameInstance
        self.guesser_id = guesser_id
        self.guess_index = guess_index

class Player:
    def __init__(self, client, username, score=0):
        self.client = client
        self.username = username
        self.score = score

    def to_dict(self):
        x = self.__dict__
        del x['client']
        return x
